import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProject } from '../react-app/hooks/useProject';

describe('useProject - Glitch NaN edge cases for captions', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response());
  });

  it('addCaptionClip prevents NaN in time properties', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      result.current.addCaptionClip([{text: 'test', start: 0, end: 1}], NaN, NaN);
    });

    const clip = result.current.clips[0];
    expect(Number.isNaN(clip.start)).toBe(false);
    expect(Number.isNaN(clip.duration)).toBe(false);
  });

  it('addCaptionClipsBatch prevents NaN in time properties', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      result.current.addCaptionClipsBatch([{
        words: [{text: 'test', start: 0, end: 1}],
        start: NaN,
        duration: NaN
      }]);
    });

    const clip = result.current.clips[0];
    expect(Number.isNaN(clip.start)).toBe(false);
    expect(Number.isNaN(clip.duration)).toBe(false);
  });
});
