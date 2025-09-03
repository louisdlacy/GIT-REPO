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
class DoorTrigger extends hz.Component {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
    start() {
        this.initialPosition = this.props.door.position.get();
        // Calculate target position: move only to the left (negative X), keep Y and Z the same
        this.targetPosition = new hz.Vec3(this.initialPosition.x - this.props.slideDistance, this.initialPosition.y, this.initialPosition.z);
        this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.askPlayerToOpenDoor(player);
        });
        // Add trigger for when player leaves the zone
        this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            this.closeDoor();
        });
    }
    askPlayerToOpenDoor(player) {
        const message = "Do you want to open the door?";
        const options = ["Yes", "No"];
        // Assuming there's a UI component or a way to display a prompt to the player
        // For demonstration purposes, we'll use a simple console log
        console.log(message);
        // Simulating player response
        const response = "Yes"; // Replace with actual player input
        if (response === "Yes") {
            this.openDoor();
        }
    }
    openDoor() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.slideDoor(this.targetPosition);
        }
    }
    closeDoor() {
        if (this.isOpen) {
            this.isOpen = false;
            this.slideDoor(this.initialPosition);
        }
    }
    slideDoor(targetPosition) {
        const duration = 1; // seconds
        const startTime = Date.now();
        const initialPosition = this.props.door.position.get();
        // Disconnect any existing animation
        if (this.updateSubscription) {
            this.updateSubscription.disconnect();
        }
        this.updateSubscription = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            const elapsed = (Date.now() - startTime) / 1000;
            const t = Math.min(elapsed / duration, 1);
            // Use smooth interpolation for position
            const position = hz.Vec3.lerp(initialPosition, targetPosition, t);
            this.props.door.position.set(position);
            if (t === 1) {
                this.updateSubscription.disconnect();
                console.log(this.isOpen ? 'Door opened' : 'Door closed');
            }
        });
    }
}
DoorTrigger.propsDefinition = {
    door: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
    slideDistance: { type: hz.PropTypes.Number, default: 4 }
};
hz.Component.register(DoorTrigger);
