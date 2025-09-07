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
/*
  This script resets all of the active quests in the world. It is attached to a Trigger Zone gizmo.

*/
const hz = __importStar(require("horizon/core"));
const QuestManager_1 = require("QuestManager");
const GameManager_1 = require("GameManager");
class QuestResetTrigger extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            const keys = Object.keys(QuestManager_1.QuestNames);
            keys.forEach((key, value) => {
                if ((value.valueOf() == 0) && (value.toString() != "0") && (value.toString() != "undefined"))
                    console.log("Resetting quest: " + value);
                this.sendLocalBroadcastEvent(QuestManager_1.questReset, { player: enteredBy, questName: value });
            });
            this.sendLocalBroadcastEvent(QuestManager_1.questBoardUpdate, {});
            // resets the counter for total lifetime gems.
            this.sendLocalBroadcastEvent(GameManager_1.resetGemCounter, { collector: enteredBy });
            // stop playback of any effects that may be playing because of winning the game.
            if ((this.props.vfxAllQuestsWin) && (this.props.sfxAllQuestsWin)) {
                this.props.vfxAllQuestsWin?.as(hz.ParticleGizmo).stop();
                this.props.sfxAllQuestsWin?.as(hz.AudioGizmo).stop();
            }
            console.log("[QuestManager]: " + enteredBy.name.get() + " all quests reset.");
        });
    }
}
QuestResetTrigger.propsDefinition = {
    vfxAllQuestsWin: { type: hz.PropTypes.Entity },
    sfxAllQuestsWin: { type: hz.PropTypes.Entity },
};
hz.Component.register(QuestResetTrigger);
