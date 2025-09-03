"use strict";
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
exports.Events = void 0;
const hz = __importStar(require("horizon/core"));
exports.Events = {
    // UAB
    onStartUabAnimation: new hz.LocalEvent("onUabNeedUpdate"),
    // NPC
    onNpcJoinWorld: new hz.LocalEvent('onNpcJoinWorld'),
    onGloballyPerceivedEvent: new hz.LocalEvent('onGloballyPerceivedEvent'),
    onEmotionChanged: new hz.LocalEvent('onEmotionChanged'),
    onStoppedTalking: new hz.LocalEvent('onStoppedTalking'),
    resetAnimation: new hz.LocalEvent('resetAnimation'),
    onVisemeReceived: new hz.LocalEvent('onViseme'),
    onStartedLookingAtTarget: new hz.LocalEvent('onStartedLookingAtTarget'),
    onStoppedLookingAtTarget: new hz.LocalEvent('onStoppedLookingAtTarget'),
    // Attention
    onUnsubscribeFromAttention: new hz.LocalEvent('onUnsubscribeFromAttention'),
    onStoppedNoticeAttention: new hz.LocalEvent('onStoppedLookingAtAttention'),
    // Navigation
    stopNavigation: new hz.LocalEvent('stopNavigation'),
    resumeNavigation: new hz.LocalEvent('resumeNavigation'),
    navigateToTarget: new hz.LocalEvent('navigateToTarget'),
    // Npc Navigation
    navigateOut: new hz.LocalEvent('navigateOut'),
};
