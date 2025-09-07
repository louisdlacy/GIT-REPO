export declare class Pool<T> {
    all: T[];
    available: T[];
    active: T[];
    hasAvailable(): boolean;
    hasActive(): boolean;
    isAvailable(t: T): boolean;
    getNextAvailable(): T | null;
    getRandomAvailable(): T | null;
    getRandomActive(): T | null;
    addToPool(t: T): void;
    removeFromPool(t: T): void;
    resetAvailability(): void;
}
