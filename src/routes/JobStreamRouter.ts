import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jobQueries } from '../db/queries/JobQueries';
import { StreamBridge } from '../prompts/stream';

const router = express.Router();

router.get('/stream', async (req: Request, res: Response): Promise<void> => {
  const { job_id, token } = req.query;

  if (!job_id || typeof job_id !== 'string') {
    res.status(400).json({ message: 'Missing job_id query parameter' });
    return;
  }

  if (!token || typeof token !== 'string') {
    res.status(401).json({ message: 'Missing token query parameter' });
    return;
  }

  // Authenticate via JWT query param
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.CUSTOMER_POLICY_JWT_KEY as string);
  } catch {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Authentication failed' } });
    return;
  }

  if (!decoded || !decoded.user || !decoded.user.id) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  const userId = decoded.user.id as string;

  // Verify job belongs to this user
  const job = await jobQueries.getByIdAndUserId(job_id, userId);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // If already completed, send done event immediately
  if (job.status === 'completed') {
    const coverId = (job.result as Record<string, unknown>)?.cover_letter_id?.toString() ?? '';
    res.write(`data: ${JSON.stringify({ type: 'done', content: '', coverId })}\n\n`);
    res.end();
    return;
  }

  // If already failed, send error event
  if (job.status === 'failed') {
    res.write(`data: ${JSON.stringify({ type: 'error', content: job.error ?? 'Job failed' })}\n\n`);
    res.end();
    return;
  }

  // Subscribe to Redis stream channel
  const bridge = new StreamBridge();
  let finished = false;

  // 120 second timeout
  const timeout = setTimeout(() => {
    if (!finished) {
      finished = true;
      res.write(`data: ${JSON.stringify({ type: 'error', content: 'Stream timeout' })}\n\n`);
      res.end();
    }
  }, 120_000);

  req.on('close', () => {
    finished = true;
    clearTimeout(timeout);
  });

  try {
    for await (const event of bridge.subscribe(job_id)) {
      if (finished) break;

      if (event.type === 'token') {
        res.write(`data: ${JSON.stringify({ type: 'token', content: event.content })}\n\n`);
      } else if (event.type === 'done') {
        // Fetch the latest job record to get cover_letter_id
        const completedJob = await jobQueries.getById(job_id);
        const coverId = (completedJob?.result as Record<string, unknown>)?.cover_letter_id?.toString() ?? '';
        res.write(`data: ${JSON.stringify({ type: 'done', content: '', coverId })}\n\n`);
        finished = true;
        break;
      } else if (event.type === 'error') {
        res.write(`data: ${JSON.stringify({ type: 'error', content: event.content })}\n\n`);
        finished = true;
        break;
      }
    }
  } catch (err) {
    if (!finished) {
      const message = err instanceof Error ? err.message : 'Stream error';
      res.write(`data: ${JSON.stringify({ type: 'error', content: message })}\n\n`);
    }
  } finally {
    clearTimeout(timeout);
    if (!res.writableEnded) {
      res.end();
    }
  }
});

export { router as jobStreamRouter };
