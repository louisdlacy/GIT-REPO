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
const Weapon_1 = require("Weapon");
const hz = __importStar(require("horizon/core"));
const projectileLauncherOptions = {
    speed: 200,
    duration: 1
};
// Extends Weapon<typeof Gun> means this class inherits all the properties and methods of the Weapon class.
// You can use this pattern to create your own weapon with custom properties and methods.
class Gun extends Weapon_1.Weapon {
    start() {
        super.start();
    }
    // Override onGrab() and onRelease() to set the projectileLauncher's owner to the player who grabbed it, and back to the server.
    // (The projectileLauncher must be owner by the player in order for editor properties GrabAimPosition / GrabAimRotation to take effect.)
    onGrab(player) {
        this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).owner.set(player);
        super.onGrab(player);
    }
    onRelease() {
        this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).owner.set(this.world.getServerPlayer());
        super.onRelease();
    }
    onIndexTriggerDown(player) {
        // Calling super.onIndexTriggerDown() in an override function will play the fire animation, and return true if the weapon was fired (accounting for fireCooldown).
        const didFire = super.onIndexTriggerDown(player);
        if (didFire) {
            this.props.muzzleFlash?.as(hz.ParticleGizmo).play();
            this.props.gunshotSfx?.as(hz.AudioGizmo).play();
            this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).launch(projectileLauncherOptions);
        }
        return didFire;
    }
}
Gun.propsDefinition = {
    ...Weapon_1.Weapon.propsDefinition, // Add the Weapon.propsDefinition using the spread operator (...) in order to extend Weapon.
    projectileLauncher: { type: hz.PropTypes.Entity },
    muzzleFlash: { type: hz.PropTypes.Entity },
    gunshotSfx: { type: hz.PropTypes.Entity },
};
hz.Component.register(Gun);
