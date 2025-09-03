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
// Import the necessary modules from the Horizon Worlds core API.
const hz = __importStar(require("horizon/core"));
/**
 * A universal component to independently move, rotate, and/or scale its attached entity.
 * Uses user-friendly string properties and supports both Local and World space.
 */
class MoveRotateAndScale extends hz.Component {
    constructor() {
        super(...arguments);
        // -- STATE VARIABLES --
        this.isPlaying = false;
        this.moveElapsedTime = 0;
        this.moveHasFinished = false;
        this.rotateElapsedTime = 0;
        this.rotateHasFinished = false;
        this.scaleElapsedTime = 0;
        this.scaleHasFinished = false;
    }
    start() {
        this.setupActivation();
        this.connectLocalBroadcastEvent(hz.World.onUpdate, this.onUpdate.bind(this));
    }
    setupActivation() {
        const mode = this.getActivationModeFromString(this.props.activationMode);
        switch (mode) {
            case 1:
                if (this.props.triggerEntity) {
                    const trigger = this.props.triggerEntity.as(hz.TriggerGizmo);
                    this.connectCodeBlockEvent(trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => this.triggerAnimation());
                }
                break;
            case 2:
                this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, () => this.triggerAnimation());
                break;
            default:
                this.triggerAnimation();
                break;
        }
    }
    triggerAnimation() {
        if (this.isPlaying && !this.props.resetOnTrigger)
            return;
        // Capture the initial state based on the chosen coordinate space.
        if (this.props.useLocalSpace) {
            this.startPosition = this.entity.transform.localPosition.get();
            this.startRotation = this.entity.transform.localRotation.get();
            this.startScale = this.entity.transform.localScale.get();
        }
        else {
            this.startPosition = this.entity.position.get();
            this.startRotation = this.entity.rotation.get();
            this.startScale = this.entity.scale.get();
        }
        // Set initial targets.
        this.targetPosition = hz.Vec3.add(this.startPosition, this.props.moveOffset);
        const offsetQuaternion = hz.Quaternion.fromEuler(this.props.rotateOffset);
        this.targetRotation = hz.Quaternion.mul(this.startRotation, offsetQuaternion);
        this.targetScaleValue = this.props.targetScale;
        // Reset all state variables.
        this.moveElapsedTime = 0;
        this.moveHasFinished = false;
        this.rotateElapsedTime = 0;
        this.rotateHasFinished = false;
        this.scaleElapsedTime = 0;
        this.scaleHasFinished = false;
        this.isPlaying = true;
    }
    onUpdate(data) {
        if (!this.isPlaying)
            return;
        if (this.props.enableMove && !this.moveHasFinished)
            this.updateMove(data.deltaTime);
        if (this.props.enableRotate && !this.rotateHasFinished)
            this.updateRotate(data.deltaTime);
        if (this.props.enableScale && !this.scaleHasFinished)
            this.updateScale(data.deltaTime);
        const moveIsDone = !this.props.enableMove || this.moveHasFinished;
        const rotateIsDone = !this.props.enableRotate || this.rotateHasFinished;
        const scaleIsDone = !this.props.enableScale || this.scaleHasFinished;
        if (moveIsDone && rotateIsDone && scaleIsDone) {
            this.isPlaying = false;
        }
    }
    updateMove(deltaTime) {
        this.moveElapsedTime += deltaTime;
        let progress = Math.min(this.moveElapsedTime / this.props.moveDuration, 1.0);
        if (progress >= 1.0) {
            progress = 1.0;
            const behavior = this.getEndBehaviorFromString(this.props.moveEndBehavior);
            switch (behavior) {
                case 1:
                    this.entity.position.set(this.startPosition);
                    this.moveHasFinished = true;
                    break;
                case 2:
                    this.entity.position.set(this.startPosition);
                    this.moveElapsedTime = 0;
                    progress = 0;
                    break;
                case 3:
                    [this.startPosition, this.targetPosition] = [this.targetPosition, this.startPosition];
                    this.moveElapsedTime = 0;
                    progress = 0;
                    break;
                default:
                    this.moveHasFinished = true;
                    break;
            }
        }
        const easing = this.getEasingTypeFromString(this.props.moveEasingType);
        const easedProgress = this.getEasedProgress(progress, easing);
        const currentPosition = hz.Vec3.lerp(this.startPosition, this.targetPosition, easedProgress);
        if (this.props.useLocalSpace) {
            this.entity.transform.localPosition.set(currentPosition);
        }
        else {
            this.entity.position.set(currentPosition);
        }
    }
    updateRotate(deltaTime) {
        this.rotateElapsedTime += deltaTime;
        let progress = Math.min(this.rotateElapsedTime / this.props.rotateDuration, 1.0);
        if (progress >= 1.0) {
            progress = 1.0;
            const behavior = this.getEndBehaviorFromString(this.props.rotateEndBehavior);
            switch (behavior) {
                case 1:
                    this.entity.rotation.set(this.startRotation);
                    this.rotateHasFinished = true;
                    break;
                case 2:
                    this.entity.rotation.set(this.startRotation);
                    this.rotateElapsedTime = 0;
                    progress = 0;
                    break;
                case 3:
                    [this.startRotation, this.targetRotation] = [this.targetRotation, this.startRotation];
                    this.rotateElapsedTime = 0;
                    progress = 0;
                    break;
                default:
                    this.rotateHasFinished = true;
                    break;
            }
        }
        const easing = this.getEasingTypeFromString(this.props.rotateEasingType);
        const easedProgress = this.getEasedProgress(progress, easing);
        const currentRotation = hz.Quaternion.slerp(this.startRotation, this.targetRotation, easedProgress);
        if (this.props.useLocalSpace) {
            this.entity.transform.localRotation.set(currentRotation);
        }
        else {
            this.entity.rotation.set(currentRotation);
        }
    }
    updateScale(deltaTime) {
        this.scaleElapsedTime += deltaTime;
        let progress = Math.min(this.scaleElapsedTime / this.props.scaleDuration, 1.0);
        if (progress >= 1.0) {
            progress = 1.0;
            const behavior = this.getEndBehaviorFromString(this.props.scaleEndBehavior);
            switch (behavior) {
                case 1:
                    this.entity.scale.set(this.startScale);
                    this.scaleHasFinished = true;
                    break;
                case 2:
                    this.entity.scale.set(this.startScale);
                    this.scaleElapsedTime = 0;
                    progress = 0;
                    break;
                case 3:
                    [this.startScale, this.targetScaleValue] = [this.targetScaleValue, this.startScale];
                    this.scaleElapsedTime = 0;
                    progress = 0;
                    break;
                default:
                    this.scaleHasFinished = true;
                    break;
            }
        }
        const easing = this.getEasingTypeFromString(this.props.scaleEasingType);
        const easedProgress = this.getEasedProgress(progress, easing);
        const currentScale = hz.Vec3.lerp(this.startScale, this.targetScaleValue, easedProgress);
        if (this.props.useLocalSpace) {
            this.entity.transform.localScale.set(currentScale);
        }
        else {
            this.entity.scale.set(currentScale);
        }
    }
    // --- STRING CONVERSION HELPERS ---
    getActivationModeFromString(mode) {
        const lowerCaseMode = mode.toLowerCase().trim();
        switch (lowerCaseMode) {
            case "on trigger": return 1;
            case "on grab": return 2;
            case "start on load":
            default: return 0;
        }
    }
    getEndBehaviorFromString(behavior) {
        const lowerCaseBehavior = behavior.toLowerCase().trim();
        switch (lowerCaseBehavior) {
            case "reset": return 1;
            case "loop": return 2;
            case "ping-pong":
            case "pingpong":
            case "ping pong": return 3;
            case "stop":
            default: return 0;
        }
    }
    getEasingTypeFromString(easing) {
        const lowerCaseEasing = easing.toLowerCase().trim();
        switch (lowerCaseEasing) {
            case "bounce": return 1;
            case "linear": return 2;
            case "ease":
            default: return 0;
        }
    }
    // --- HELPER & EASING FUNCTIONS ---
    getEasedProgress(progress, type) {
        switch (type) {
            case 1: return this.easeOutBounce(progress);
            case 2: return this.linear(progress);
            default: return this.easeInOut(progress);
        }
    }
    easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    linear(t) { return t; }
    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        }
        else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        }
        else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        }
        else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
}
// -- PROPERTIES --
MoveRotateAndScale.propsDefinition = {
    // --- Activation & Space Controls ---
    activationMode: { type: hz.PropTypes.String, default: "Start on Load" }, // "Start on Load", "On Trigger", "On Grab"
    triggerEntity: { type: hz.PropTypes.Entity },
    resetOnTrigger: { type: hz.PropTypes.Boolean, default: true },
    useLocalSpace: { type: hz.PropTypes.Boolean, default: false }, // false = World Space, true = Local Space
    // --- Move Controls ---
    enableMove: { type: hz.PropTypes.Boolean, default: false },
    moveOffset: { type: hz.PropTypes.Vec3, default: new hz.Vec3(0, 1, 0) },
    moveDuration: { type: hz.PropTypes.Number, default: 2.0 },
    moveEndBehavior: { type: hz.PropTypes.String, default: "Stop" }, // "Stop", "Reset", "Loop", "Ping-Pong"
    moveEasingType: { type: hz.PropTypes.String, default: "Ease" }, // "Ease", "Bounce", "Linear"
    // --- Rotate Controls ---
    enableRotate: { type: hz.PropTypes.Boolean, default: false },
    rotateOffset: { type: hz.PropTypes.Vec3, default: new hz.Vec3(0, 90, 0) },
    rotateDuration: { type: hz.PropTypes.Number, default: 2.0 },
    rotateEndBehavior: { type: hz.PropTypes.String, default: "Stop" },
    rotateEasingType: { type: hz.PropTypes.String, default: "Ease" },
    // --- Scale Controls ---
    enableScale: { type: hz.PropTypes.Boolean, default: false },
    targetScale: { type: hz.PropTypes.Vec3, default: new hz.Vec3(2, 2, 2) },
    scaleDuration: { type: hz.PropTypes.Number, default: 2.0 },
    scaleEndBehavior: { type: hz.PropTypes.String, default: "Stop" },
    scaleEasingType: { type: hz.PropTypes.String, default: "Ease" },
};
// Registers the component, making it available to use in the Horizon editor.
hz.Component.register(MoveRotateAndScale);
