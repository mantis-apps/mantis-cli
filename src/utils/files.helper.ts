import path from "path";

/**
 * Get the appropriate file extension for script files based on the current environment.
 * @returns {string} '.ts' in development and '.js' in other environments.
 */
export const getScriptFileExtension = (): string => {
  // Use '.ts' extension for development environment and '.js' for others
  return process.env.NODE_ENV === 'development' ? '.ts' : '.js';
};


/**
 * Extracts the command name from a file name.
 * This function is used to derive command names from their corresponding file names.
 * It assumes that the file name format follows the `<command>.command.<extension>` pattern.
 * 
 * @param {string} filename - The full file name from which to extract the command name.
 * @returns {string} The extracted command name.
 */
export function getCommandName(filename: string): string {
  // Extract the first part of the file name (assumed to be the command name)
  // before the first dot, which typically represents the command.
  return path.basename(filename).split('.').at(0) as string;
}

