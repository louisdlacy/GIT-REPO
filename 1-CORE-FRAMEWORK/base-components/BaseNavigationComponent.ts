import * as hz from 'horizon/core';
import { NavMeshAgent, NavMeshAgentAlignment } from 'horizon/navmesh';
import { Events } from 'Events';
import { BaseComponent } from "./BaseComponent";

const INTERVAL_NAVIGATE_TO_TARGET = "interval_navigate_to_target";
const REACH_DISTANCE = 3;

export type NavigationSpecs = {
    intervalTime: number,
    timeout: number,
    target: hz.Player | hz.Entity | hz.Vec3,
    speed: number,
    stoppingDistance: number,
    lockOnTargetTimeout: number,
    callback?: () => void
}

/**
 * BaseNavigationComponent provides navigation functionalities for entities using a NavMeshAgent.
 * It also handles events for stopping and resuming navigation and provides a mechanism
 * to navigate to a target with specified navigation specifications.
 */
export abstract class BaseNavigationComponent<T> extends BaseComponent<typeof BaseNavigationComponent & T> {
    private _enabled: boolean = true;
    private _destination: hz.Vec3 = hz.Vec3.zero;
    private _navMeshAgent: NavMeshAgent | null = null;
    private _alignmentMode: NavMeshAgentAlignment = NavMeshAgentAlignment.CurrentVelocity;
    private _canMove: boolean = true;
    private _stoppingDistance: number = 5;
    private _onTargetTime: number = 0;

    start() {
        super.start();

        this.connectLocalEvent(this.entity, Events.stopNavigation, () => {
            this.stopNavigation();
        });

        this.connectLocalEvent(this.entity, Events.resumeNavigation, () => {
            this.resumeNavigation();
        });

        this._navMeshAgent = this.entity.as(NavMeshAgent);
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
        this._navMeshAgent!.isImmobile.set(true);
        this.stopInterval(INTERVAL_NAVIGATE_TO_TARGET);
    }

    /**
     * Checks if the component can move based on internal flags.
     * @returns {boolean} True if the component can move, false otherwise.
     */
    protected canMove() {
        return this._canMove && this._enabled;
    }

    /**
     * Sets the ability to move and updates the NavMeshAgent's immobility status.
     * @param {boolean} value - The new movement capability status.
     */
    protected setCanMove(value: boolean) {
        if (this._canMove != value) {
            this._canMove = value;
            this._navMeshAgent!.isImmobile.set(!value);
        }
    }

    /**
     * Sets the alignment mode of the NavMeshAgent.
     * @param {NavMeshAgentAlignment} value - The new alignment mode.
     */
    protected setAlignmentMode(value: NavMeshAgentAlignment) {
        if (this._alignmentMode !== value) {
            this._navMeshAgent!.alignmentMode.set(value);
            this._alignmentMode = value;
        }
    }

    /**
     * Sets the speed of the NavMeshAgent.
     * @param {number} value - The new speed value.
     */
    protected setSpeed(value: number) {
        this._navMeshAgent!.maxSpeed.set(value);
    }

    /**
     * Sets the stopping distance for the NavMeshAgent.
     * @param {number} value - The new stopping distance.
     */
    protected setStoppingDistance(value: number) {
        if (this._stoppingDistance != value) {
            this._navMeshAgent!.stoppingDistance.set(value);
            this._stoppingDistance = value;
        }
    }

    /**
     * Gets the current position of the entity.
     * @returns {hz.Vec3} The current position.
     */
    public getPosition() {
        return this.entity.position.get();
    }

    /**
     * Gets the current destination of the navigation component.
     * @returns {hz.Vec3} The current destination.
     */
    public getDestination() {
        return this._destination;
    }

    /**
     * Sets a new destination for the NavMeshAgent.
     * @param {hz.Vec3} value - The new destination.
     */
    private setDestination(value: hz.Vec3) {
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
    public navigateToPosition(target: hz.Player | hz.Entity | hz.Vec3, speed: number, stoppingDistance: number = 5) {
        this._navMeshAgent!.isImmobile.set(false);
        let targetPosition = this.getPositionFromTarget(target);
        let hasReachedDestination = this.hasReachedDestination();
        let actualSpeed = hasReachedDestination ? 0 : speed;
        let alignment = hasReachedDestination ? NavMeshAgentAlignment.Destination : NavMeshAgentAlignment.CurrentVelocity;
        this.setAlignmentMode(alignment);
        this.setSpeed(actualSpeed);
        this.setStoppingDistance(stoppingDistance);
        this.setDestination(targetPosition);
    }

    /**
     * Checks if the destination has been reached.
     * @returns {boolean} True if the destination is reached, false otherwise.
     */
    protected hasReachedDestination() {
        let hasReachedDestination = this._navMeshAgent!.remainingDistance.get() <= REACH_DISTANCE;
        return hasReachedDestination;
    }

    /**
     * Rebakes the NavMesh for the NavMeshAgent.
     */
    protected rebakeNavMesh() {
        this._navMeshAgent!.getNavMesh().then((navMesh) => {
            this.log(`Rebaking NavMesh`);
            navMesh!.rebake();
        });
    }

    /**
     * Starts navigation to a target with specified navigation specifications.
     * @param {NavigationSpecs} navigationSpecs - The specifications for navigation.
     * @param {boolean} lockedOnTarget - Whether the navigation is locked on the target.
     */
    protected navigateToTarget(navigationSpecs: NavigationSpecs, lockedOnTarget: boolean = false) {
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
                } else if (lockedOnTarget) { // Condition for when the NPC is locked on a target
                    this._onTargetTime += navigationSpecs.intervalTime;
                    return this._onTargetTime >= navigationSpecs.timeout;
                } else if (frameSkipped && this.hasReachedDestination()) { // Condition for when NPC is navigation to destination
                    return true;
                } else {
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
                } else {
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
    protected getPositionFromTarget(target: hz.Player | hz.Entity | hz.Vec3) {
        let targetPosition: hz.Vec3 = hz.Vec3.zero;
        if (target instanceof hz.Vec3) {
            targetPosition = target as hz.Vec3;
        } else if (target instanceof hz.Player) {
            targetPosition = (target as hz.Player).position.get();
        } else if (target instanceof hz.Entity) {
            targetPosition = (target as hz.Entity).position.get();
        } else {
            throw new Error(`Invalid target type ${typeof target}.`);
        }
        return targetPosition;
    }
}
