/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  IApplicationModel,
} from '../application/types';

export class ApplicationQueries {
  private applicationModel: IApplicationModel;

  constructor(applicationModel: IApplicationModel) {
    this.applicationModel = applicationModel;
  }

  async create(data: any): Promise<any> {
    // Shift all existing cards in the same status column up by 1 to make room at position 0
    await this.applicationModel.updateMany(
        {
          user_id: data.user_id,
          status: data.status,
          status_field: 'ENABLED',
        },
        { $inc: { position: 1 } }
    );

    return await this.applicationModel.create({ ...data, position: 0 });
  }

  async getByUserId(data: {
    user_id: string;
    search?: string;
    sort?: string;
  }): Promise<any> {
    const aggregateQuery: any[] = [];

    // 1. Match user_id + ENABLED
    aggregateQuery.push({
      $match: {
        user_id: data.user_id,
        status_field: 'ENABLED',
      },
    });

    // 2. Optional search on company/role
    if (data.search) {
      const escapedSearch = data.search.replace(/[()]/g, '\\$&');
      aggregateQuery.push({
        $match: {
          $or: [
            { company: { $regex: escapedSearch, $options: 'i' } },
            { role: { $regex: escapedSearch, $options: 'i' } },
          ],
        },
      });
    }

    // 3. Sort by position ascending; created_on by sort direction
    const sortDirection = data.sort === 'asc' ? 1 : -1;
    aggregateQuery.push({
      $sort: { position: 1, created_on: sortDirection },
    });

    // 4. Project: rename _id to application_id, include all fields
    aggregateQuery.push({
      $project: {
        _id: 0,
        application_id: '$_id',
        user_id: 1,
        company: 1,
        role: 1,
        job_url: 1,
        job_description: 1,
        status: 1,
        position: 1,
        notes: 1,
        applied_date: 1,
        resume_id: 1,
        cover_letter_id: 1,
        status_field: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    // 5. Group by status field
    aggregateQuery.push({
      $group: {
        _id: '$status',
        cards: { $push: '$$ROOT' },
      },
    });

    const result = await this.applicationModel.aggregate(aggregateQuery);

    // 6. Build response with all 6 statuses (empty arrays for missing)
    const grouped: Record<string, any[]> = {};
    for (const statusGroup of result) {
      grouped[statusGroup._id] = statusGroup.cards;
    }

    const response: Record<string, any[]> = {};
    for (const status of APPLICATION_STATUSES) {
      response[status] = grouped[status] ?? [];
    }

    return response;
  }

  async getById(applicationId: string): Promise<any> {
    return await this.applicationModel.findOne({
      _id: new ObjectId(applicationId),
      status_field: 'ENABLED',
    });
  }

  async update(data: any): Promise<any> {
    const { application_id, ...fields } = data;
    return await this.applicationModel.updateOne(
        { _id: new ObjectId(application_id) },
        { $set: fields }
    );
  }

  async reorder(data: {
    application_id: string;
    new_status: string;
    new_position: number;
    user_id: string;
  }): Promise<any> {
    // 1. Find the card and verify ownership
    const card = await this.applicationModel.findOne({
      _id: new ObjectId(data.application_id),
      status_field: 'ENABLED',
    });

    if (!card) {
      throw new Error('Application not found');
    }

    if (String(card.user_id) !== String(data.user_id)) {
      throw new Error('Unauthorized');
    }

    const oldStatus = card.status;
    const oldPosition = card.position;
    const newStatus = data.new_status as ApplicationStatus;
    const newPosition = data.new_position;

    if (oldStatus !== newStatus) {
      // Cross-column move:
      // a) Close gap in old column — decrement positions above old position
      await this.applicationModel.updateMany(
          {
            user_id: data.user_id,
            status: oldStatus,
            status_field: 'ENABLED',
            position: { $gt: oldPosition },
          },
          { $inc: { position: -1 } }
      );

      // b) Make room in new column — increment positions at or after new position
      await this.applicationModel.updateMany(
          {
            user_id: data.user_id,
            status: newStatus,
            status_field: 'ENABLED',
            position: { $gte: newPosition },
          },
          { $inc: { position: 1 } }
      );
    } else {
      // Same-column move
      if (newPosition < oldPosition) {
        // Moving up: shift cards between new and old positions down by 1
        await this.applicationModel.updateMany(
            {
              user_id: data.user_id,
              status: oldStatus,
              status_field: 'ENABLED',
              position: { $gte: newPosition, $lt: oldPosition },
              _id: { $ne: new ObjectId(data.application_id) },
            },
            { $inc: { position: 1 } }
        );
      } else if (newPosition > oldPosition) {
        // Moving down: shift cards between old and new positions up by 1
        await this.applicationModel.updateMany(
            {
              user_id: data.user_id,
              status: oldStatus,
              status_field: 'ENABLED',
              position: { $gt: oldPosition, $lte: newPosition },
              _id: { $ne: new ObjectId(data.application_id) },
            },
            { $inc: { position: -1 } }
        );
      }
    }

    // 4. Update the card's status and position
    return await this.applicationModel.updateOne(
        { _id: new ObjectId(data.application_id) },
        { $set: { status: newStatus, position: newPosition } }
    );
  }

  async disable(applicationId: string, userId: string): Promise<any> {
    // 1. Find the card and verify ownership
    const card = await this.applicationModel.findOne({
      _id: new ObjectId(applicationId),
      status_field: 'ENABLED',
    });

    if (!card) {
      throw new Error('Application not found');
    }

    if (String(card.user_id) !== String(userId)) {
      throw new Error('Unauthorized');
    }

    // 2. Soft-delete: set status_field to DISABLED
    await this.applicationModel.updateOne(
        { _id: new ObjectId(applicationId) },
        { $set: { status_field: 'DISABLED' } }
    );

    // 3. Close gap in the column — decrement positions above this card
    return await this.applicationModel.updateMany(
        {
          user_id: userId,
          status: card.status,
          status_field: 'ENABLED',
          position: { $gt: card.position },
        },
        { $inc: { position: -1 } }
    );
  }
}
