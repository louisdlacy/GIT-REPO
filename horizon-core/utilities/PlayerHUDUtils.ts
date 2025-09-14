import { CodeBlockEvents, PropTypes, Player, LocalEvent } from "horizon/core";
import { AnimatedBinding, Animation, Binding, UIComponent, UINode, View } from "horizon/ui";
import { levelBarView } from "UILevelView";

// ============================================================================
// UI BINDINGS (connects data to the visual elements)
// ============================================================================
export const PlayerHUDBindings = {
    levelValue: new Binding("1"),                    // Current player level
    isLevelingUp: new Binding(false),               // Shows golden effect when true
    xpPercentage: new AnimatedBinding(0),           // XP bar fill (0-1)
    xpValue: new Binding(0),                        // Current XP amount
    xpMaxValue: new Binding(100)                    // Maximum XP for current level
}

// ============================================================================
// UTILITY CLASS (handles the actual UI binding updates)
// ============================================================================
export class PlayerHUDUtils {
    
    // ========================================================================
    // CORE UPDATE METHODS (these actually change the UI bindings)
    // ========================================================================
    
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
    }): void {
        const percent = event.maxXP > 0 ? event.currentXP / event.maxXP : 0;
        const players = event.player ? [event.player] : undefined;
        
        // Update the XP bar fill
        if (event.animate) {
            const animationOptions = event.animationDuration 
                ? Animation.timing(percent, { duration: event.animationDuration })
                : Animation.timing(percent);
            PlayerHUDBindings.xpPercentage.set(animationOptions, undefined, players);
        } else {
            PlayerHUDBindings.xpPercentage.set(percent, undefined, players);
        }
        
        // Update the XP numbers
        PlayerHUDBindings.xpValue.set(event.currentXP, players);
        PlayerHUDBindings.xpMaxValue.set(event.maxXP, players);
    }

    /**
     * Updates the level bindings in the UI
     * @param event - Level update event data
     */
    static updateLevel(event: {
        level: number;
        isLevelingUp?: boolean;
        levelUpDuration?: number;
        player?: Player;
    }): void {
        const players = event.player ? [event.player] : undefined;
        
        // Update the level number
        PlayerHUDBindings.levelValue.set(event.level.toString(), players);
        
        // Update the leveling up effect (golden glow)
        if (event.isLevelingUp !== undefined) {
            PlayerHUDBindings.isLevelingUp.set(event.isLevelingUp, players);
        }
    }

    /**
     * Resets HUD bindings to default values
     * @param event - Reset event data
     */
    static resetPlayerHUD(event: { 
        resetXP?: boolean; 
        resetLevel?: boolean; 
        player?: Player 
    } = {}): void {
        const players = event.player ? [event.player] : undefined;
        
        // Reset XP if requested
        if (event.resetXP !== false) {
            PlayerHUDBindings.xpPercentage.set(0, undefined, players);
            PlayerHUDBindings.xpValue.set(0, players);
            PlayerHUDBindings.xpMaxValue.set(100, players);
        }
        
        // Reset level if requested
        if (event.resetLevel !== false) {
            PlayerHUDBindings.levelValue.set("1", players);
            PlayerHUDBindings.isLevelingUp.set(false, players);
        }
    }

    // ========================================================================
    // STATIC CONVENIENCE METHODS (for use from other components)
    // ========================================================================
    
    /**
     * Set XP instantly without animation (static method)
     */
    static setXP(amount: number, maxXP: number, player?: Player): void {
        PlayerHUDUtils.updateXP({
            currentXP: amount,
            maxXP: maxXP,
            animate: false,
            player: player
        });
    }

    /**
     * Add XP with animation (static method)
     */
    static addXP(amount: number, maxXP: number, player?: Player): void {
        PlayerHUDUtils.updateXP({
            currentXP: amount,
            maxXP: maxXP,
            animate: true,
            animationDuration: 500,
            player: player
        });
    }

    /**
     * Set level without effects (static method)
     */
    static setLevel(newLevel: number, player?: Player): void {
        PlayerHUDUtils.updateLevel({
            level: newLevel,
            isLevelingUp: false,
            player: player
        });
    }

    /**
     * Level up with effects (static method)
     */
    static levelUp(newLevel: number, player?: Player): void {
        PlayerHUDUtils.updateLevel({
            level: newLevel,
            isLevelingUp: true,
            levelUpDuration: 2000,
            player: player
        });
    }

    /**
     * Reset everything (static method)
     */
    static resetHUD(player?: Player): void {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: true,
            resetLevel: true,
            player: player
        });
    }

    /**
     * Reset only XP (static method)
     */
    static resetXP(player?: Player): void {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: true,
            resetLevel: false,
            player: player
        });
    }

    /**
     * Reset only level (static method)
     */
    static resetLevel(player?: Player): void {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: false,
            resetLevel: true,
            player: player
        });
    }

    /**
     * Advanced XP update with full control (static method)
     */
    static setXPProgress(currentXP: number, maxXP: number, player?: Player, animate: boolean = false): void {
        PlayerHUDUtils.updateXP({
            currentXP: currentXP,
            maxXP: maxXP,
            animate: animate,
            player: player
        });
    }
}