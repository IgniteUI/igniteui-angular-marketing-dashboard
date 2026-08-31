/**
 * jsdom ships no canvas implementation, and the Ignite UI chart/map components
 * ask for a 2D context as soon as they render. Stub it so component tests that
 * merely instantiate a dashboard view do not drown in "Not implemented" noise.
 */
const noop = () => undefined;

const context2d = new Proxy(
  {
    canvas: null,
    measureText: () => ({ width: 0 }),
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    createLinearGradient: () => ({ addColorStop: noop }),
    createPattern: () => null
  },
  {
    // Every other 2D-context method is a no-op for our purposes.
    get: (target: Record<string, unknown>, prop: string) =>
      prop in target ? target[prop] : noop
  }
);

HTMLCanvasElement.prototype.getContext = (() =>
  context2d) as unknown as HTMLCanvasElement['getContext'];
