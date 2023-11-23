/**
 * Get the appropriate file extension for script files based on the current environment.
 * @returns {string} '.ts' in development and '.js' in other environments.
 */
export const getScriptFileExtension = (): string => {
    // Use '.ts' extension for development environment and '.js' for others
    return process.env.NODE_ENV === 'development' ? '.ts' : '.js';
  };
  