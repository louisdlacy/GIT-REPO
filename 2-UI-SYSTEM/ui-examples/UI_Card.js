"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class CardUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        //Title
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Text)({
                                    text: "Card Title",
                                    style: {
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginBottom: 10,
                                        color: "black",
                                        textAlign: "center",
                                    }
                                }),
                            ]
                        }),
                        //Image
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Text)({
                                    text: "Image Placeholder",
                                    style: {
                                        fontSize: 16,
                                        color: "gray",
                                        textAlign: "center",
                                        backgroundColor: "lightgray",
                                        height: 100,
                                        width: 100,
                                    }
                                }),
                            ],
                            style: {
                                marginBottom: 10,
                                alignItems: "center",
                            }
                        }),
                        //Body
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Text)({
                                    text: "This is a card component.\nIt can contain text, images, and other UI elements.",
                                    style: {
                                        fontSize: 16,
                                        color: "gray",
                                        textAlign: "center",
                                    }
                                })
                            ]
                        })
                    ],
                    style: {
                        backgroundColor: "white",
                        borderRadius: 10,
                        height: 300,
                        width: 200,
                        padding: 10,
                    }
                }),
            ],
            style: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }
        });
    }
}
ui_1.UIComponent.register(CardUI);
