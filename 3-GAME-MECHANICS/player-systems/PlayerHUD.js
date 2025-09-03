"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const UILevelView_1 = require("UILevelView");
const PlayerHUDUtils_1 = require("PlayerHUDUtils");
// ============================================================================
// MAIN PLAYERHUD COMPONENT
// ============================================================================
class PlayerHUD extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // UI dimensions
        this.panelHeight = 800;
        this.panelWidth = 600;
    }
    // ========================================================================
    // LIFECYCLE METHODS
    // ========================================================================
    /**
     * Called before the component starts - set up event listeners here
     */
    preStart() {
        this.setupBuiltInEvents();
    }
    /**
     * Called when the component starts - component is ready to use
     */
    start() {
        // Component initialization complete
    }
    // ========================================================================
    // EVENT SETUP (handles player join/leave and custom events)
    // ========================================================================
    setupBuiltInEvents() {
        // When a player enters the world, show their XP if test values are set
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            console.log("PlayerHUD: Player entered world", player);
            if (this.props.testXp > 0) {
                PlayerHUDUtils_1.PlayerHUDUtils.setXPProgress(this.props.testXp, this.props.testMaxXp, player, true // Animate the initial XP bar fill
                );
            }
        });
        // When a player leaves the world, reset their HUD
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            console.log("PlayerHUD: Player exited world", player);
            if (this.props.testXp > 0) {
                PlayerHUDUtils_1.PlayerHUDUtils.resetPlayerHUD({
                    resetXP: true,
                    resetLevel: true,
                    player: player
                });
            }
        });
    }
    // ========================================================================
    // UI CREATION
    // ========================================================================
    /**
     * Creates the visual elements of the HUD
     */
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, UILevelView_1.levelBarView)(), // The actual XP bar and level display
                    ],
                    style: {
                        flex: 1,
                        alignItems: 'center',
                    }
                })
            ],
            style: {
                position: 'absolute',
                width: '100%',
                // backgroundColor: '#000000', // Uncomment for dark background
            }
        });
    }
}
// Component configuration
PlayerHUD.propsDefinition = {
    testXp: { type: core_1.PropTypes.Number }, // Test XP value for initialization
    testMaxXp: { type: core_1.PropTypes.Number }, // Test max XP value for initialization
};
ui_1.UIComponent.register(PlayerHUD);
