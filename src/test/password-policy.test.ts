import { describe, expect, it } from 'vitest';
import { strongPasswordSchema } from '@/lib/passwordPolicy';

describe('password strength rules', () => {
  it('accepts a 12+ character mixed password', () => {
    expect(strongPasswordSchema.safeParse('Civiscope2026!').success).toBe(true);
  });

  it('rejects passwords shorter than 12 characters', () => {
    expect(strongPasswordSchema.safeParse('Civi2026!').success).toBe(false);
  });

  it('requires at least one uppercase letter', () => {
    expect(strongPasswordSchema.safeParse('civiscope2026!').success).toBe(false);
  });

  it('requires at least one lowercase letter', () => {
    expect(strongPasswordSchema.safeParse('CIVISCOPE2026!').success).toBe(false);
  });

  it('requires at least one number', () => {
    expect(strongPasswordSchema.safeParse('CiviscopeAbc!').success).toBe(false);
  });

  it('requires at least one symbol', () => {
    expect(strongPasswordSchema.safeParse('Civiscope2026').success).toBe(false);
  });
});