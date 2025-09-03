"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
// Custom UI must be set to "Screen Overlay" and "Interactive, Non blocking" in the editor
class CustomUIButton extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.hoverColor = "white";
        this.pressedColor = "yellow";
        this.defaultColor = "gray";
        this.buttonColorBinding = new ui_1.Binding(this.defaultColor);
    }
    preStart() {
        // The player will own the entity when it is grabbed
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        // Check if the entity is owned by a player
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        // Removes some of the default buttons from the UI
        core_1.PlayerControls.disableSystemControls();
    }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Pressable)({
                    children: [
                        (0, ui_1.Text)({
                            text: "Press me",
                            style: {
                                fontSize: 12
                            }
                        }),
                    ],
                    onPress: () => { this.buttonColorBinding.set(this.pressedColor); },
                    onRelease: () => { this.buttonColorBinding.set(this.defaultColor); },
                    onEnter: () => { this.buttonColorBinding.set(this.hoverColor); },
                    onExit: () => { this.buttonColorBinding.set(this.defaultColor); },
                    onClick: () => {
                        console.log("Button clicked");
                    },
                    style: {
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: this.buttonColorBinding,
                        margin: 30,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                }),
            ],
            style: {
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end"
            },
        });
    }
}
ui_1.UIComponent.register(CustomUIButton);
