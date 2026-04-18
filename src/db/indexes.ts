import mongoose from 'mongoose';
import { makeLogger } from '../logger/Config';

const logger = makeLogger({});

export async function ensureIndexes(): Promise<void> {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    await db.collection('users').createIndex({ email: 1 }, {
      unique: true,
      background: true,
    });
    await db.collection('users').createIndex({ 'githubProfile.id': 1 }, {
      sparse: true,
      background: true,
    });
    await db.collection('user_resumes').createIndex({
      user_id: 1,
      createdAt: -1,
    }, { background: true });
    await db.collection('user_resumes').createIndex({ status: 1 }, { background: true });
    await db.collection('cover_letters').createIndex({
      user_id: 1,
      createdAt: -1,
    }, { background: true });
    await db.collection('payment_subscriptions').createIndex({
      user_id: 1,
      status: 1,
    }, { background: true });
    await db.collection('extracted_resumes').createIndex({ resume_id: 1 }, { background: true });
    await db.collection('reports').createIndex({ resume_id: 1 }, { background: true });
    await db.collection('tailored_resumes').createIndex({
      user_id: 1,
      resume_id: 1,
    }, { background: true });
    await db.collection('jobs').createIndex({
      user_id: 1,
      type: 1,
      status: 1,
    }, { background: true });
    await db.collection('plan_catalog').createIndex({
      plan_id: 1,
      region: 1,
    }, { unique: true, background: true });
    await db.collection('credit_transactions').createIndex(
      { user_id: 1, reference_id: 1 },
      { unique: true, background: true, name: 'unique_user_reference' },
    );
    await db.collection('credit_transactions').createIndex(
      { user_id: 1, expires_on: 1, created_on: 1 },
      { background: true, name: 'balance_aggregation' },
    );
    await db.collection('credit_packs').createIndex(
      { pack_id: 1, region: 1 },
      { unique: true, background: true, name: 'unique_pack_region' },
    );

    logger.info('MongoDB indexes ensured');
  } catch (err) {
    logger.error('Failed to create indexes', err);
  }
}
