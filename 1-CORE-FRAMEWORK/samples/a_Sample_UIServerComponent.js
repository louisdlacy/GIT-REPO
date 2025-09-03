"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class UIServerComponent extends ui_1.UIComponent {
    initializeUI() {
        return (0, ui_1.View)({
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(UIServerComponent);
