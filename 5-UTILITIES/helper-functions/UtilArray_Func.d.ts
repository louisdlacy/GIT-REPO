export declare const arrayUtils: {
    removeItemFromArray: typeof removeItemFromArray;
    removeItemAtIndexFromArray: typeof removeItemAtIndexFromArray;
    getRandomItemFromArray: typeof getRandomItemFromArray;
    removeItemsFromArray: typeof removeItemsFromArray;
};
declare function removeItemFromArray<t>(array: t[], item: t): void;
declare function removeItemAtIndexFromArray<t>(array: t[], index: number): void;
declare function getRandomItemFromArray<t>(array: t[]): t | undefined;
declare function removeItemsFromArray<t>(arrayToRemoveFrom: t[], arrayOfItemsToRemove: t[]): void;
export {};
