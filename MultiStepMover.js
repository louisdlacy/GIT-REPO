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
 * Moves an entity sequentially along a path of fixed waypoints.
 * Now includes an optional "Look At" target.
 */
class MultiStepMover extends hz.Component {
    constructor() {
        super(...arguments);
        // -- STATE VARIABLES --
        this.waypoints = [];
        this.currentWaypointIndex = 0;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.pauseTimer = 0;
        this.isReversing = false;
        this.hasFinished = false;
    }
    start() {
        for (let i = 1; i <= 8; i++) {
            const propName = `waypoint${i}`;
            if (this.props[propName]) {
                this.waypoints.push(this.props[propName]);
            }
        }
        if (this.waypoints.length === 0) {
            this.hasFinished = true;
            return;
        }
        this.originalStartPosition = this.entity.position.get();
        this.originalStartRotation = this.entity.rotation.get();
        this.startPosition = this.entity.position.get();
        this.targetPosition = this.waypoints[0].position.get();
        this.startRotation = this.entity.rotation.get();
        this.targetRotation = this.waypoints[0].rotation.get();
        this.currentWaypointIndex = 0;
        this.connectLocalBroadcastEvent(hz.World.onUpdate, this.onUpdate.bind(this));
    }
    onUpdate(data) {
        if (this.hasFinished)
            return;
        if (this.isPaused) {
            this.pauseTimer += data.deltaTime;
            if (this.pauseTimer >= this.props.pauseAtWaypoints) {
                this.isPaused = false;
                this.moveToNextWaypoint();
            }
            return;
        }
        this.elapsedTime += data.deltaTime;
        let progress = this.elapsedTime / this.props.durationPerSegment;
        if (progress >= 1.0) {
            progress = 1.0;
            this.isPaused = true;
            this.pauseTimer = 0;
        }
        const easing = this.getEasingTypeFromString(this.props.easingType);
        const easedProgress = this.getEasedProgress(progress, easing);
        const currentPosition = hz.Vec3.lerp(this.startPosition, this.targetPosition, easedProgress);
        this.entity.position.set(currentPosition);
        if (this.props.lookAtTarget) {
            const targetPosition = this.props.lookAtTarget.position.get();
            this.entity.lookAt(targetPosition);
        }
        else if (this.props.matchWaypointRotation) {
            const currentRotation = hz.Quaternion.slerp(this.startRotation, this.targetRotation, easedProgress);
            this.entity.rotation.set(currentRotation);
        }
    }
    moveToNextWaypoint() {
        if (this.isReversing) {
            this.currentWaypointIndex--;
        }
        else {
            this.currentWaypointIndex++;
        }
        const hasReachedEnd = this.currentWaypointIndex >= this.waypoints.length;
        const hasReachedBeginning = this.currentWaypointIndex < 0;
        if (hasReachedEnd) {
            const behavior = this.getEndBehaviorFromString(this.props.endBehavior);
            switch (behavior) {
                case 1:
                    this.entity.position.set(this.originalStartPosition);
                    if (this.props.matchWaypointRotation)
                        this.entity.rotation.set(this.originalStartRotation);
                    this.hasFinished = true;
                    return;
                case 2:
                    this.currentWaypointIndex = 0;
                    break;
                case 3:
                    this.isReversing = true;
                    this.currentWaypointIndex = this.waypoints.length - 2;
                    break;
                default:
                    this.hasFinished = true;
                    return;
            }
        }
        else if (hasReachedBeginning) {
            this.isReversing = false;
            this.currentWaypointIndex = 1;
        }
        this.startPosition = this.entity.position.get();
        this.targetPosition = this.waypoints[this.currentWaypointIndex].position.get();
        if (this.props.matchWaypointRotation) {
            this.startRotation = this.entity.rotation.get();
            this.targetRotation = this.waypoints[this.currentWaypointIndex].rotation.get();
        }
        this.elapsedTime = 0;
    }
    // --- STRING CONVERSION & HELPER FUNCTIONS ---
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
MultiStepMover.propsDefinition = {
    waypoint1: { type: hz.PropTypes.Entity },
    waypoint2: { type: hz.PropTypes.Entity },
    waypoint3: { type: hz.PropTypes.Entity },
    waypoint4: { type: hz.PropTypes.Entity },
    waypoint5: { type: hz.PropTypes.Entity },
    waypoint6: { type: hz.PropTypes.Entity },
    waypoint7: { type: hz.PropTypes.Entity },
    waypoint8: { type: hz.PropTypes.Entity },
    durationPerSegment: { type: hz.PropTypes.Number, default: 3.0 },
    pauseAtWaypoints: { type: hz.PropTypes.Number, default: 1.0 },
    matchWaypointRotation: { type: hz.PropTypes.Boolean, default: true },
    lookAtTarget: { type: hz.PropTypes.Entity },
    endBehavior: { type: hz.PropTypes.String, default: "Stop" },
    easingType: { type: hz.PropTypes.String, default: "Ease" },
};
hz.Component.register(MultiStepMover);
