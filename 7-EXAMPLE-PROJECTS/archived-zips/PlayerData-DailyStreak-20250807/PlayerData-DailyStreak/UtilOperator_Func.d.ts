export declare const operatorUtils: {
    getDaySinceEpoch: typeof getDaySinceEpoch;
    toLocaleString: typeof toLocaleString;
    getRandomNumberFromRange: typeof getRandomNumberFromRange;
};
declare function getDaySinceEpoch(): number;
declare function toLocaleString(separator: string, num: number): string;
/**
 * @param isInteger when true, returns a whole value, not inclusive of the end number
 */
declare function getRandomNumberFromRange(start: number, end: number, isInteger: boolean): number;
export {};
