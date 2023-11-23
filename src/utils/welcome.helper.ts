import figlet from 'figlet';
import chalk from 'chalk';
import { clearConsole } from './utilities.helper';
import { printWithMantisGradient } from './prettyPrint.helper';

/**
 * Prints a welcome message using figlet and chalk/chalk-animation.
 */
export const welcome = async () => {
  clearConsole();

  const text = figlet.textSync('MANTIS-CLI', {
    horizontalLayout: 'full',
    font: 'ANSI Shadow'

  });

  // return printWithMantisGradient(text);
  return console.log(chalk.green(text));
};

