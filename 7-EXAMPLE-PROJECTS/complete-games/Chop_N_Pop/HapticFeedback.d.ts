import { Component, HapticSharpness, HapticStrength, Player } from "horizon/core";
export declare enum HapticHand {
    Left = -1,
    Both = 0,
    Right = 1
}
export declare enum HapticType {
    reload = "reload",
    pickup = "pickup",
    empty = "empty",
    damage = "damage",
    death = "death",
    healthAdded = "healthAdded",
    playerHit = "playerHit",
    hitObject = "hitObject",
    hitPlayerBody = "hitPlayerBody",
    hitPlayerHead = "hitPlayerHead",
    gunShot = "gunShot"
}
type HapticStage = {
    duration: number;
    strength: HapticStrength;
    sharpness: HapticSharpness;
    delayToNext: number;
};
export declare const hapticConfig: Map<string, HapticStage[]>;
export declare class HapticFeedback {
    static playPattern(player: Player, pattern: HapticType, hand: HapticHand, component: Component): void;
    private static playPatternStage;
}
export {};
