export type WindowMock = {
  setInterval: (callback: () => any, ms: number) => number;

  clearInterval: (intervalId: number) => void;

  setTimeout: () => void;
};
