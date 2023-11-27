import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';

const mantisGradientColors = ['#d9ed92', '#52b69a', '#184e77'];


export function printWithMantisGradient(text: string) {
    let mantisGradient = gradient(mantisGradientColors);

    return console.log(mantisGradient(text));
}

export function printAnimatedText(text: string) {
    return chalkAnimation.neon(text)
}

// const spinners = new Spinnies();
// spinners.add('spin-1',{ text: 'NX WORKSPACE CREATION' });
// printAnimatedText('NX WORKSPACE CREATION');
// spinners.succeed('spin-1', { text: 'Got It !' });
