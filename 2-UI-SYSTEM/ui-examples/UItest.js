"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class UItest extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 300;
        this.panelWidth = 500;
    }
    initializeUI() {
        // Return a UINode to specify the contents of your UI.
        // For more details and examples go to:
        // https://developers.meta.com/horizon-worlds/learn/documentation/typescript/api-references-and-examples/custom-ui
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "New UI Panel",
                    style: {
                        fontSize: 48,
                        textAlign: "center",
                        textAlignVertical: "center",
                        height: this.panelHeight,
                        width: this.panelWidth,
                    },
                }),
            ],
            style: {
                backgroundColor: "black",
                height: this.panelHeight,
                width: this.panelWidth,
            },
        });
    }
}
UItest.propsDefinition = {};
ui_1.UIComponent.register(UItest);
