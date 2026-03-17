import { renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('uploadAsset should handle files with missing type gracefully', async () => {
  const { result } = renderHook(() => useProject());

  const malformedFile = {
    name: 'testfile', // no extension
    size: 1024,
    // NO type property!
  } as unknown as File;

  await expect(result.current.uploadAsset(malformedFile)).rejects.toThrow('Unsupported file type');
});
