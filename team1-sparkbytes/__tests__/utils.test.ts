import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('returns joined class names', () => {
    const result = cn('a', 'b', { hidden: false } as any);
    expect(typeof result).toBe('string');
    expect(result).toContain('a');
    expect(result).toContain('b');
  });
});
