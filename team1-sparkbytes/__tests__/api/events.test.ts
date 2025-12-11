import { POST } from '@/app/api/events/route';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, opts?: any) => ({ body, status: opts?.status ?? 200 }),
  },
}));

const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: mockInsert.mockImplementation(() => ({
        select: mockSelect.mockImplementation(() => ({
          single: mockSingle,
        })),
      })),
    })),
  })),
}));

describe('POST /api/events', () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockSelect.mockClear();
    mockSingle.mockClear();
  });

  test('returns 400 when required fields are missing', async () => {
    const req = { json: async () => ({ title: 'Hi' }) } as any;
    const res: any = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing required fields/);
  });

  test('returns 400 for invalid capacity', async () => {
    const body = {
      title: 'T',
      description: 'D',
      location: 'L',
      campus: 'C',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      capacity: 'not-a-number',
    };
    const req = { json: async () => body } as any;
    const res: any = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Capacity must be a number/);
  });

  test('returns 400 for invalid dates', async () => {
    const body = {
      title: 'T',
      description: 'D',
      location: 'L',
      campus: 'C',
      start_time: 'invalid-date',
      end_time: 'also-invalid',
      capacity: 10,
    };
    const req = { json: async () => body } as any;
    const res: any = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/start_time and end_time must be valid/);
  });

  test('inserts event and returns 200 on success', async () => {
    const body = {
      title: 'Party',
      description: 'Fun',
      location: 'Hall',
      campus: 'Main',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      capacity: 50,
    };

    mockSingle.mockResolvedValue({ data: { id: 123, ...body }, error: null });

    const req = { json: async () => body } as any;
    const res: any = await POST(req);

    expect(res.status).toBe(200);
    expect(res.body.event).toBeDefined();
    expect(res.body.event.id).toBe(123);
  });
});
