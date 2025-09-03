"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class ListViewUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.items = new ui_1.Binding([
            { name: "Item 1" },
            { name: "Item 2" },
            { name: "Item 3" },
            { name: "Item 4" },
            { name: "Item 5" }
        ]);
    }
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.DynamicList)({
                    data: this.items,
                    renderItem: (item) => (0, ui_1.View)({
                        style: {
                            backgroundColor: core_1.Color.red,
                            margin: 5,
                        },
                        children: (0, ui_1.Text)({
                            text: item.name
                        })
                    }),
                    style: {
                        flex: 1
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(ListViewUI);
