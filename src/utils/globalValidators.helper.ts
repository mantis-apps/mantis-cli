import path from 'path';
import fs from 'fs';
import { OrbitLogger } from './orbitLogger.helper';

/**
 * Validates if a given string adheres to common variable naming conventions.
 * A valid variable name starts with a letter or underscore, followed by letters, digits, or underscores.
 *
 * @param {string} variableName - The string to validate as a variable name.
 * @returns {boolean} `true` if the string is a valid variable name, `false` otherwise.
 */
export function isValidVariableName(variableName: string): boolean {
  const variableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return variableNameRegex.test(variableName);
}

/**
 * Checks if a given string is a valid path.
 *
 * @param {string} potentialPath - The string to be checked.
 * @returns {boolean} `true` if the string is a valid path, `false` otherwise.
 */
export function isValidPath(potentialPath: string): boolean {
  try {
    const resolvedPath = path.resolve(potentialPath);
    return potentialPath !== '' && fs.existsSync(resolvedPath);
  } catch (error) {
    new OrbitLogger('[UTILS]').error(`> Incorrect Path: (${potentialPath})`);
    return false;
  }
}
