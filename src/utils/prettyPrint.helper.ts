import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

const mantisGradientColors = ['#d9ed92', '#52b69a', '#184e77'];
type chalkAnimationTypes =
  | 'rainbow'
  | 'pulse'
  | 'glitch'
  | 'radar'
  | 'neon'
  | 'karaoke';

export function printWithMantisGradient(text: string) {
  let mantisGradient = gradient(mantisGradientColors);

  return console.log(mantisGradient(text));
}

export function printAnimatedText(
  text: string,
  animation: chalkAnimationTypes = 'neon',
) {
  return chalkAnimation[animation](text);
}

interface CLIPrefixOptions {
  text: string;
  color?: string;
  badgeName?: string;
}

/**
 * Prints text with a colored badge prefix.
 * This function generates a string that includes a badge (like a CLI tool name or identifier)
 * and a message, both prefixed with a color of choice. If the specified color is not a
 * built-in chalk color, it falls back to using `chalk.keyword`.
 *
 * @param {CLIPrefixOptions} options - The options for printing with a badge.
 * @param {string} [options.color='cyan'] - (Optional) The color to be used for the badge and prefix. Defaults to 'cyan'.
 * @param {string} options.text - The main text to be displayed.
 * @param {string} [options.badgeName='MANTIS'] - (Optional) The name of the badge. Defaults to 'MANTIS'.
 * @returns {string} The formatted string with the badge and text.
 */
export function printWithBadge(options: CLIPrefixOptions): string {
  const { color = 'cyan', text, badgeName = 'MANTIS' } = options;
  let cliPrefix = '';

  if ((chalk as any)[color]) {
    cliPrefix = `${(chalk as any)[color]('>')} ${(
      chalk as any
    ).reset.inverse.bold[color](` ${badgeName} `)}`;
  } else {
    cliPrefix = `${chalk.keyword(color)('>')}${chalk.reset.inverse.bold.keyword(
      color,
    )(` ${badgeName} `)}`;
  }

  return `${cliPrefix}  ${text}`;
}

// const spinners = new Spinnies();
// spinners.add('spin-1',{ text: 'NX WORKSPACE CREATION' });
// printAnimatedText('NX WORKSPACE CREATION');
// spinners.succeed('spin-1', { text: 'Got It !' });
