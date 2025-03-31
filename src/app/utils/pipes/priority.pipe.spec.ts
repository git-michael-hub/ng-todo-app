import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  describe('Happy Path', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should return an empty string for "low" priority', () => {
      expect(pipe.transform('low')).toBe('');
    });

    it('should return "⚠️" for "medium" priority', () => {
      expect(pipe.transform('medium')).toBe('⚠️');
    });

    it('should return "❗️" for "high" priority', () => {
      expect(pipe.transform('high')).toBe('❗️');
    });

    it('should return correct values with and without `withIcon` argument', () => {
      expect(pipe.transform('high', true)).toBe('❗️'); // Explicitly passing true
      expect(pipe.transform('high', false)).toBe('❗️'); // Explicitly passing false
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined if input is null', () => {
      expect(pipe.transform(null as any)).toBeUndefined();
    });

    it('should return undefined if input is undefined', () => {
      expect(pipe.transform(undefined as any)).toBeUndefined();
    });

    it('should return undefined if input is an empty string', () => {
      expect(pipe.transform('' as any)).toBeUndefined();
    });

    it('should return undefined if input is an invalid priority string', () => {
      expect(pipe.transform('critical' as any)).toBeUndefined();
      expect(pipe.transform('urgent' as any)).toBeUndefined();
      expect(pipe.transform('low ' as any)).toBeUndefined(); // Extra space test
    });

    it('should handle numeric values gracefully', () => {
      expect(pipe.transform(123 as any)).toBeUndefined();
      expect(pipe.transform(NaN as any)).toBeUndefined();
    });

    it('should handle special characters as input', () => {
      expect(pipe.transform('@high' as any)).toBeUndefined();
      expect(pipe.transform('!medium' as any)).toBeUndefined();
    });
  });

});
