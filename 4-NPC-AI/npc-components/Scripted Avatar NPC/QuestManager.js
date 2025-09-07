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
exports.questBoardUpdate = exports.questReset = exports.questComplete = exports.QuestNames = void 0;
/*
  This script manages the initialization, tracking, resolution and resetting of the quests in the world.

*/
const hz = __importStar(require("horizon/core"));
const Utils_1 = require("Utils");
var QuestNames;
(function (QuestNames) {
    QuestNames[QuestNames["QuestCollect1Coin"] = 0] = "QuestCollect1Coin";
    QuestNames[QuestNames["QuestCollect1Gem"] = 1] = "QuestCollect1Gem";
    QuestNames[QuestNames["QuestCollect5Gems"] = 2] = "QuestCollect5Gems";
    QuestNames[QuestNames["QuestCollect15Gems"] = 3] = "QuestCollect15Gems";
    QuestNames[QuestNames["Collect1RedGem"] = 4] = "Collect1RedGem";
})(QuestNames || (exports.QuestNames = QuestNames = {}));
;
exports.questComplete = new hz.LocalEvent('questComplete');
exports.questReset = new hz.LocalEvent('questReset');
exports.questBoardUpdate = new hz.LocalEvent('questBoardUpdate');
class QuestManager extends hz.Component {
    preStart() { }
    start() {
        this.questBoardUpdate();
        // listener for questComplete event.
        this.connectLocalBroadcastEvent(exports.questComplete, (data) => {
            this.completeQuest(data.player, data.questName);
        });
        // listener for questReset event.
        this.connectLocalBroadcastEvent(exports.questReset, (data) => {
            this.resetQuest(data.player, data.questName);
        });
        // listener for questBoardUpdate event.
        this.connectLocalBroadcastEvent(exports.questBoardUpdate, ({}) => {
            this.questBoardUpdate();
        });
    }
    ;
    completeQuest(player, questName) {
        if ((0, Utils_1.isNPC)(player) == false) {
            let qValue = QuestNames[questName];
            if (player.hasCompletedAchievement(qValue) == false) {
                player.setAchievementComplete(qValue, true);
                console.log("Quest " + qValue + " complete for " + player.name.get() + "!");
                this.world.ui.showPopupForPlayer(player, 'Quest Complete!', 2);
                if (qValue == "Collect1RedGem") {
                    this.onCollect1RedGem();
                }
                if (this.props.sfxQuestWin) {
                    this.props.sfxQuestWin.as(hz.AudioGizmo).play();
                }
                this.async.setTimeout(() => {
                    if (this.checkAllQuestsCompleted(player) == true) { // This means all quests have been completed.
                        if (this.props.vfxAllQuestsWin) {
                            let myVFX = this.props.vfxAllQuestsWin.as(hz.ParticleGizmo);
                            myVFX.play();
                        }
                        if (this.props.sfxAllQuestsWin) {
                            let mySFX = this.props.sfxAllQuestsWin.as(hz.AudioGizmo);
                            mySFX.play();
                        }
                    }
                }, 3000);
            }
        }
    }
    checkAllQuestsCompleted(player) {
        const keys = Object.keys(QuestNames);
        let allQuests = true;
        let keyString = "";
        keys.forEach((key, value) => {
            keyString = key.toString();
            if (keyString.length >= 2) {
                if (player.hasCompletedAchievement(key.toString()) == false) {
                    allQuests = false;
                    return allQuests;
                }
                ;
            }
        });
        return allQuests;
    }
    ;
    resetQuest(player, questName) {
        let qValue = QuestNames[questName];
        if (qValue != undefined) {
            // console.log("[QuestManager]: for " + player.name.get() + ", resetting quest: " + qValue)
            player.setAchievementComplete(qValue, false);
            if (qValue == "Collect1RedGem") {
                if ((this.props.redGem) && (this.props.redGemPosition)) {
                    let myGem = this.props.redGem?.as(hz.Entity);
                    myGem.position.set(this.props.redGemPosition.position.get());
                    myGem.as(hz.Entity).visible.set(false);
                }
            }
        }
    }
    questBoardUpdate() {
        if (this.props.questBoard) {
            let myQuests = [];
            const keys = Object.keys(QuestNames);
            keys.forEach((key, value) => {
                if (key) {
                    myQuests.push(key.toString());
                }
            });
            if (myQuests.length > 0) {
                let myBoard = this.props.questBoard.as(hz.AchievementsGizmo);
                myBoard.displayAchievements(myQuests);
            }
            else {
                console.error("No quests to display!");
            }
        }
    }
    onCollect1RedGem() {
        if ((this.props.redGem) && (this.props.redGemPosition)) {
            this.props.redGem.position.set(this.props.redGemPosition.position.get());
            this.props.redGem.as(hz.Entity).visible.set(true);
        }
    }
}
QuestManager.propsDefinition = {
    questBoard: { type: hz.PropTypes.Entity }, // a reference to the hosting object if script is attached to the Quest Board. Else, a link to the Quest Board.
    sfxQuestWin: { type: hz.PropTypes.Entity },
    vfxAllQuestsWin: { type: hz.PropTypes.Entity },
    sfxAllQuestsWin: { type: hz.PropTypes.Entity },
    redGem: { type: hz.PropTypes.Entity },
    redGemPosition: { type: hz.PropTypes.Entity },
};
hz.Component.register(QuestManager);
