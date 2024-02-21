import figlet from 'figlet';
import { clearConsole } from './utilities.helper';
import { printWithMantisGradient } from './prettyPrint.helper';

/**
 * Prints a welcome message using figlet and gradient.
 * @colorPalette https://coolors.co/palette/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
 */
export const welcome = async () => {
  clearConsole();

  const text = figlet.textSync('MANTIS-CLI', {
    horizontalLayout: 'full',
  });

  return printWithMantisGradient(text);
};
