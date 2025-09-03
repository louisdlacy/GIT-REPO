"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class DisableUI extends ui_1.UIComponent {
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Hello World!",
                })
            ],
            style: {
                flex: 1
            }
        });
    }
    preStart() {
        // Set a timeout to disable the UI after 2 seconds
        this.async.setTimeout(() => {
            this.entity.visible.set(false);
        }, 2000);
    }
    start() { }
}
ui_1.UIComponent.register(DisableUI);
