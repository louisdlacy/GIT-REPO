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
const hz = __importStar(require("horizon/core"));
const sysUtils_1 = require("sysUtils");
// TODO: Disable HWXS Grab Relax Animation in the property panel of grabbable objects
class FeaturesLab_HolsterExample extends hz.Component {
    constructor() {
        super(...arguments);
        this.objectsToHolster = [];
        this.objectsOriginalPositions = [];
        this.objectsOriginalRotations = [];
    }
    start() {
        this.activePlayer = this.world.getServerPlayer();
        if (this.props.objectToHolster1 !== undefined) {
            this.objectsToHolster.push(this.props.objectToHolster1);
            this.objectsOriginalPositions.push(this.props.objectToHolster1.position.get());
            this.objectsOriginalRotations.push(this.props.objectToHolster1.rotation.get());
        }
        if (this.props.objectToHolster2 !== undefined) {
            this.objectsToHolster.push(this.props.objectToHolster2);
            this.objectsOriginalPositions.push(this.props.objectToHolster2.position.get());
            this.objectsOriginalRotations.push(this.props.objectToHolster2.rotation.get());
        }
        if (this.props.objectToHolster3 !== undefined) {
            this.objectsToHolster.push(this.props.objectToHolster3);
            this.objectsOriginalPositions.push(this.props.objectToHolster3.position.get());
            this.objectsOriginalRotations.push(this.props.objectToHolster3.rotation.get());
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.activePlayer === this.world.getServerPlayer()) {
                this.activePlayer = player;
                this.objectsToHolster.forEach(object => {
                    object?.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
                    object?.as(hz.GrabbableEntity)?.setWhoCanGrab([player]);
                    // Reset object position and rotation when it is detached
                    this.connectCodeBlockEvent(object, hz.CodeBlockEvents.OnAttachEnd, () => {
                        let index = this.objectsToHolster.indexOf(object);
                        object?.position.set(this.objectsOriginalPositions[index]);
                        object?.rotation.set(this.objectsOriginalRotations[index]);
                    });
                });
                (0, sysUtils_1.SetTextGizmoText)(this.props.holsterExampleText, `Holster multiple objects<br><br>Objects being used by ${this.activePlayer.name.get()}<br>Press the button again to unequip the objects`);
            }
            else if (this.activePlayer === player) {
                this.activePlayer = this.world.getServerPlayer();
                // Force release any grabbed objects and detach them
                this.objectsToHolster.forEach(object => {
                    object?.as(hz.GrabbableEntity)?.forceRelease();
                    object?.as(hz.GrabbableEntity)?.setWhoCanGrab([]);
                    this.connectCodeBlockEvent(object, hz.CodeBlockEvents.OnGrabEnd, () => {
                        object?.as(hz.AttachableEntity)?.detach();
                    });
                });
                // Detach any remaining objects
                this.objectsToHolster.forEach(object => {
                    object?.as(hz.AttachableEntity)?.detach();
                });
                (0, sysUtils_1.SetTextGizmoText)(this.props.holsterExampleText, "Holster multiple objects<br><br>Press the button to equip several objects<br>at the same time");
            }
        });
    }
}
FeaturesLab_HolsterExample.propsDefinition = {
    holsterExampleText: { type: hz.PropTypes.Entity },
    objectToHolster1: { type: hz.PropTypes.Entity },
    objectToHolster2: { type: hz.PropTypes.Entity },
    objectToHolster3: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_HolsterExample);
