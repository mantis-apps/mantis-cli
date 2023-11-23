import figlet from 'figlet';
import chalk from 'chalk';
/**
 * Prints a welcome message using figlet and chalk/chalk-animation.
 */
export const welcome = async () => {
  const text = figlet.textSync('MANTIS-CLI', { horizontalLayout: 'full' });

  return console.log(chalk.green(text));
};

