import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('addCaptionClip should validate start and duration', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    const clip = result.current!.addCaptionClip([], -5, -10);
    clipId = clip.id;
  });

  const updatedClip = result.current!.clips.find(c => c.id === clipId);

  expect(updatedClip).toBeDefined();
  expect(updatedClip?.start).toBeGreaterThanOrEqual(0);
  expect(updatedClip?.duration).toBeGreaterThan(0);
  expect(updatedClip?.outPoint).toBeGreaterThan(0);
});

test('addCaptionClipsBatch should validate start and duration', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    const clips = result.current!.addCaptionClipsBatch([{ words: [], start: -5, duration: -10 }]);
    clipId = clips[0].id;
  });

  const updatedClip = result.current!.clips.find(c => c.id === clipId);

  expect(updatedClip).toBeDefined();
  expect(updatedClip?.start).toBeGreaterThanOrEqual(0);
  expect(updatedClip?.duration).toBeGreaterThan(0);
  expect(updatedClip?.outPoint).toBeGreaterThan(0);
});
