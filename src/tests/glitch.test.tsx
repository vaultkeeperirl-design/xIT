import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('moveClip should prevent start time from becoming NaN or Infinity', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    const clip = result.current!.addClip('test-asset', 'V1', 0);
    clipId = clip.id;
  });

  act(() => {
    result.current!.moveClip(clipId, NaN);
  });

  const updatedClip1 = result.current!.clips.find(c => c.id === clipId);
  expect(Number.isFinite(updatedClip1?.start)).toBe(true);

  act(() => {
    result.current!.moveClip(clipId, Infinity);
  });

  const updatedClip2 = result.current!.clips.find(c => c.id === clipId);
  expect(Number.isFinite(updatedClip2?.start)).toBe(true);
});

test('resizeClip should prevent time properties from becoming NaN or Infinity', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    const clip = result.current!.addClip('test-asset', 'V1', 0);
    clipId = clip.id;
  });

  act(() => {
    result.current!.resizeClip(clipId, NaN, NaN);
  });

  const updatedClip1 = result.current!.clips.find(c => c.id === clipId);
  expect(Number.isFinite(updatedClip1?.inPoint)).toBe(true);
  expect(Number.isFinite(updatedClip1?.outPoint)).toBe(true);
  expect(Number.isFinite(updatedClip1?.duration)).toBe(true);

  act(() => {
    result.current!.resizeClip(clipId, -5, Infinity);
  });

  const updatedClip2 = result.current!.clips.find(c => c.id === clipId);
  expect(updatedClip2?.inPoint).toBeGreaterThanOrEqual(0);
  expect(Number.isFinite(updatedClip2?.outPoint)).toBe(true);
  expect(Number.isFinite(updatedClip2?.duration)).toBe(true);
});
