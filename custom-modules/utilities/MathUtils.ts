// INTERPOLATION

export function Lerp(a: number, b: number, alpha: number) {
    return a + ((b - a) * alpha);
}

// RANDOM

export function RandomInt(min: number, max: number) {
    return Math.floor(Math.random() * ((max - min) + 1) + min);
}
