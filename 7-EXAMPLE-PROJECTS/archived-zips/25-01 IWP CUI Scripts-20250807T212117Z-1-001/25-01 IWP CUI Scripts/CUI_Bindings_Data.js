"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuiBindings_Data = void 0;
const ui_1 = require("horizon/ui");
const PlayerData_Func_1 = require("PlayerData_Func");
exports.cuiBindings_Data = {
    tokensBinding: new ui_1.Binding(0),
    playerDataBinding: new ui_1.Binding(PlayerData_Func_1.playerData_Func.createEmptyPlayerData(undefined)),
};
