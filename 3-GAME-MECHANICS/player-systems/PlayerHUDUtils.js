"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHUDUtils = exports.PlayerHUDBindings = void 0;
const ui_1 = require("horizon/ui");
// ============================================================================
// UI BINDINGS (connects data to the visual elements)
// ============================================================================
exports.PlayerHUDBindings = {
    levelValue: new ui_1.Binding("1"), // Current player level
    isLevelingUp: new ui_1.Binding(false), // Shows golden effect when true
    xpPercentage: new ui_1.AnimatedBinding(0), // XP bar fill (0-1)
    xpValue: new ui_1.Binding(0), // Current XP amount
    xpMaxValue: new ui_1.Binding(100) // Maximum XP for current level
};
// ============================================================================
// UTILITY CLASS (handles the actual UI binding updates)
// ============================================================================
class PlayerHUDUtils {
    // ========================================================================
    // CORE UPDATE METHODS (these actually change the UI bindings)
    // ========================================================================
    /**
     * Updates the XP bindings in the UI
     * @param event - XP update event data
     */
    static updateXP(event) {
        const percent = event.maxXP > 0 ? event.currentXP / event.maxXP : 0;
        const players = event.player ? [event.player] : undefined;
        // Update the XP bar fill
        if (event.animate) {
            const animationOptions = event.animationDuration
                ? ui_1.Animation.timing(percent, { duration: event.animationDuration })
                : ui_1.Animation.timing(percent);
            exports.PlayerHUDBindings.xpPercentage.set(animationOptions, undefined, players);
        }
        else {
            exports.PlayerHUDBindings.xpPercentage.set(percent, undefined, players);
        }
        // Update the XP numbers
        exports.PlayerHUDBindings.xpValue.set(event.currentXP, players);
        exports.PlayerHUDBindings.xpMaxValue.set(event.maxXP, players);
    }
    /**
     * Updates the level bindings in the UI
     * @param event - Level update event data
     */
    static updateLevel(event) {
        const players = event.player ? [event.player] : undefined;
        // Update the level number
        exports.PlayerHUDBindings.levelValue.set(event.level.toString(), players);
        // Update the leveling up effect (golden glow)
        if (event.isLevelingUp !== undefined) {
            exports.PlayerHUDBindings.isLevelingUp.set(event.isLevelingUp, players);
        }
    }
    /**
     * Resets HUD bindings to default values
     * @param event - Reset event data
     */
    static resetPlayerHUD(event = {}) {
        const players = event.player ? [event.player] : undefined;
        // Reset XP if requested
        if (event.resetXP !== false) {
            exports.PlayerHUDBindings.xpPercentage.set(0, undefined, players);
            exports.PlayerHUDBindings.xpValue.set(0, players);
            exports.PlayerHUDBindings.xpMaxValue.set(100, players);
        }
        // Reset level if requested
        if (event.resetLevel !== false) {
            exports.PlayerHUDBindings.levelValue.set("1", players);
            exports.PlayerHUDBindings.isLevelingUp.set(false, players);
        }
    }
    // ========================================================================
    // STATIC CONVENIENCE METHODS (for use from other components)
    // ========================================================================
    /**
     * Set XP instantly without animation (static method)
     */
    static setXP(amount, maxXP, player) {
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
    static addXP(amount, maxXP, player) {
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
    static setLevel(newLevel, player) {
        PlayerHUDUtils.updateLevel({
            level: newLevel,
            isLevelingUp: false,
            player: player
        });
    }
    /**
     * Level up with effects (static method)
     */
    static levelUp(newLevel, player) {
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
    static resetHUD(player) {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: true,
            resetLevel: true,
            player: player
        });
    }
    /**
     * Reset only XP (static method)
     */
    static resetXP(player) {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: true,
            resetLevel: false,
            player: player
        });
    }
    /**
     * Reset only level (static method)
     */
    static resetLevel(player) {
        PlayerHUDUtils.resetPlayerHUD({
            resetXP: false,
            resetLevel: true,
            player: player
        });
    }
    /**
     * Advanced XP update with full control (static method)
     */
    static setXPProgress(currentXP, maxXP, player, animate = false) {
        PlayerHUDUtils.updateXP({
            currentXP: currentXP,
            maxXP: maxXP,
            animate: animate,
            player: player
        });
    }
}
exports.PlayerHUDUtils = PlayerHUDUtils;
