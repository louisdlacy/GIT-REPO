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
exports.RespawnTrigger = void 0;
const hz = __importStar(require("horizon/core"));
class RespawnTrigger extends hz.Component {
    start() {
        if (this.props.triggerZone) {
            this.triggerEnter = this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
        }
    }
    onPlayerEnterTrigger(player) {
        if (this.props.respawnPoint) {
            // Move the player to the respawn point's position
            player.position.set(this.props.respawnPoint.position.get());
            // Optionally reset velocity, play sound, etc.
            player.velocity.set(new hz.Vec3(0, 0, 0));
        }
    }
    dispose() {
        this.triggerEnter?.disconnect();
        super.dispose();
    }
}
exports.RespawnTrigger = RespawnTrigger;
RespawnTrigger.propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }, // Reference to your trigger gizmo
    respawnPoint: { type: hz.PropTypes.Entity }, // Reference to your spawn point gizmo/entity
};
hz.Component.register(RespawnTrigger);
