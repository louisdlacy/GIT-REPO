"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const textBinding = new ui_1.Binding('');
class PerPlayer extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: textBinding.derive((text) => {
                        return `Hello ${text}!`;
                    }),
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(PerPlayer);
// Place this component on a Trigger Gizmo
class PlayerTrigger extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            // Only update the text binding for the player that entered the trigger
            textBinding.set(player.name.get(), [player]);
        });
    }
    start() { }
}
core_1.Component.register(PlayerTrigger);
