import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProject } from '../react-app/hooks/useProject';

describe('useProject - Glitch NaN edge cases', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response());
  });

  it('addClip prevents NaN/Infinity in time properties', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      // Mock assets so we can add a clip
      result.current.setClips([]);
    });

    act(() => {
      // Try to add a clip with NaN
      result.current.addClip('asset-1', 'V1', NaN, NaN, NaN, NaN);
    });

    const clip = result.current.clips[0];
    expect(Number.isNaN(clip.start)).toBe(false);
    expect(Number.isNaN(clip.duration)).toBe(false);
    expect(Number.isNaN(clip.inPoint)).toBe(false);
    expect(Number.isNaN(clip.outPoint)).toBe(false);
  });

  it('moveClip prevents NaN start times', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      result.current.addClip('asset-1', 'V1', 0, 5, 0, 5);
    });

    const clipId = result.current.clips[0].id;

    act(() => {
      result.current.moveClip(clipId, NaN, 'V1');
    });

    expect(Number.isNaN(result.current.clips[0].start)).toBe(false);
  });

  it('resizeClip prevents NaN time properties', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      result.current.addClip('asset-1', 'V1', 0, 5, 0, 5);
    });

    const clipId = result.current.clips[0].id;

    act(() => {
      result.current.resizeClip(clipId, NaN, NaN);
    });

    expect(Number.isNaN(result.current.clips[0].inPoint)).toBe(false);
  });

  it('splitClip prevents NaN splitTime', () => {
    const { result } = renderHook(() => useProject());

    act(() => {
      result.current.addClip('asset-1', 'V1', 0, 5, 0, 5);
    });

    const clipId = result.current.clips[0].id;

    let splitResult: string | null = null;
    act(() => {
      splitResult = result.current.splitClip(clipId, NaN);
    });

    expect(splitResult).toBeNull();
  });
});
