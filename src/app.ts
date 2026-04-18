import * as dotenv from 'dotenv';
dotenv.config();

import { checkEnvVariables } from './helpers/envCheck';
checkEnvVariables();

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { makeLogger } from './logger/Config';
import path from 'path';
import { config } from './config';
import { DataBaseLogger } from './logger/DatabaseLogger';
import cors from 'cors';
// import { graphqlUploadExpress } from "graphql-upload";

const FILE_NAME = 'logs';
const LOG_FILE_PATH = path.join(__dirname, 'log', FILE_NAME);
console.log('logger file path ' + LOG_FILE_PATH);

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cron from 'node-cron';
import { requestLogger } from './common_middleware/requestLogger';
import { createGeneralRateLimiter } from './common_middleware/rateLimiter';
import { v1Router } from './routes';
import StripeWebhookRouter from './routes/webhooks/StripeWebhookRouter';
import RazorpayWebhookRouter from './routes/webhooks/RazorpayWebhookRouter';

import swaggerOptions from './swagger';
// opening a db connection
import { DataBase } from './db/connection';
import { startWorkers } from './jobs';
import { sweepMonthlyExpiry } from './jobs/cron/monthly_expiry_sweeper';
import { reconcileLedgerDrift } from './jobs/cron/ledger_reconciliation';

async function startServer() {
  try {
    // Initialize database connection
    await DataBase.getDatabaseConnection();

    // Initialize loggers
    global.logger = makeLogger({
      logFile: config.logger.LOG_IN_FILE,
      FILE_PATH: LOG_FILE_PATH,
    });

    global.dbLogger = new DataBaseLogger();
    await global.dbLogger.connect(); // ✅ Await this to ensure it's ready

    const app: Application = express();

    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));
    // Stripe + Razorpay webhooks MUST be mounted before body parsers — signature verification
    // needs the exact raw request bytes.
    app.use('/api/v1/webhooks', StripeWebhookRouter);
    app.use('/api/v1/webhooks', RazorpayWebhookRouter);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(mongoSanitize());
    app.use(requestLogger);
    app.use(createGeneralRateLimiter());

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api/v1', v1Router);

    // Start BullMQ workers
    startWorkers();
    global.logger.info("BullMQ workers started");

    // Hourly sweep: reconcile credit_balance cache for users whose monthly
    // subscription grants have just expired.
    cron.schedule('0 * * * *', async () => {
      try {
        const r = await sweepMonthlyExpiry();
        if (r.expiredGrantCount > 0) {
          console.log(
              `[cron] monthly expiry sweep: ${r.expiredGrantCount} grants, ${r.affectedUserCount} users`,
          );
        }
      } catch (e) {
        console.error('[cron] monthly expiry sweep failed:', e);
      }
    });

    // Nightly 03:00 reconciliation: detect and correct drift between the
    // credit_balance cache and the ledger-truth balance.
    cron.schedule('0 3 * * *', async () => {
      try {
        const r = await reconcileLedgerDrift();
        console.log(
            `[cron] nightly reconciliation: checked=${r.checked}, drift=${r.driftCount}`,
        );
      } catch (e) {
        console.error('[cron] nightly reconciliation failed:', e);
      }
    });

    Sentry.setupExpressErrorHandler(app);

    app.use('*', (req, res) => {
      res.status(404).send({
        isSuccess: false,
        data: null,
        statusCode: 404,
        errors: [{
          code: 404,
          message: 'Error 404',
        }],
      });
    });

    const PORT = process.env.PORT || 8010;
    app.listen(PORT, () => {
      console.log(`User-Management Server is listening on ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

export { startServer };
