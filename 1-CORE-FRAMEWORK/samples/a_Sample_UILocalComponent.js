"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class UILocalComponent extends ui_1.UIComponent {
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        if (this.owner === this.serverPlayer) {
            return;
        }
    }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(UILocalComponent);
