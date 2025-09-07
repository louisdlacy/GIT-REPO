//--- SCRIPT: Emoji_PlayerController.ts ---//
// Functionality: This is a lightweight local script that acts as an input handler.
// Type: Local Script
// Placement: Contained within the dynamically spawned PlayerController asset, which is attached to each player.
// Responsibilities: 
// - It listens for a configuration event from the server to know which input action(e.g., a controller button) to use for toggling the UI.
// - When the player presses the configured button, it fires a local event to its child UI_EmojiSelector script, telling it to open or close.

// See: (FORUM LINK)

import * as hz from 'horizon/core';
import { ToggleSelectorEvent, InitializeClientConfigEvent } from 'Emoji_Globals';

export class Emoji_PlayerController extends hz.Component<typeof Emoji_PlayerController> {
    // --- NO PUBLIC PROPERTIES --- //
    // This component is now entirely configured by events from the server.
    static propsDefinition = {};

    // --- PRIVATE STATE --- //
    private isInputInitialized: boolean = false;

    start() {
        const owner = this.entity.owner.get();
        // This is a local script, so it shouldn't run on the server.
        if (owner === this.world.getServerPlayer()) return;

        console.log(`Emoji_PlayerController: Initializing for ${owner.name.get()}. Waiting for config...`);

        // Listen for the configuration event from the server.
        this.connectNetworkEvent(this.entity, InitializeClientConfigEvent, (config) => {
            if (this.isInputInitialized) return;

            console.log(`Emoji_PlayerController: Received input config from server.`);
            this.setupPlayerInput(config);
            this.isInputInitialized = true;
        });
    }

    /**
     * Sets up the player's local input based on the configuration received from the server.
     */
    private setupPlayerInput(config: {
        inputAction: hz.PlayerInputAction,
        buttonIcon: hz.ButtonIcon,
        buttonPlacement: hz.ButtonPlacement
    }) {
        const emojiToggle = hz.PlayerControls.connectLocalInput(
            config.inputAction,
            config.buttonIcon,
            this,
            { preferredButtonPlacement: config.buttonPlacement }
        );

        emojiToggle.registerCallback((action, pressed) => {
            if (pressed) {
                console.log(`Emoji_PlayerController: Emoji toggle pressed.`);
                // Send a local event to all child scripts on this asset.
                this.sendLocalEvent(this.entity, ToggleSelectorEvent, {});
            };
        });

        console.log(`Emoji_PlayerController: Player input initialized successfully.`);
    }
};

hz.Component.register(Emoji_PlayerController);
