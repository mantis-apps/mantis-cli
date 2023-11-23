import gradient from 'gradient-string';

export function printWithMantisGradient(text: string) {
    let mantisGradient = gradient(['#d9ed92', '#52b69a', '#184e77']);

    return console.log(mantisGradient(text));
}