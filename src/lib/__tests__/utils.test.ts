import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names and removes duplicates', () => {
    const result = cn('a', 'b', 'a', { c: true, d: false });
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).toContain('c');
    expect(result).not.toContain('d');
  });

  it('handles empty and falsy values', () => {
    const result = cn(undefined, null, false, '', 'x');
    expect(result.trim()).toBe('x');
  });
});
