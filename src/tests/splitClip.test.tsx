import { renderHook, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('splitClip correctly copies caption data to the new clip if it is a caption clip', () => {
  const { result } = renderHook(() => useProject());

  let clipId: string = '';

  act(() => {
    // Add a caption clip
    const clip = result.current!.addCaptionClip([{text: "test", start: 0, end: 5}], 0, 5);
    clipId = clip.id;
  });

  expect(clipId).toBeTruthy();
  expect(result.current.captionData[clipId]).toBeDefined();

  let secondClipId: string | null = null;
  act(() => {
    // Attempt to split clip in half
    secondClipId = result.current!.splitClip(clipId, 2.5);
  });

  expect(secondClipId).toBeTruthy();

  const secondClip = result.current!.clips.find(c => c.id === secondClipId);
  expect(secondClip).toBeDefined();

  // The split clip should ALSO have caption data!
  expect(result.current.captionData[secondClipId!]).toBeDefined();
});
