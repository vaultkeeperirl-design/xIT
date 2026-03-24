import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProject, TimelineClip } from '../react-app/hooks/useProject';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => Math.random().toString(36).substring(2, 9)
});

describe('glitch: addCaptionClip and addCaptionClipsBatch input validation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should validate and clamp NaN and negative values in addCaptionClip', () => {
    const { result } = renderHook(() => useProject());

    let clip: TimelineClip | undefined;
    act(() => {
      clip = result.current.addCaptionClip([], NaN, -5);
    });

    expect(Number.isFinite(clip!.start)).toBe(true);
    expect(clip!.start).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(clip!.duration)).toBe(true);
    expect(clip.duration).toBeGreaterThanOrEqual(0.1); // Assuming some min duration or 0
    expect(Number.isFinite(clip.outPoint)).toBe(true);
    expect(clip!.outPoint).toBeGreaterThanOrEqual(0.1);
  });

  it('should validate and clamp NaN and negative values in addCaptionClipsBatch', () => {
    const { result } = renderHook(() => useProject());

    let clips: TimelineClip[] = [];
    act(() => {
      clips = result.current.addCaptionClipsBatch([
        { words: [], start: NaN, duration: Infinity },
        { words: [], start: -10, duration: -2 }
      ]);
    });

    expect(clips).toHaveLength(2);

    expect(Number.isFinite(clips[0].start)).toBe(true);
    expect(clips[0].start).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(clips[0].duration)).toBe(true);
    expect(clips[0].duration).toBeGreaterThanOrEqual(0.1);

    expect(Number.isFinite(clips[1].start)).toBe(true);
    expect(clips[1].start).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(clips[1].duration)).toBe(true);
    expect(clips[1].duration).toBeGreaterThanOrEqual(0.1);
  });
});
