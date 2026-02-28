import { describe, it, expect } from 'vitest';
import app from '../worker/index';

describe('Worker AI Edit Endpoints', () => {
  it('POST /api/ai-edit/start should return 400 if prompt is missing', async () => {
    const res = await app.request('/api/ai-edit/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ error: 'Prompt is required' });
  });

  it('POST /api/ai-edit should return 400 if prompt is missing', async () => {
    const res = await app.request('/api/ai-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ error: 'Prompt is required' });
  });
});
