"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyUI = void 0;
/**
  This script defines the custom UI, which is the Trading Store in the world.

  This custom UI:
  - allows trading of green gems for gold coins
  - allows trading of gold coins for a red gem
  - maintains counts of the players green gems, coins, and red gems

  Custom UI also sends the events to complete quests, which are:
  - trade 5 green gems for 1 coin
  - trade 1 coin for 1 red gem

  These events are handled in the Quest Manager.
 */
const hz = __importStar(require("horizon/core"));
const hzui = __importStar(require("horizon/ui"));
const DataStore = __importStar(require("DataStore"));
const QuestManager_1 = require("QuestManager");
const Utils_1 = require("Utils");
const GreentoCoin_GREEN = 5;
const GreentoCoin_COIN = 1;
const CoinToRed_COIN = 1;
const CoinToRed_RED = 1;
class EconomyUI extends hzui.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 1080;
        this.panelWidth = 1920;
        this.COIN_COUNT = new hzui.Binding(0);
        this.GEM_COUNT = new hzui.Binding(0);
        this.RED_GEM_COUNT = new hzui.Binding(0);
        this.TRADE_BUTTON_HOVER = new hzui.Binding(false);
        this.TRADE2_BUTTON_HOVER = new hzui.Binding(false);
        this.CONFIRMATION_POPUP = new hzui.Binding(false);
        this.CONFIRMATION2_POPUP = new hzui.Binding(false);
        this.CANCEL_BUTTON_HOVER = new hzui.Binding(false);
        this.CONFIRM_BUTTON_HOVER = new hzui.Binding(false);
        this.CANCEL2_BUTTON_HOVER = new hzui.Binding(false);
        this.CONFIRM2_BUTTON_HOVER = new hzui.Binding(false);
    }
    refresh(player) {
        // console.log("[EconomyUI] running refresh for " + player.name.get())
        this.COIN_COUNT.set(this.GetCoins(player), [player]);
        this.GEM_COUNT.set(this.GetGems(player), [player]);
        // console.log("[EconomyUI] RetVal of getGems for " + player.name.get() + ": " + this.GetGems(player).toString())
        this.RED_GEM_COUNT.set(this.GetRedGems(player), [player]);
    }
    initializeUI() {
        return hzui.View({
            style: {
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                backgroundColor: hz.Color.black,
                borderColor: hz.Color.fromHex('#E6901C'),
                borderWidth: 4
            },
            children: [
                // Coins
                hzui.Text({
                    style: {
                        fontFamily: 'Kallisto',
                        fontSize: 96,
                        color: hz.Color.fromHex('#E6901C'),
                        textAlign: 'center'
                    },
                    text: hzui.Binding.derive([this.COIN_COUNT], (cointCount) => {
                        return `COINS: ${cointCount}`;
                    })
                }),
                // Gems
                hzui.Text({
                    style: {
                        fontFamily: 'Kallisto',
                        fontSize: 96,
                        color: hz.Color.fromHex('#E6901C'),
                        textAlign: 'center'
                    },
                    text: hzui.Binding.derive([this.GEM_COUNT], (gemCount) => {
                        return `GREEN GEMS: ${gemCount}`;
                    })
                }),
                // Red Gems
                hzui.Text({
                    style: {
                        fontFamily: 'Kallisto',
                        fontSize: 96,
                        color: hz.Color.fromHex('#E6901C'),
                        textAlign: 'center'
                    },
                    text: hzui.Binding.derive([this.RED_GEM_COUNT], (gemCount) => {
                        return `RED GEMS: ${gemCount}`;
                    })
                }),
                // Trade Button
                hzui.Pressable({
                    style: {
                        height: '25%',
                        width: '75%',
                        backgroundColor: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered) => {
                            if (hovered)
                                return hz.Color.fromHex('#E6901C');
                            else
                                return hz.Color.black;
                        }),
                        borderColor: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered) => {
                            if (hovered)
                                return hz.Color.black;
                            else
                                return hz.Color.fromHex('#E6901C');
                        }),
                        borderWidth: 4
                    },
                    children: [
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 96,
                                color: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered) => {
                                    if (hovered)
                                        return hz.Color.black;
                                    else
                                        return hz.Color.fromHex('#E6901C');
                                }),
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            },
                            text: `TRADE\n${GreentoCoin_GREEN} GREEN GEM -> ${GreentoCoin_COIN} COIN`
                        })
                    ],
                    onEnter: (player) => {
                        this.TRADE_BUTTON_HOVER.set(true, [player]);
                    },
                    onExit: (player) => {
                        this.TRADE_BUTTON_HOVER.set(false, [player]);
                    },
                    onRelease: (player) => {
                        this.CONFIRMATION_POPUP.set(true, [player]);
                    }
                }),
                // Trade 2
                hzui.Pressable({
                    style: {
                        height: '25%',
                        width: '75%',
                        backgroundColor: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered) => {
                            if (hovered)
                                return hz.Color.fromHex('#E6901C');
                            else
                                return hz.Color.black;
                        }),
                        borderColor: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered) => {
                            if (hovered)
                                return hz.Color.black;
                            else
                                return hz.Color.fromHex('#E6901C');
                        }),
                        borderWidth: 4
                    },
                    children: [
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 96,
                                color: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered) => {
                                    if (hovered)
                                        return hz.Color.black;
                                    else
                                        return hz.Color.fromHex('#E6901C');
                                }),
                                textAlign: 'center',
                                textAlignVertical: 'center',
                            },
                            text: `TRADE\n${CoinToRed_COIN} COIN -> ${CoinToRed_RED} RED GEM`
                        })
                    ],
                    onEnter: (player) => {
                        this.TRADE2_BUTTON_HOVER.set(true, [player]);
                    },
                    onExit: (player) => {
                        this.TRADE2_BUTTON_HOVER.set(false, [player]);
                    },
                    onRelease: (player) => {
                        this.CONFIRMATION2_POPUP.set(true, [player]);
                    }
                }),
                // Confirm Dialogue
                hzui.View({
                    style: {
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '50%',
                        width: '50%',
                        position: 'absolute',
                        backgroundColor: hz.Color.black,
                        borderColor: hz.Color.fromHex('#E6901C'),
                        borderWidth: 4,
                        display: hzui.Binding.derive([this.CONFIRMATION_POPUP], (active) => {
                            if (active)
                                return 'flex';
                            else
                                return 'none';
                        })
                    },
                    children: [
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 96,
                                color: hz.Color.fromHex('#E6901C'),
                                textAlign: 'center'
                            },
                            text: 'CONFIRM:'
                        }),
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 72,
                                color: hz.Color.fromHex('#E6901C'),
                                textAlign: 'center'
                            },
                            text: `${GreentoCoin_GREEN} GREEN GEM -> ${GreentoCoin_COIN} COIN`
                        }),
                        hzui.View({
                            style: {
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                height: '20%',
                                width: '100%',
                            },
                            children: [
                                // Cancel
                                hzui.Pressable({
                                    style: {
                                        height: '100%',
                                        width: '40%',
                                        backgroundColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.fromHex('#E6901C');
                                            else
                                                return hz.Color.black;
                                        }),
                                        borderColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.black;
                                            else
                                                return hz.Color.fromHex('#E6901C');
                                        }),
                                        borderWidth: 4
                                    },
                                    children: [
                                        hzui.Text({
                                            style: {
                                                fontFamily: 'Kallisto',
                                                fontSize: 72,
                                                color: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                                    if (hovered)
                                                        return hz.Color.black;
                                                    else
                                                        return hz.Color.fromHex('#E6901C');
                                                }),
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            },
                                            text: "CANCEL"
                                        })
                                    ],
                                    onEnter: (player) => {
                                        this.CANCEL_BUTTON_HOVER.set(true, [player]);
                                    },
                                    onExit: (player) => {
                                        this.CANCEL_BUTTON_HOVER.set(false, [player]);
                                    },
                                    onRelease: (player) => {
                                        this.CONFIRMATION_POPUP.set(false, [player]);
                                    }
                                }),
                                // Accept
                                hzui.Pressable({
                                    style: {
                                        height: '100%',
                                        width: '40%',
                                        backgroundColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.fromHex('#E6901C');
                                            else
                                                return hz.Color.black;
                                        }),
                                        borderColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.black;
                                            else
                                                return hz.Color.fromHex('#E6901C');
                                        }),
                                        borderWidth: 4,
                                        display: hzui.Binding.derive([this.GEM_COUNT], (count) => {
                                            if (count >= GreentoCoin_GREEN) {
                                                return 'flex';
                                            }
                                            else {
                                                return 'none';
                                            }
                                        })
                                    },
                                    children: [
                                        hzui.Text({
                                            style: {
                                                fontFamily: 'Kallisto',
                                                fontSize: 72,
                                                color: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                                    if (hovered)
                                                        return hz.Color.black;
                                                    else
                                                        return hz.Color.fromHex('#E6901C');
                                                }),
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            },
                                            text: "CONFIRM"
                                        })
                                    ],
                                    onEnter: (player) => {
                                        this.CONFIRM_BUTTON_HOVER.set(true, [player]);
                                    },
                                    onExit: (player) => {
                                        this.CONFIRM_BUTTON_HOVER.set(false, [player]);
                                    },
                                    onRelease: (player) => {
                                        // $$$ SPO Added isNPC()
                                        if (!(0, Utils_1.isNPC)(player)) {
                                            const GemCount = this.GetGems(player);
                                            if (GemCount >= GreentoCoin_GREEN) {
                                                this.CONFIRMATION_POPUP.set(false, [player]);
                                                this.HandleGreenGemToCoinTransaction(player, GreentoCoin_GREEN, GreentoCoin_COIN);
                                            }
                                        }
                                    }
                                }),
                            ]
                        })
                    ]
                }),
                // Confirm 2 Dialogue
                hzui.View({
                    style: {
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '50%',
                        width: '50%',
                        position: 'absolute',
                        backgroundColor: hz.Color.black,
                        borderColor: hz.Color.fromHex('#E6901C'),
                        borderWidth: 4,
                        display: hzui.Binding.derive([this.CONFIRMATION2_POPUP], (active) => {
                            if (active)
                                return 'flex';
                            else
                                return 'none';
                        })
                    },
                    children: [
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 96,
                                color: hz.Color.fromHex('#E6901C'),
                                textAlign: 'center'
                            },
                            text: 'CONFIRM:'
                        }),
                        hzui.Text({
                            style: {
                                fontFamily: 'Kallisto',
                                fontSize: 72,
                                color: hz.Color.fromHex('#E6901C'),
                                textAlign: 'center'
                            },
                            text: `${CoinToRed_COIN} COIN -> ${CoinToRed_RED} RED GEM`
                        }),
                        hzui.View({
                            style: {
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                height: '20%',
                                width: '100%',
                            },
                            children: [
                                // Cancel
                                hzui.Pressable({
                                    style: {
                                        height: '100%',
                                        width: '40%',
                                        backgroundColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.fromHex('#E6901C');
                                            else
                                                return hz.Color.black;
                                        }),
                                        borderColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.black;
                                            else
                                                return hz.Color.fromHex('#E6901C');
                                        }),
                                        borderWidth: 4
                                    },
                                    children: [
                                        hzui.Text({
                                            style: {
                                                fontFamily: 'Kallisto',
                                                fontSize: 72,
                                                color: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered) => {
                                                    if (hovered)
                                                        return hz.Color.black;
                                                    else
                                                        return hz.Color.fromHex('#E6901C');
                                                }),
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            },
                                            text: "CANCEL"
                                        })
                                    ],
                                    onEnter: (player) => {
                                        this.CANCEL_BUTTON_HOVER.set(true, [player]);
                                    },
                                    onExit: (player) => {
                                        this.CANCEL_BUTTON_HOVER.set(false, [player]);
                                    },
                                    onRelease: (player) => {
                                        this.CONFIRMATION2_POPUP.set(false, [player]);
                                    }
                                }),
                                // Accept
                                hzui.Pressable({
                                    style: {
                                        height: '100%',
                                        width: '40%',
                                        backgroundColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.fromHex('#E6901C');
                                            else
                                                return hz.Color.black;
                                        }),
                                        borderColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                            if (hovered)
                                                return hz.Color.black;
                                            else
                                                return hz.Color.fromHex('#E6901C');
                                        }),
                                        borderWidth: 4,
                                        display: hzui.Binding.derive([this.COIN_COUNT], (count) => {
                                            if (count >= CoinToRed_COIN) {
                                                return 'flex';
                                            }
                                            else {
                                                return 'none';
                                            }
                                        })
                                    },
                                    children: [
                                        hzui.Text({
                                            style: {
                                                fontFamily: 'Kallisto',
                                                fontSize: 72,
                                                color: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered) => {
                                                    if (hovered)
                                                        return hz.Color.black;
                                                    else
                                                        return hz.Color.fromHex('#E6901C');
                                                }),
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            },
                                            text: "CONFIRM"
                                        })
                                    ],
                                    onEnter: (player) => {
                                        this.CONFIRM_BUTTON_HOVER.set(true, [player]);
                                    },
                                    onExit: (player) => {
                                        this.CONFIRM_BUTTON_HOVER.set(false, [player]);
                                    },
                                    onRelease: (player) => {
                                        const CoinCount = this.GetCoins(player);
                                        if (CoinCount >= CoinToRed_COIN) {
                                            this.CONFIRMATION2_POPUP.set(false, [player]);
                                            this.HandleCoinToRedGemTransaction(player, CoinToRed_COIN, CoinToRed_RED);
                                        }
                                    }
                                }),
                            ]
                        })
                    ]
                })
            ]
        });
    }
    // when the Green Gem -> 1 Coin transaction is confirmed, this function handles it.
    HandleGreenGemToCoinTransaction(player, GemDelta, CoinDelta) {
        const manager = DataStore.dataStore.getData('NPCManager');
        const playerState = manager.playerMap.get(player.id);
        if (playerState != undefined) {
            console.warn("HandleGreenGemToCoinTransaction");
            playerState.gemsCollected -= GemDelta;
            playerState.coins += CoinDelta;
            if (player.hasCompletedAchievement('QuestCollect1Coin') == false) { // send event to resolve QuestCollect1Coin quest
                this.sendLocalBroadcastEvent(QuestManager_1.questComplete, { player: player, questName: QuestManager_1.QuestNames.QuestCollect1Coin });
            }
            manager.onTransactionDone(playerState, GemDelta, CoinDelta);
        }
        this.refresh(player);
    }
    // when the 1 Coin -> 1 Red Gem transaction is confirmed, this function handles it.
    HandleCoinToRedGemTransaction(player, CoinDelta, GemDelta) {
        const manager = DataStore.dataStore.getData('NPCManager');
        const playerState = manager.playerMap.get(player.id);
        if (playerState != undefined) {
            playerState.coins -= CoinDelta;
            playerState.redGems += GemDelta;
            if (player.hasCompletedAchievement('Collect1RedGem') == false) { // send event to resolve QuestCollect1RedGem quest
                this.sendLocalBroadcastEvent(QuestManager_1.questComplete, { player: player, questName: QuestManager_1.QuestNames.Collect1RedGem });
            }
            manager.onTransactionDone(playerState, GemDelta, CoinDelta);
        }
        this.refresh(player);
    }
    // retrieves count of player green gems
    GetGems(player) {
        let retVal = 0;
        const manager = DataStore.dataStore.getData('NPCManager');
        if (manager != undefined) {
            const playerState = manager.playerMap.get(player.id);
            if (playerState != undefined) {
                retVal = playerState.gemsCollected;
            }
        }
        return retVal;
    }
    // retrieves count of player red gems
    GetRedGems(player) {
        let retVal = 0;
        const manager = DataStore.dataStore.getData('NPCManager');
        if (manager != undefined) {
            const playerState = manager.playerMap.get(player.id);
            if (playerState != undefined) {
                retVal = playerState.redGems;
            }
        }
        return retVal;
    }
    // retrieves count of player gold coins
    GetCoins(player) {
        let retVal = 0;
        const manager = DataStore.dataStore.getData('NPCManager');
        if (manager != undefined) {
            const playerState = manager.playerMap.get(player.id);
            if (playerState != undefined) {
                retVal = playerState.coins;
            }
        }
        return retVal;
    }
    start() {
        let UIs = DataStore.dataStore.getData('EconomyUIs');
        if (UIs == undefined) {
            UIs = [];
        }
        UIs.push(this);
        DataStore.dataStore.setData('EconomyUIs', UIs);
    }
}
exports.EconomyUI = EconomyUI;
EconomyUI.propsDefinition = {};
hzui.UIComponent.register(EconomyUI);
