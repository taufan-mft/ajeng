declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        openTasya(arg: Record<string, unknown>): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
