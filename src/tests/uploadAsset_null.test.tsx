import { renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useProject } from '../react-app/hooks/useProject';

test('uploadAsset should handle null/undefined file gracefully', async () => {
  const { result } = renderHook(() => useProject());

  await expect(result.current.uploadAsset(null as unknown as File)).rejects.toThrow('File must be provided');
  await expect(result.current.uploadAsset(undefined as unknown as File)).rejects.toThrow('File must be provided');
});
