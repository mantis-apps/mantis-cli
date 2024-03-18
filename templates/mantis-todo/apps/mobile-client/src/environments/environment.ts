import { Environment } from './environment.types';

export const environment: Environment = {
  get backendBaseUrl(): string {
    throw new Error(
      'environment.ts should be substituted with the environment.<target>.ts file during the build process. Ensure the right target is set.',
    );
  },
};
