import { Player } from "horizon/core";
import { AnimatedBinding, Binding } from "horizon/ui";
export declare const PlayerHUDBindings: {
    levelValue: Binding<string>;
    isLevelingUp: Binding<boolean>;
    xpPercentage: AnimatedBinding;
    xpValue: Binding<number>;
    xpMaxValue: Binding<number>;
};
export declare class PlayerHUDUtils {
    /**
     * Updates the XP bindings in the UI
     * @param event - XP update event data
     */
    static updateXP(event: {
        currentXP: number;
        maxXP: number;
        animate?: boolean;
        animationDuration?: number;
        player?: Player;
    }): void;
    /**
     * Updates the level bindings in the UI
     * @param event - Level update event data
     */
    static updateLevel(event: {
        level: number;
        isLevelingUp?: boolean;
        levelUpDuration?: number;
        player?: Player;
    }): void;
    /**
     * Resets HUD bindings to default values
     * @param event - Reset event data
     */
    static resetPlayerHUD(event?: {
        resetXP?: boolean;
        resetLevel?: boolean;
        player?: Player;
    }): void;
    /**
     * Set XP instantly without animation (static method)
     */
    static setXP(amount: number, maxXP: number, player?: Player): void;
    /**
     * Add XP with animation (static method)
     */
    static addXP(amount: number, maxXP: number, player?: Player): void;
    /**
     * Set level without effects (static method)
     */
    static setLevel(newLevel: number, player?: Player): void;
    /**
     * Level up with effects (static method)
     */
    static levelUp(newLevel: number, player?: Player): void;
    /**
     * Reset everything (static method)
     */
    static resetHUD(player?: Player): void;
    /**
     * Reset only XP (static method)
     */
    static resetXP(player?: Player): void;
    /**
     * Reset only level (static method)
     */
    static resetLevel(player?: Player): void;
    /**
     * Advanced XP update with full control (static method)
     */
    static setXPProgress(currentXP: number, maxXP: number, player?: Player, animate?: boolean): void;
}
