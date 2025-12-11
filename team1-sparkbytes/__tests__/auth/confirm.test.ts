import { GET } from '@/app/auth/confirm/route';

const mockVerifyOtp = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      verifyOtp: mockVerifyOtp,
    },
  })),
}));

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({ redirect: (url: string) => mockRedirect(url) }));

describe('GET /auth/confirm', () => {
  beforeEach(() => {
    mockVerifyOtp.mockClear();
    mockRedirect.mockClear();
  });

  test('redirects to error when token or type missing', async () => {
    const req = { url: 'http://localhost/auth/confirm' } as any;
    await GET(req);
    expect(mockRedirect).toHaveBeenCalledWith('/auth/error?error=No token hash or type');
  });

  test('redirects to next when verifyOtp succeeds', async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });
    const req = { url: 'http://localhost/auth/confirm?token_hash=abc&type=signup&next=/dashboard' } as any;
    await GET(req);
    expect(mockVerifyOtp).toHaveBeenCalledWith({ type: 'signup', token_hash: 'abc' });
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  test('redirects to error when verifyOtp returns an error', async () => {
    mockVerifyOtp.mockResolvedValue({ error: { message: 'bad token' } });
    const req = { url: 'http://localhost/auth/confirm?token_hash=abc&type=signup' } as any;
    await GET(req);
    expect(mockRedirect).toHaveBeenCalledWith('/auth/error?error=bad token');
  });
});
