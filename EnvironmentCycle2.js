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
const core_1 = require("horizon/core");
const hz = __importStar(require("horizon/core"));
const core_2 = require("horizon/core");
// Edited:WhiteSwordvr
class EnvironmentCycle extends core_2.Component {
    // to change the text that appears edited it down here
    start() {
        this.times = [
            "Twilight", "Sunrise", "Morning", "Overcast", "Daytime",
            "Sunset", "Evening", "Night ", "Midnight",
        ];
        this.envAssets = [
            this.props.twilight,
            this.props.sunrise,
            this.props.morning,
            this.props.overcast,
            this.props.daytime,
            this.props.sunset,
            this.props.evening,
            this.props.night,
            this.props.midnight,
        ];
        this.iterator = 4; // Start at "Daytime"
        this.currentAsset = null;
        this.spawnEnvironment(this.iterator);
        this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, () => {
            this.cycleEnvironment();
        });
    }
    async cycleEnvironment() {
        // Play feedback effects
        const sfx = this.props.sfx.as(core_1.AudioGizmo);
        if (sfx) {
            sfx.play();
        }
        // Despawn current environment
        if (this.currentAsset) {
            await this.currentAsset.unload();
            this.currentAsset = null;
        }
        // Temporarily disable trigger
        const trigger = this.props.trigger.as(core_1.TriggerGizmo);
        if (trigger) {
            trigger.enabled.set(false);
        }
        await new Promise(resolve => this.async.setTimeout(resolve, 1000));
        // Advance index
        this.iterator = (this.iterator + 1) % this.envAssets.length;
        // Spawn next environment
        await this.spawnEnvironment(this.iterator);
        // Re-enable trigger
        if (trigger) {
            trigger.enabled.set(true);
        }
    }
    async spawnEnvironment(index) {
        const asset = this.envAssets[index];
        this.currentAsset = new hz.SpawnController(asset, this.entity.position.get(), hz.Quaternion.one, hz.Vec3.one);
        await this.currentAsset.spawn();
        // Update display text
        const textObj = this.props.textObj.as(core_1.TextGizmo);
        if (textObj) {
            textObj.text.set(this.times[index]);
        }
    }
}
EnvironmentCycle.propsDefinition = {
    textObj: { type: core_2.PropTypes.Entity },
    trigger: { type: core_2.PropTypes.Entity },
    sfx: { type: core_2.PropTypes.Entity },
    twilight: { type: core_2.PropTypes.Asset },
    sunrise: { type: core_2.PropTypes.Asset },
    morning: { type: core_2.PropTypes.Asset },
    overcast: { type: core_2.PropTypes.Asset },
    daytime: { type: core_2.PropTypes.Asset },
    sunset: { type: core_2.PropTypes.Asset },
    evening: { type: core_2.PropTypes.Asset },
    night: { type: core_2.PropTypes.Asset },
    midnight: { type: core_2.PropTypes.Asset },
};
core_2.Component.register(EnvironmentCycle);
