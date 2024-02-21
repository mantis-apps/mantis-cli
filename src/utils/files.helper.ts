import path from 'path';
import { OrbitLogger } from './orbitLogger.helper';
import shell from 'shelljs';
import fs from 'fs';

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

/**
 * Changes the current working directory.
 *
 * @param {string} targetDir - The target directory to change to.
 * @returns {void}
 */
export function changeDirectory(targetDir: string): void {
  try {
    process.chdir(targetDir);
    new OrbitLogger('DIRECTORY-CHANGER').info(
      `Changed directory to: ${targetDir}`,
    );
  } catch (error) {
    new OrbitLogger('DIRECTORY-CHANGER').error(
      `Error changing directory: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Creates one or more directories using shelljs.
 *
 * @param {string} options - Options for the mkdir command.
 * @param {string | string[]} paths - A single directory path or an array of directory paths to create.
 * @returns {void}
 */
export function createDirectory(
  options: string,
  paths: string | string[],
): void {
  paths = typeof paths === 'string' ? [paths] : paths;
  const dirTypo = typeof paths === 'string' ? 'Directory' : 'Directories';

  try {
    shell.mkdir(options, paths);
    new OrbitLogger('DIRECTORY-CREATOR').info(
      `${dirTypo} created: ${paths.join(', ')}`,
    );
  } catch (error) {
    new OrbitLogger('DIRECTORY-CREATOR').error(
      `Error creating ${dirTypo}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Moves one or more files/directories to a specified destination.
 *
 * @param {string | string[]} sources - A single source or an array of sources to move.
 * @param {string} dest - The destination path.
 * @returns {void}
 */
export function moveFile(sources: string | string[], dest: string): void {
  try {
    shell.mv(sources, dest);
    new OrbitLogger('FILE-MOVER').info(
      `Moved ${
        Array.isArray(sources) ? sources.join(', ') : sources
      } to ${dest}`,
    );
  } catch (error) {
    new OrbitLogger('FILE-MOVER').error(
      `Error moving file(s): ${error.message}`,
    );
    throw error;
  }
}

/**
 * Removes one or more files/directories.
 *
 * @param {string} options - Options for the rm command.
 * @param {string[]} files - An array of files to remove.
 * @returns {void}
 */
export function removeFile(options: string, files: string[]): void {
  try {
    shell.rm(options, files);
    new OrbitLogger('FILE-REMOVER').info(
      `Removed ${Array.isArray(files) ? files.join(', ') : files}`,
    );
  } catch (error) {
    new OrbitLogger('FILE-REMOVER').error(
      `Error removing file(s): ${error.message}`,
    );
    throw error;
  }
}

/**
 * Recursively replaces a specified string with another in all files within a directory.
 *
 * @param {string} dir - Directory to search for files.
 * @param {string} searchStr - The string to search for in the files.
 * @param {string} replaceStr - The string to replace the searchStr with.
 */
export function replaceInFiles(
  dir: string,
  searchStr: string,
  replaceStr: string,
) {
  const logger = new OrbitLogger('FILE-REPLACER');

  try {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp(searchStr, 'g'), replaceStr);
        fs.writeFileSync(filePath, content, 'utf8');
        logger.info(`Replaced in file: ${filePath}`);
      } else if (stats.isDirectory()) {
        replaceInFiles(filePath, searchStr, replaceStr); // Recurse into subdirectory
      }
    });
    logger.info(`Completed replacements in directory: ${dir}`);
  } catch (error) {
    logger.error(`Error replacing in files: ${error.message}`);
    throw error;
  }
}

/**
 * Replaces a specified string with another in a given file.
 *
 * @param {string} filePath - Path to the file where replacements are to be made.
 * @param {string} searchStr - The string to search for in the file.
 * @param {string} replaceStr - The string to replace the searchStr with.
 */
export function replaceInFile(
  filePath: string,
  searchStr: string,
  replaceStr: string,
) {
  const logger = new OrbitLogger('FILE-REPLACER');

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    content = content.replace(new RegExp(searchStr, 'g'), replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');

    logger.info(`Replaced occurrences in file: ${filePath}`);
    if (originalContent === content) {
      logger.info(`No replacements made in file: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Error replacing in file: ${filePath}, ${error.message}`);
    throw error; // Rethrow the error for further handling if necessary
  }
}
