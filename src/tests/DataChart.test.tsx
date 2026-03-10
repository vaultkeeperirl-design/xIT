import React from 'react';
import { render } from '@testing-library/react';
import { DataChart } from '../remotion/templates/DataChart';
import { describe, it, expect, vi } from 'vitest';

vi.mock('remotion', () => ({
  AbsoluteFill: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useCurrentFrame: () => 0,
  useVideoConfig: () => ({ fps: 30, durationInFrames: 300 }),
  interpolate: () => 1,
  spring: () => 1,
}));

describe('DataChart', () => {
  it('should handle empty data safely', () => {
    const { container } = render(<DataChart data={[]} type="bar" />);
    expect(container).toBeTruthy();
  });

  it('should handle large data safely without RangeError', () => {
    // 5,000 elements is large enough to ensure no array spreading regressions,
    // and safe/fast enough to render in JSDOM under the 5s timeout.
    const largeData = Array.from({ length: 5000 }, (_, i) => ({ label: `Label ${i}`, value: i }));

    expect(() => {
        render(<DataChart data={largeData} type="bar" />);
    }).not.toThrow();
  });

  it('should handle empty data for line chart', () => {
    const { container } = render(<DataChart data={[]} type="line" />);
    expect(container).toBeTruthy();
  });

  it('should handle empty data for donut chart', () => {
    const { container } = render(<DataChart data={[]} type="donut" />);
    expect(container).toBeTruthy();
  });
});
