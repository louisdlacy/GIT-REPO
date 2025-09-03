"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
var SCREENS;
(function (SCREENS) {
    SCREENS["MENU"] = "menu";
    SCREENS["GAME"] = "game";
    // Add new screen constants here:
    // SETTINGS= 'settings'
})(SCREENS || (SCREENS = {}));
;
class GameMenuUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 800;
        this.panelWidth = 600;
        this.screenList = Object.values(SCREENS);
        this.currentScreen = new ui_1.Binding(SCREENS.MENU);
    }
    navigateToScreen(screenName) {
        this.currentScreen.set(screenName);
    }
    createScreenNode(screenConstant, node) {
        return ui_1.UINode.if(this.currentScreen.derive(screen => screen === screenConstant), node);
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                this.createScreenNode(SCREENS.MENU, this.startMenuView()),
                this.createScreenNode(SCREENS.GAME, this.gameScreenView()),
                // Add future screens here using the same pattern:
                // this.createScreenNode(SCREENS.SETTINGS, this.settingsScreenView()),
                // Fallback for any unregistered screens
                ui_1.UINode.if(this.currentScreen.derive(screen => !this.screenList.includes(screen)), this.screenNotFoundView())
            ],
            style: {
                backgroundColor: 'black',
                flex: 1
            }
        });
    }
    startMenuView() {
        return (0, ui_1.View)({
            children: [
                // Game Logo Space
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: "YOUR GAME LOGO HERE",
                            style: {
                                fontSize: 48,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'white',
                                fontFamily: 'Anton'
                            }
                        })
                    ],
                    style: {
                        flex: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 40
                    }
                }),
                // Start Button
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Pressable)({
                            children: [
                                (0, ui_1.Text)({
                                    text: "START GAME",
                                    style: {
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: 'black'
                                    }
                                })
                            ],
                            onClick: () => {
                                this.navigateToScreen(SCREENS.GAME);
                            },
                            style: {
                                backgroundColor: core_1.Color.green,
                                borderRadius: 10,
                                padding: 20,
                                width: 200,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        })
                    ],
                    style: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                })
            ],
            style: {
                flex: 1,
                padding: 40,
                justifyContent: 'center'
            }
        });
    }
    gameScreenView() {
        return (0, ui_1.View)({
            children: [
                // Back to Menu Button - Top Right Corner
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Pressable)({
                            children: [
                                (0, ui_1.Text)({
                                    text: "BACK TO MENU",
                                    style: {
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: 'black'
                                    }
                                })
                            ],
                            onClick: () => {
                                this.navigateToScreen(SCREENS.MENU);
                            },
                            style: {
                                backgroundColor: core_1.Color.red,
                                borderRadius: 8,
                                padding: 12,
                                width: 150,
                                height: 45,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        })
                    ],
                    style: {
                        position: 'absolute',
                        bottom: 20,
                        right: 20
                    }
                }),
                // Placeholder game content
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: "YOUR GAME HERE",
                            style: {
                                fontSize: 36,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'white'
                            }
                        })
                    ],
                    style: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
    // Optional: fallback for unknown screens
    screenNotFoundView() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: `Screen not found`,
                    style: {
                        fontSize: 24,
                        color: 'red',
                        textAlign: 'center'
                    }
                })
            ],
            style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        });
    }
}
GameMenuUI.propsDefinition = {};
ui_1.UIComponent.register(GameMenuUI);
