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
exports.BaseNavigationComponent = void 0;
const hz = __importStar(require("horizon/core"));
const navmesh_1 = require("horizon/navmesh");
const Events_1 = require("Events");
const BaseComponent_1 = require("./BaseComponent");
const INTERVAL_NAVIGATE_TO_TARGET = "interval_navigate_to_target";
const REACH_DISTANCE = 3;
/**
 * BaseNavigationComponent provides navigation functionalities for entities using a NavMeshAgent.
 * It also handles events for stopping and resuming navigation and provides a mechanism
 * to navigate to a target with specified navigation specifications.
 */
class BaseNavigationComponent extends BaseComponent_1.BaseComponent {
    constructor() {
        super(...arguments);
        this._enabled = true;
        this._destination = hz.Vec3.zero;
        this._navMeshAgent = null;
        this._alignmentMode = navmesh_1.NavMeshAgentAlignment.CurrentVelocity;
        this._canMove = true;
        this._stoppingDistance = 5;
        this._onTargetTime = 0;
    }
    start() {
        super.start();
        this.connectLocalEvent(this.entity, Events_1.Events.stopNavigation, () => {
            this.stopNavigation();
        });
        this.connectLocalEvent(this.entity, Events_1.Events.resumeNavigation, () => {
            this.resumeNavigation();
        });
        this._navMeshAgent = this.entity.as(navmesh_1.NavMeshAgent);
        if (!this._navMeshAgent) {
            throw new Error(`NAVMESH: No NavMeshAgent found on ${this.entity.name.get()}`);
        }
    }
    /**
     * Disables navigation
     */
    disableNavigation() {
        this.stopNavigation();
        this._enabled = false;
    }
    /**
     * Enables navigation via the flag.
     */
    enableNavigation() {
        this._enabled = true;
    }
    /**
     * Placeholder method to resume navigation, to be implemented by child classes.
     */
    resumeNavigation() {
        // To be implemented by child classes
    }
    /**
     * Stops navigation by setting the NavMeshAgent to immobile and stopping the navigation interval.
     */
    stopNavigation() {
        this._navMeshAgent.isImmobile.set(true);
        this.stopInterval(INTERVAL_NAVIGATE_TO_TARGET);
    }
    /**
     * Checks if the component can move based on internal flags.
     * @returns {boolean} True if the component can move, false otherwise.
     */
    canMove() {
        return this._canMove && this._enabled;
    }
    /**
     * Sets the ability to move and updates the NavMeshAgent's immobility status.
     * @param {boolean} value - The new movement capability status.
     */
    setCanMove(value) {
        if (this._canMove != value) {
            this._canMove = value;
            this._navMeshAgent.isImmobile.set(!value);
        }
    }
    /**
     * Sets the alignment mode of the NavMeshAgent.
     * @param {NavMeshAgentAlignment} value - The new alignment mode.
     */
    setAlignmentMode(value) {
        if (this._alignmentMode !== value) {
            this._navMeshAgent.alignmentMode.set(value);
            this._alignmentMode = value;
        }
    }
    /**
     * Sets the speed of the NavMeshAgent.
     * @param {number} value - The new speed value.
     */
    setSpeed(value) {
        this._navMeshAgent.maxSpeed.set(value);
    }
    /**
     * Sets the stopping distance for the NavMeshAgent.
     * @param {number} value - The new stopping distance.
     */
    setStoppingDistance(value) {
        if (this._stoppingDistance != value) {
            this._navMeshAgent.stoppingDistance.set(value);
            this._stoppingDistance = value;
        }
    }
    /**
     * Gets the current position of the entity.
     * @returns {hz.Vec3} The current position.
     */
    getPosition() {
        return this.entity.position.get();
    }
    /**
     * Gets the current destination of the navigation component.
     * @returns {hz.Vec3} The current destination.
     */
    getDestination() {
        return this._destination;
    }
    /**
     * Sets a new destination for the NavMeshAgent.
     * @param {hz.Vec3} value - The new destination.
     */
    setDestination(value) {
        if (this._destination != value) {
            this._navMeshAgent?.destination.set(value);
            this._destination = value;
        }
    }
    /**
     * Navigates to a specified position with a given speed and stopping distance.
     * @param {hz.Player | hz.Entity | hz.Vec3} target - The target to navigate to.
     * @param {number} speed - The speed of navigation.
     * @param {number} stoppingDistance - The distance to stop from the target.
     */
    navigateToPosition(target, speed, stoppingDistance = 5) {
        this._navMeshAgent.isImmobile.set(false);
        let targetPosition = this.getPositionFromTarget(target);
        let hasReachedDestination = this.hasReachedDestination();
        let actualSpeed = hasReachedDestination ? 0 : speed;
        let alignment = hasReachedDestination ? navmesh_1.NavMeshAgentAlignment.Destination : navmesh_1.NavMeshAgentAlignment.CurrentVelocity;
        this.setAlignmentMode(alignment);
        this.setSpeed(actualSpeed);
        this.setStoppingDistance(stoppingDistance);
        this.setDestination(targetPosition);
    }
    /**
     * Checks if the destination has been reached.
     * @returns {boolean} True if the destination is reached, false otherwise.
     */
    hasReachedDestination() {
        let hasReachedDestination = this._navMeshAgent.remainingDistance.get() <= REACH_DISTANCE;
        return hasReachedDestination;
    }
    /**
     * Rebakes the NavMesh for the NavMeshAgent.
     */
    rebakeNavMesh() {
        this._navMeshAgent.getNavMesh().then((navMesh) => {
            this.log(`Rebaking NavMesh`);
            navMesh.rebake();
        });
    }
    /**
     * Starts navigation to a target with specified navigation specifications.
     * @param {NavigationSpecs} navigationSpecs - The specifications for navigation.
     * @param {boolean} lockedOnTarget - Whether the navigation is locked on the target.
     */
    navigateToTarget(navigationSpecs, lockedOnTarget = false) {
        let frameSkipped = false; // skip a frame before checking end condition
        this.startInterval(INTERVAL_NAVIGATE_TO_TARGET, navigationSpecs.intervalTime, navigationSpecs.timeout, {
            restartIfAlreadyActive: true,
            onInterval: () => {
                if (this.canMove()) {
                    this.navigateToPosition(navigationSpecs.target, navigationSpecs.speed, navigationSpecs.stoppingDistance);
                }
            },
            checkToEnd: () => {
                if (!this.canMove()) { // Condition for when the NPC can't move
                    return true;
                }
                else if (lockedOnTarget) { // Condition for when the NPC is locked on a target
                    this._onTargetTime += navigationSpecs.intervalTime;
                    return this._onTargetTime >= navigationSpecs.timeout;
                }
                else if (frameSkipped && this.hasReachedDestination()) { // Condition for when NPC is navigation to destination
                    return true;
                }
                else {
                    frameSkipped = true;
                    return false;
                }
            },
            onEnd: () => {
                this._onTargetTime = 0;
                if (navigationSpecs.lockOnTargetTimeout > 0) {
                    // Start a new interval to lock on target
                    navigationSpecs.timeout = navigationSpecs.lockOnTargetTimeout;
                    navigationSpecs.lockOnTargetTimeout = 0;
                    this.navigateToTarget(navigationSpecs, lockedOnTarget = true);
                }
                else {
                    // Call callback function when navigation is complete
                    navigationSpecs.callback?.();
                }
            }
        });
    }
    /**
     * Returns the position from the target, nearly regardless of its type.
     * @param {hz.Player | hz.Entity | hz.Vec3} target - The target to get the position from.
     * @returns {hz.Vec3} The position of the target.
     */
    getPositionFromTarget(target) {
        let targetPosition = hz.Vec3.zero;
        if (target instanceof hz.Vec3) {
            targetPosition = target;
        }
        else if (target instanceof hz.Player) {
            targetPosition = target.position.get();
        }
        else if (target instanceof hz.Entity) {
            targetPosition = target.position.get();
        }
        else {
            throw new Error(`Invalid target type ${typeof target}.`);
        }
        return targetPosition;
    }
}
exports.BaseNavigationComponent = BaseNavigationComponent;
