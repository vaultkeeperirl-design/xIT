import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('resizeClip should prevent duration from being <= 0', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    // Add a dummy clip (assets are not populated here so it uses default duration 5)
    const clip = result.current!.addClip('test-asset', 'V1', 0);
    clipId = clip.id;
  });

  expect(clipId).toBeTruthy();

  act(() => {
    // Attempt to resize to negative duration (newOutPoint < newInPoint)
    result.current!.resizeClip(clipId, 2, 1);
  });

  const updatedClip = result.current!.clips.find(c => c.id === clipId);

  // A valid clip shouldn't have duration <= 0.
  // Assuming a minimum duration of 0.1 (or similar) is enforced.
  expect(updatedClip).toBeDefined();
  expect(updatedClip?.duration).toBeGreaterThan(0);
});
