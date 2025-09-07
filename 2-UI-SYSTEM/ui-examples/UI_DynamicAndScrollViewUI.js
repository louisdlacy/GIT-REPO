"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class DynamicAndScrollViewUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.itemListBinding = new ui_1.Binding([
            'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
            'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10',
            'Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15',
            'Item 16', 'Item 17', 'Item 18', 'Item 19', 'Item 20'
        ]);
        this.renderListItem = (item, index) => {
            return (0, ui_1.View)({
                style: {
                    width: 50,
                    height: 50,
                    backgroundColor: (index ?? 0) % 2 === 0 ? 'black' : 'gray',
                },
            });
        };
    }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.ScrollView)({
                    children: [
                        (0, ui_1.DynamicList)({
                            data: this.itemListBinding,
                            renderItem: this.renderListItem,
                            style: {
                                flex: 1
                            }
                        })
                    ],
                    contentContainerStyle: {
                        backgroundColor: 'lightgray',
                        height: 1200,
                        width: '100%'
                    },
                    style: {
                        backgroundColor: 'white',
                        flex: 1,
                        padding: 10
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
    // Method to add new items dynamically
    addItem(newItem) {
        this.itemListBinding.set(currentItems => [...currentItems, newItem]);
    }
    // Method to remove items dynamically
    removeItem(index) {
        this.itemListBinding.set(currentItems => {
            if (index >= 0 && index < currentItems.length) {
                return currentItems.filter((_, i) => i !== index);
            }
            return currentItems;
        });
    }
}
ui_1.UIComponent.register(DynamicAndScrollViewUI);
