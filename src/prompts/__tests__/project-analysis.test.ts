import { describe, it, expect } from 'vitest';
import { generateResumeProjectAnalysis } from '../index';

const MOCK_GITHUB_PROJECTS = [
  {
    id: 1,
    name: 'distributed-task-scheduler',
    description: 'A fault-tolerant distributed task scheduler built with Go and Redis, supporting priorities and retries',
    stars: 312,
    language: 'Go',
    languageColor: '#00ADD8',
    topics: ['distributed-systems', 'golang', 'redis', 'task-queue'],
    updated_at: '2024-03-15T10:00:00Z',
    additional_comments: 'Used in production at a startup serving 10k+ daily active users',
    readme: 'This project implements a distributed task scheduler using Go and Redis. Features include: priority queues, automatic retries with exponential backoff, fault tolerance via leader election, and a REST API for task management. Designed for horizontal scalability.',
  },
  {
    id: 2,
    name: 'k8s-autoscaler-hpa-optimizer',
    description: 'Custom Kubernetes HPA controller with ML-based predictive scaling to reduce over-provisioning',
    stars: 187,
    language: 'Python',
    languageColor: '#3572A5',
    topics: ['kubernetes', 'autoscaling', 'machine-learning', 'cloud'],
    updated_at: '2024-01-20T08:30:00Z',
    additional_comments: 'Presented at KubeCon 2023 as a lightning talk',
    readme: 'ML-based predictive autoscaler for Kubernetes. Uses time-series forecasting to pre-scale pods before traffic spikes, reducing cold-start latency and over-provisioning costs by up to 35%.',
  },
  {
    id: 3,
    name: 'opentelemetry-go-middleware',
    description: 'Lightweight OpenTelemetry middleware for Go HTTP servers with automatic span creation and propagation',
    stars: 94,
    language: 'Go',
    languageColor: '#00ADD8',
    topics: ['opentelemetry', 'observability', 'golang', 'tracing'],
    updated_at: '2023-11-05T14:00:00Z',
    readme: 'Drop-in middleware for Go HTTP servers that automatically instruments requests with OpenTelemetry traces, metrics, and logs. Compatible with net/http, gin, and echo frameworks.',
  },
];

describe.skipIf(!process.env.RUN_AI_TESTS)('Project Analysis Integration Tests', () => {
  it('analyzes exactly 3 GitHub projects for a backend engineering role', async () => {
    const result = await generateResumeProjectAnalysis('Senior Backend Engineer', MOCK_GITHUB_PROJECTS);

    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBe(3);

    for (const item of result as Array<{ ai_score: number; relevance: string; id: number }>) {
      expect(typeof item.ai_score).toBe('number');
      expect(item.ai_score).toBeGreaterThanOrEqual(0);
      expect(item.ai_score).toBeLessThanOrEqual(100);

      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(item.relevance);
    }
  }, 30000);

  it('assigns high relevance to at least one backend engineering project', async () => {
    const result = await generateResumeProjectAnalysis('Senior Backend Engineer', MOCK_GITHUB_PROJECTS);

    const items = result as Array<{ ai_score: number; relevance: string; id: number }>;
    const hasHighRelevance = items.some((item) => item.relevance === 'HIGH');
    expect(hasHighRelevance).toBe(true);
  }, 30000);
});
