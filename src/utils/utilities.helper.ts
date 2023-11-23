import os from 'node:os';
import shell from 'shelljs';
/**
 * Clears the console screen.
 */
export const clearConsole = () => {
    // const clearCommand = os.platform() === 'win32' ? 'cls' : 'clear';
    // shell.exec(clearCommand);
    // The 'process' of Node.js allows access to the terminal.
    process.stdout.write('\x1Bc'); // '\x1Bc' is an escape sequence to clear the screen.
    console.log('');
};