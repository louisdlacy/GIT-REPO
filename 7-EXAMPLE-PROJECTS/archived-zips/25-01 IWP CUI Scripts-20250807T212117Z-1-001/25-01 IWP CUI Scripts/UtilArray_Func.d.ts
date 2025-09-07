export declare const arrayUtils: {
    removeItemFromArray: typeof removeItemFromArray;
    removeItemAtIndexFromArray: typeof removeItemAtIndexFromArray;
    getRandomItemFromArray: typeof getRandomItemFromArray;
    removeItemsFromArray: typeof removeItemsFromArray;
    shuffleArray: typeof shuffleArray;
    shuffleArrayInPlace: typeof shuffleArrayInPlace;
};
declare function removeItemFromArray<t>(array: t[], item: t): void;
declare function removeItemAtIndexFromArray<t>(array: t[], index: number): void;
declare function getRandomItemFromArray<t>(array: readonly t[]): t | undefined;
declare function removeItemsFromArray<t>(arrayToRemoveFrom: t[], arrayOfItemsToRemove: t[]): void;
/**
 * Randomly shuffle items from a given array, returned in a new array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns a new shuffled array
 */
declare function shuffleArray<T>(array: T[]): T[];
/**
 * Randomly shuffle items inside a given array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns the original array
 */
declare function shuffleArrayInPlace<T>(array: T[]): T[];
export {};
