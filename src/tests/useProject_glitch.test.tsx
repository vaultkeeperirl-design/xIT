import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('addClip, moveClip, resizeClip, splitClip should handle invalid numerical inputs', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    // Attempt to add a clip with invalid numerical inputs (NaN, -5, Infinity)
    const clip = result.current!.addClip('test-asset', 'V1', NaN, undefined, -5, Infinity);
    clipId = clip.id;
  });

  let clip = result.current!.clips.find(c => c.id === clipId);
  expect(clip).toBeDefined();

  // start should be clamped to 0 if NaN or negative
  expect(Number.isFinite(clip?.start)).toBe(true);
  expect(clip?.start).toBeGreaterThanOrEqual(0);

  // inPoint should be clamped to 0 if negative
  expect(Number.isFinite(clip?.inPoint)).toBe(true);
  expect(clip?.inPoint).toBeGreaterThanOrEqual(0);

  // outPoint should be finite, not infinity
  expect(Number.isFinite(clip?.outPoint)).toBe(true);

  // Move clip with invalid newStart
  act(() => {
    result.current!.moveClip(clipId, -100);
  });

  clip = result.current!.clips.find(c => c.id === clipId);
  expect(clip?.start).toBeGreaterThanOrEqual(0);

  // Resize clip with invalid in/out
  act(() => {
    result.current!.resizeClip(clipId, -5, NaN);
  });

  clip = result.current!.clips.find(c => c.id === clipId);
  expect(Number.isFinite(clip?.inPoint)).toBe(true);
  expect(clip?.inPoint).toBeGreaterThanOrEqual(0);
  expect(Number.isFinite(clip?.outPoint)).toBe(true);
  expect(clip?.duration).toBeGreaterThan(0);

  // Split clip with invalid splitTime
  act(() => {
    result.current!.splitClip(clipId, NaN);
  });
});
