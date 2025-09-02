import { CodeBlockEvents, PropTypes } from "horizon/core";
import { UIComponent, UINode, View } from "horizon/ui";
import { levelBarView } from "UILevelView";
import { PlayerHUDUtils } from "PlayerHUDUtils";

// ============================================================================
// MAIN PLAYERHUD COMPONENT
// ============================================================================
class PlayerHUD extends UIComponent<typeof PlayerHUD> {
    // Component configuration
    static propsDefinition = {
        testXp: { type: PropTypes.Number },         // Test XP value for initialization
        testMaxXp: { type: PropTypes.Number },      // Test max XP value for initialization
    };

    // UI dimensions
    panelHeight = 800;
    panelWidth = 600;

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
    
    private setupBuiltInEvents(): void {
        // When a player enters the world, show their XP if test values are set
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            console.log("PlayerHUD: Player entered world", player);
            if (this.props.testXp > 0) {
                PlayerHUDUtils.setXPProgress(
                    this.props.testXp,
                    this.props.testMaxXp,
                    player,
                    true // Animate the initial XP bar fill
                );
            }
        });

        // When a player leaves the world, reset their HUD
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => {
            console.log("PlayerHUD: Player exited world", player);
            if (this.props.testXp > 0) {
                PlayerHUDUtils.resetPlayerHUD({
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
    initializeUI(): UINode {
        return View({
            children: [
                View({
                    children: [
                        levelBarView(),  // The actual XP bar and level display
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
UIComponent.register(PlayerHUD);