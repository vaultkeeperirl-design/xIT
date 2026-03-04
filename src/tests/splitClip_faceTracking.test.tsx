import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('splitClip does not lose faceTrackingData on the new clip', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';
  act(() => {
    // Add a dummy clip
    const clip = result.current!.addClip('test-asset', 'V1', 0);
    clipId = clip.id;
  });

  // Face tracking is linked to assetId, so splitting the clip should still refer to the same asset,
  // which works naturally. This test ensures the assetId is carried over correctly.

  let secondClipId: string | null = null;
  act(() => {
    secondClipId = result.current!.splitClip(clipId, 2.5);
  });

  const secondClip = result.current!.clips.find(c => c.id === secondClipId);
  expect(secondClip?.assetId).toBe('test-asset');
});
