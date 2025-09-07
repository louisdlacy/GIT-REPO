import { BaseNavigationComponent } from 'BaseNavigationComponent';
import * as hz from 'horizon/core';
/**
 * CustomerNavigation class extends BaseNavigationComponent to provide navigation functionality
 * for a customer entity, including properties and methods for navigation speed and event handling.
 */
export declare class CustomerNavigation extends BaseNavigationComponent<typeof CustomerNavigation> {
    static propsDefinition: any;
    /**
     * Initializes the CustomerNavigation component and sets up event listeners.
     */
    start(): void;
    /**
     * Navigates the entity to the specified player.
     *
     * @param player - The player to navigate to.
     */
    navigateToPlayer(player: hz.Player): void;
    /**
     * Resumes navigation from the current position.
     */
    resumeNavigation(): void;
    /**
     * Starts navigation towards the next waypoint.
     */
    startNavigation(): void;
    /**
     * Calculates and returns the next waypoint for navigation.
     *
     * @returns A new Vec3 object representing the next waypoint.
     */
    private getNextWayPoint;
}
