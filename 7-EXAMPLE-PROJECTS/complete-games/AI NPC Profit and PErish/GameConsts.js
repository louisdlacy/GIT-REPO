"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionAudience = exports.CUSTOMER_SPEED_DEFAULT = exports.ONLY_USE_EMOTIONS_FROM_LLM = exports.Emotions = exports.DEFAULT_NAV_TIME = exports.CONSOLE_LOG_NPC_ANIMATION = exports.CONSOLE_LOG_NAVIGATION = exports.CONSOLE_LOG_VISEMES = exports.CONSOLE_LOG_ANIMATION_EVENTS = exports.CONSOLE_LOG_UAB = exports.CONSOLE_LOG_ASYNC = exports.CONSOLE_LOG_LLM_EMOTION = exports.CONSOLE_LOG_LLM = exports.CONSOLE_LOG_NPC_BUS = exports.CONSOLE_LOG_ITEM_PERCEPTION = void 0;
//#region Debug Settings
exports.CONSOLE_LOG_ITEM_PERCEPTION = false;
exports.CONSOLE_LOG_NPC_BUS = false;
exports.CONSOLE_LOG_LLM = false;
exports.CONSOLE_LOG_LLM_EMOTION = false;
exports.CONSOLE_LOG_ASYNC = false;
exports.CONSOLE_LOG_UAB = false;
exports.CONSOLE_LOG_ANIMATION_EVENTS = false;
exports.CONSOLE_LOG_VISEMES = false;
exports.CONSOLE_LOG_NAVIGATION = false;
exports.CONSOLE_LOG_NPC_ANIMATION = false;
//#endregion
exports.DEFAULT_NAV_TIME = 3; // Time in seconds for the NPC to linger on a player
//#region Boss Emotional States
var Emotions;
(function (Emotions) {
    Emotions["Neutral"] = "Neutral";
    Emotions["Happy"] = "Happy";
    Emotions["Confused"] = "Confused";
    Emotions["Angry"] = "Angry";
    Emotions["Suspicious"] = "Suspicious";
})(Emotions || (exports.Emotions = Emotions = {}));
exports.ONLY_USE_EMOTIONS_FROM_LLM = true;
//#endregion
//#regions Customer
exports.CUSTOMER_SPEED_DEFAULT = 1.1; // Default speed for the customer to move at
//#endregion
//#region NPC
var CaptionAudience;
(function (CaptionAudience) {
    CaptionAudience[CaptionAudience["None"] = 0] = "None";
    CaptionAudience[CaptionAudience["PlayerOnly"] = 1] = "PlayerOnly";
    CaptionAudience[CaptionAudience["AllPlayers"] = 2] = "AllPlayers";
})(CaptionAudience || (exports.CaptionAudience = CaptionAudience = {}));
//#endregion
