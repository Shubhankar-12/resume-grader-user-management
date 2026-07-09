/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import { IResumeDraftModel, SECTION_KEYS } from '../resume_draft/types';

export class ResumeDraftQueries {
  private resumeDraftModel: IResumeDraftModel;

  constructor(resumeDraftModel: IResumeDraftModel) {
    this.resumeDraftModel = resumeDraftModel;
  }

  private shape(doc: any): any {
    if (!doc) return doc;
    const plain = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    const { _id, __v, ...rest } = plain;
    return { resume_draft_id: String(_id), ...rest };
  }

  async create(data: any): Promise<any> {
    const doc = await this.resumeDraftModel.create({
      section_order: [...SECTION_KEYS],
      ...data,
      status_field: 'ENABLED',
    });
    return this.shape(doc);
  }

  async getByUserId(userId: string): Promise<any[]> {
    return await this.resumeDraftModel.aggregate([
      { $match: { user_id: userId, status_field: 'ENABLED' } },
      { $sort: { updated_on: -1 } },
      {
        $project: {
          _id: 0,
          resume_draft_id: '$_id',
          title: 1,
          template_id: 1,
          updated_on: 1,
        },
      },
    ]);
  }

  async getById(resumeDraftId: string): Promise<any | null> {
    const doc = await this.resumeDraftModel
        .findOne({ _id: new ObjectId(resumeDraftId), status_field: 'ENABLED' })
        .lean();
    return doc ? this.shape(doc) : null;
  }

  async update(data: { resume_draft_id: string } & Record<string, any>): Promise<any | null> {
    const { resume_draft_id, ...fields } = data;
    await this.resumeDraftModel.updateOne(
        { _id: new ObjectId(resume_draft_id), status_field: 'ENABLED' },
        { $set: fields }
    );
    const updated = await this.resumeDraftModel
        .findOne({ _id: new ObjectId(resume_draft_id), status_field: 'ENABLED' })
        .lean();
    return updated ? this.shape(updated) : null;
  }

  async disable(resumeDraftId: string, userId: string): Promise<{ ok: true }> {
    const doc: any = await this.resumeDraftModel
        .findOne({ _id: new ObjectId(resumeDraftId), status_field: 'ENABLED' })
        .lean();
    if (!doc) throw new Error('Resume draft not found');
    if (String(doc.user_id) !== String(userId)) throw new Error('Unauthorized');

    await this.resumeDraftModel.updateOne(
        { _id: new ObjectId(resumeDraftId) },
        { $set: { status_field: 'DISABLED' } }
    );
    return { ok: true };
  }
}
