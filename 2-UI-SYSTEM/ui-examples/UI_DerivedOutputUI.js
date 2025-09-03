"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class DerivedOutputUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.textBinding = new ui_1.Binding("World");
    }
    preStart() {
    }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: this.textBinding.derive((text) => `Hello ${text}!`),
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(DerivedOutputUI);
