"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
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
    onGameStateChanged: new hz.LocalEvent("onGameStateChanged"),
    onRegisterPlayerForMatch: new hz.LocalEvent("onRegisterPlayerForMatch"),
    onDeregisterPlayerForMatch: new hz.LocalEvent("onDeregisterPlayerForMatch"),
    onPlayerJoinedStandby: new hz.LocalEvent("onPlayerJoinedStandby"),
    onPlayerLeftMatch: new hz.LocalEvent("onPlayerLeftMatch"),
    onPlayerLeftStandby: new hz.LocalEvent("onPlayerLeftStandby"),
    onPlayerReachedGoal: new hz.LocalEvent("onPlayerReachedGoal"),
    onResetLocalObjects: new hz.NetworkEvent("onResetLocalObjects"),
    onResetWorld: new hz.NetworkEvent("onResetWorld"),
    onGameEndTimeLeft: new hz.LocalEvent("onGameEndTimeLeft"),
    onGameStartTimeLeft: new hz.LocalEvent("onGameStartTimeLeft"),
    onRegisterPlyrCtrl: new hz.LocalEvent("onRegisterPlyrCtrl"),
    onGetPlyrCtrlData: new hz.NetworkEvent("onGetPlyrCtrlData"),
    onSetPlyrCtrlData: new hz.NetworkEvent("onSetPlyrCtrlData"),
    onPlayerGotBoost: new hz.NetworkEvent("onPlayerGotBoost"), //The server needs to tell the local player controller that they have a boost
    onPlayerUsedBoost: new hz.LocalEvent("onPlayerUsedBoost"), //this can be a local event given that we are only running it from the local player
    onPlayerUsedDoubleJump: new hz.LocalEvent("onPlayerUsedDoubleJump"), //this can be a local event given that we are only running it from the local player
    onRegisterOOBRespawner: new hz.LocalEvent("onRegisterOOBRespawner"),
    onGetOOBRespawnerData: new hz.NetworkEvent("onGetOOBRespawnerData"),
    onSetOOBRespawnerData: new hz.NetworkEvent("onSetOOBRespawnerData"),
    onPlayerOutOfBounds: new hz.NetworkEvent("onPlayerOutOfBounds"),
    onRegisterRaceHUD: new hz.LocalEvent("onRegisterRaceHUD"),
    onRacePosUpdate: new hz.NetworkEvent('onRacePosUpdate'),
    onStopRacePosUpdates: new hz.NetworkEvent('onStopRacePosUpdates'),
    //onPlayerListInStatusChanged : new hz.LocalEvent<{ pgs: PlayerGameStatus , player: hz.Player[]}>('onPlayerListInStatusChanged'),
};
