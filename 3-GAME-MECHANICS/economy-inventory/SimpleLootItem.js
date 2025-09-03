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
exports.SimpleLootItemEvents = void 0;
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
exports.SimpleLootItemEvents = {
    OnPickupLoot: new hz.NetworkEvent('OnPickupLoot'),
};
class SimpleLootItem extends hz.Component {
    constructor() {
        super(...arguments);
        this.updateIntervalId = -1;
        this.updateDelayS = 0.1;
        this.update = (deltaTime) => { };
        this.elapsed = 0;
        this.active = true;
        this.respawnRemaining = -1;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            this.onTriggerEnter(enteredBy);
        });
    }
    start() {
        this.active = this.props.active || false;
        if (this.active) {
            // Set the update method to point to the animateMesh method
            this.update = this.animateMesh;
        }
        // Repeatedly call this.update every this.updateDelayS seconds (0.1s by default)
        this.updateIntervalId = this.async.setInterval(() => {
            this.update(this.updateDelayS);
        }, this.updateDelayS * 1000);
    }
    awaitRespawn(deltaTime) {
        this.respawnRemaining -= deltaTime;
        if (this.respawnRemaining <= 0) {
            this.activate();
        }
    }
    animateMesh(deltaTime) {
        if (this.props.mesh === undefined || this.props.mesh === null) {
            return;
        }
        this.elapsed += deltaTime;
        // Rotation
        const animRotationTheta = this.elapsed * this.props.animRotationFrequency * Math.PI * 2;
        this.props.mesh.rotateRelativeTo(this.entity, hz.Quaternion.fromAxisAngle(this.props.mesh.up.get(), animRotationTheta), hz.Space.World);
        // Position
        const animPositionDelta = Math.sin(this.elapsed * this.props.animBobFrequency) * this.props.animBobAmplitude;
        this.props.mesh.moveRelativeTo(this.entity, this.props.mesh.up.get().mul(animPositionDelta), hz.Space.Local);
    }
    onTriggerEnter(player) {
        if (this.active) {
            core_1.WorldInventory.grantItemToPlayer(player, this.props.lootSKU, this.props.lootCount);
            this.sendNetworkBroadcastEvent(exports.SimpleLootItemEvents.OnPickupLoot, { player, sku: this.props.lootSKU, count: this.props.lootCount });
            this.deactivate();
        }
    }
    activate() {
        this.active = true;
        this.entity.as(hz.TriggerGizmo).enabled.set(true);
        this.props.mesh?.visible.set(true);
        this.props.pfx?.as(hz.ParticleGizmo).play();
        this.props.light?.as(hz.DynamicLightGizmo).enabled.set(true);
        this.update = this.animateMesh;
    }
    deactivate() {
        this.active = false;
        this.entity.as(hz.TriggerGizmo).enabled.set(false);
        this.props.mesh?.visible.set(false);
        this.props.pfx?.as(hz.ParticleGizmo).stop();
        this.props.light?.as(hz.DynamicLightGizmo).enabled.set(false);
        // If respawn is enabled, start the timer to delay the respawn
        if (this.props.respawnEnabled) {
            this.respawnRemaining = this.props.respawnDelay;
            this.update = this.awaitRespawn;
        }
        else {
            this.async.clearInterval(this.updateIntervalId);
            this.updateIntervalId = -1;
        }
    }
}
SimpleLootItem.propsDefinition = {
    active: { type: hz.PropTypes.Boolean, default: true },
    mesh: { type: hz.PropTypes.Entity },
    pfx: { type: hz.PropTypes.Entity },
    light: { type: hz.PropTypes.Entity },
    animRotationFrequency: { type: hz.PropTypes.Number, default: 0.5 },
    animBobFrequency: { type: hz.PropTypes.Number, default: 0.5 },
    animBobAmplitude: { type: hz.PropTypes.Number, default: 0.1 },
    lootSKU: { type: hz.PropTypes.String, default: '' },
    lootCount: { type: hz.PropTypes.Number, default: 1 },
    respawnEnabled: { type: hz.PropTypes.Boolean, default: true },
    respawnDelay: { type: hz.PropTypes.Number, default: 10 },
};
hz.Component.register(SimpleLootItem);
