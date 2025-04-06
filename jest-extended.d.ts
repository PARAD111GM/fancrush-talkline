import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

// Extend expect matchers
declare global {
  namespace jest {
    interface Expect {
      any(constructor: any): any;
      objectContaining(obj: object): any;
      arrayContaining(arr: any[]): any;
      stringContaining(str: string): any;
    }
  }
}

// Extend Jest mock types
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      mock: {
        calls: Y[][];
        instances: T[];
        invocationCallOrder: number[];
        results: Array<{type: string; value: any}>;
      };
    }
  }
}

export {}; 