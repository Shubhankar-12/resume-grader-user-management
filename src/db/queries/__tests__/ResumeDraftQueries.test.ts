import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeDraftQueries } from '../ResumeDraftQueries';

// A valid 24-char hex ObjectId string (the query layer constructs `new ObjectId(id)`).
const OID = '507f1f77bcf86cd799439011';

function makeModel() {
  return {
    create: vi.fn(),
    aggregate: vi.fn(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
  } as any;
}

describe('ResumeDraftQueries', () => {
  let model: any;
  let q: ResumeDraftQueries;
  beforeEach(() => {
    model = makeModel();
    q = new ResumeDraftQueries(model);
  });

  it('create inserts an ENABLED draft and shapes resume_draft_id', async () => {
    model.create.mockResolvedValue({
      toObject: () => ({ _id: OID, user_id: 'u1', title: 'CV', template_id: 'classic' }),
    });
    const out = await q.create({ user_id: 'u1', title: 'CV' });
    expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'u1', title: 'CV', status_field: 'ENABLED' })
    );
    expect(out).toMatchObject({ resume_draft_id: OID, title: 'CV' });
    expect(out._id).toBeUndefined();
  });

  it('getByUserId returns projected summaries', async () => {
    model.aggregate.mockResolvedValue([
      { resume_draft_id: OID, title: 'CV', template_id: 'modern', updated_on: new Date(0) },
    ]);
    const rows = await q.getByUserId('u1');
    expect(model.aggregate).toHaveBeenCalled();
    expect(rows[0]).toMatchObject({ resume_draft_id: OID, template_id: 'modern' });
  });

  it('getById returns null when not found', async () => {
    model.findOne.mockReturnValue({ lean: () => Promise.resolve(null) });
    const out = await q.getById(OID);
    expect(out).toBeNull();
  });

  it('update sets fields and returns the shaped doc', async () => {
    model.updateOne.mockResolvedValue({ acknowledged: true });
    model.findOne.mockReturnValue({ lean: () => Promise.resolve({ _id: OID, title: 'New' }) });
    const out = await q.update({ resume_draft_id: OID, title: 'New' });
    expect(model.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        { $set: { title: 'New' } }
    );
    expect(out).toMatchObject({ resume_draft_id: OID, title: 'New' });
  });

  it('disable rejects a non-owner', async () => {
    model.findOne.mockReturnValue({ lean: () => Promise.resolve({ _id: OID, user_id: 'other' }) });
    await expect(q.disable(OID, 'u1')).rejects.toThrow(/Unauthorized/);
  });

  it('disable flips status_field for the owner', async () => {
    model.findOne.mockReturnValue({ lean: () => Promise.resolve({ _id: OID, user_id: 'u1' }) });
    model.updateOne.mockResolvedValue({ acknowledged: true });
    const out = await q.disable(OID, 'u1');
    expect(model.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        { $set: { status_field: 'DISABLED' } }
    );
    expect(out).toEqual({ ok: true });
  });
});
