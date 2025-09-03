import * as hz from 'horizon/core';
import { NavMeshAgentAlignment } from 'horizon/navmesh';
import { BaseComponent } from "./BaseComponent";
export type NavigationSpecs = {
    intervalTime: number;
    timeout: number;
    target: hz.Player | hz.Entity | hz.Vec3;
    speed: number;
    stoppingDistance: number;
    lockOnTargetTimeout: number;
    callback?: () => void;
};
/**
 * BaseNavigationComponent provides navigation functionalities for entities using a NavMeshAgent.
 * It also handles events for stopping and resuming navigation and provides a mechanism
 * to navigate to a target with specified navigation specifications.
 */
export declare abstract class BaseNavigationComponent<T> extends BaseComponent<typeof BaseNavigationComponent & T> {
    private _enabled;
    private _destination;
    private _navMeshAgent;
    private _alignmentMode;
    private _canMove;
    private _stoppingDistance;
    private _onTargetTime;
    start(): void;
    /**
     * Disables navigation
     */
    disableNavigation(): void;
    /**
     * Enables navigation via the flag.
     */
    enableNavigation(): void;
    /**
     * Placeholder method to resume navigation, to be implemented by child classes.
     */
    resumeNavigation(): void;
    /**
     * Stops navigation by setting the NavMeshAgent to immobile and stopping the navigation interval.
     */
    stopNavigation(): void;
    /**
     * Checks if the component can move based on internal flags.
     * @returns {boolean} True if the component can move, false otherwise.
     */
    protected canMove(): boolean;
    /**
     * Sets the ability to move and updates the NavMeshAgent's immobility status.
     * @param {boolean} value - The new movement capability status.
     */
    protected setCanMove(value: boolean): void;
    /**
     * Sets the alignment mode of the NavMeshAgent.
     * @param {NavMeshAgentAlignment} value - The new alignment mode.
     */
    protected setAlignmentMode(value: NavMeshAgentAlignment): void;
    /**
     * Sets the speed of the NavMeshAgent.
     * @param {number} value - The new speed value.
     */
    protected setSpeed(value: number): void;
    /**
     * Sets the stopping distance for the NavMeshAgent.
     * @param {number} value - The new stopping distance.
     */
    protected setStoppingDistance(value: number): void;
    /**
     * Gets the current position of the entity.
     * @returns {hz.Vec3} The current position.
     */
    getPosition(): any;
    /**
     * Gets the current destination of the navigation component.
     * @returns {hz.Vec3} The current destination.
     */
    getDestination(): hz.Vec3;
    /**
     * Sets a new destination for the NavMeshAgent.
     * @param {hz.Vec3} value - The new destination.
     */
    private setDestination;
    /**
     * Navigates to a specified position with a given speed and stopping distance.
     * @param {hz.Player | hz.Entity | hz.Vec3} target - The target to navigate to.
     * @param {number} speed - The speed of navigation.
     * @param {number} stoppingDistance - The distance to stop from the target.
     */
    navigateToPosition(target: hz.Player | hz.Entity | hz.Vec3, speed: number, stoppingDistance?: number): void;
    /**
     * Checks if the destination has been reached.
     * @returns {boolean} True if the destination is reached, false otherwise.
     */
    protected hasReachedDestination(): boolean;
    /**
     * Rebakes the NavMesh for the NavMeshAgent.
     */
    protected rebakeNavMesh(): void;
    /**
     * Starts navigation to a target with specified navigation specifications.
     * @param {NavigationSpecs} navigationSpecs - The specifications for navigation.
     * @param {boolean} lockedOnTarget - Whether the navigation is locked on the target.
     */
    protected navigateToTarget(navigationSpecs: NavigationSpecs, lockedOnTarget?: boolean): void;
    /**
     * Returns the position from the target, nearly regardless of its type.
     * @param {hz.Player | hz.Entity | hz.Vec3} target - The target to get the position from.
     * @returns {hz.Vec3} The position of the target.
     */
    protected getPositionFromTarget(target: hz.Player | hz.Entity | hz.Vec3): hz.Vec3;
}
