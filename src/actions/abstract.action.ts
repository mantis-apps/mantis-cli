import { OrbitLogger } from '../utils/orbitLogger.helper';

/**
 * Abstract class representing a generic action for the CLI.
 * All specific action classes should extend this class and implement the 'execute' method.
 */
export abstract class Action {
  protected logger: OrbitLogger;

  constructor(loggerContext: string) {
    this.logger = new OrbitLogger(loggerContext);
  }

  /**
   * Abstract method that must be implemented by subclasses.
   * This is where the action's main functionality will be defined.
   */
  abstract execute(...args: any[]): void;
}
