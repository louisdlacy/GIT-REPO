"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const navmesh_1 = __importDefault(require("horizon/navmesh"));
const TeleportPlayer_Data_1 = require("TeleportPlayer_Data");
const UtilArray_Func_1 = require("UtilArray_Func");
class TeleportPlayer_Entity extends core_1.Component {
    async preStart() {
        TeleportPlayer_Data_1.teleportPlayer_Data.ray = this.props.ray?.as(core_1.RaycastGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
        TeleportPlayer_Data_1.teleportPlayer_Data.navMesh = await navmesh_1.default.getInstance(this.world).getByName('player');
    }
    start() {
    }
    playerEnterWorld(player) {
        if (!TeleportPlayer_Data_1.teleportPlayer_Data.players.includes(player)) {
            TeleportPlayer_Data_1.teleportPlayer_Data.players.push(player);
        }
    }
    playerExitWorld(player) {
        UtilArray_Func_1.arrayUtils.removeItemFromArray(TeleportPlayer_Data_1.teleportPlayer_Data.players, player);
    }
}
TeleportPlayer_Entity.propsDefinition = {
    ray: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(TeleportPlayer_Entity);
