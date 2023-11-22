import Logger, { LoggerOptions } from '@ptkdev/logger';

// Define a general type for logger methods.
type LoggerMethod = (...args: any[]) => void;

// Logger interface with dynamic key access to methods.
interface LoggerWithTags {
  [key: string]: LoggerMethod;
}

// Mapping of method names to their 'tag' parameter positions.
interface TagPositionMap {
  [methodName: string]: number;
}

export class OrbitLogger {
  private logger: LoggerWithTags;
  private context: string;

  // Map specifying the position of the 'tag' parameter in logger methods.
  private tagPositionMap: TagPositionMap = {
    info: 1,
    error: 1,
    warning: 1,
    sponsor: 1,
    stackoverflow: 1,
    docs: 2 // 'tag' is the third parameter for the docs method
  };

  constructor(context: string, options?: LoggerOptions) {
    this.context = context;

    // Creating a Proxy around the Logger instance.
    this.logger = new Proxy(new Logger(options) as unknown as LoggerWithTags, {
      get: (target, prop: string) => {
        // Get the original function from the logger.
        const originalFunction: LoggerMethod | undefined = target[prop];

        // Check if the property accessed is a function.
        if (typeof originalFunction === 'function') {
          // Return a new function that modifies the 'tag' parameter.
          return (...args: any[]) => {
            const tagPosition = this.tagPositionMap[prop];
            // If the 'tag' position is defined, insert or modify the 'tag' parameter.
            if (typeof tagPosition === 'number') {
              args[tagPosition] = args[tagPosition] ? `${this.context}, ${args[tagPosition]}` : this.context;
            }
            // Call the original function with modified arguments.
            return originalFunction(...args);
          };
        }

        // If not a function, return the property as is.
        return originalFunction;
      }
    });
  }
}
