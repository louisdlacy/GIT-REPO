import * as hz from 'horizon/core';
import { BaseLogger, LogLevel } from 'BaseLogger';
/**
 * Base class for components that provides common functionality, lifecycle hooks, and timer-based functions.
 */
export declare abstract class BaseComponent<T> extends BaseLogger<typeof BaseComponent & T> {
    static propsDefinition: {};
    updateEvent?: hz.EventSubscription;
    /**
     * Called before start. Adds the component's class name as a tag to the entity.
     * This makes it easier to find entities with specific components using getEntitiesWithTags.
     */
    preStart(): void;
    start(): void;
    /**
     * Enables or disables the update event.
     * @param enable - A boolean indicating whether to enable or disable the update event.
     */
    enableUpdate(enable: boolean): void;
    /**
     * Update method to be overridden by subclasses.
     * @param deltaTime - The time elapsed since the last update.
     */
    update(deltaTime: number): void;
    /**
     * Get a component from an entity and verify it exists.
     * This will get the first component of the type, if there are multiple others will be ignored.
     * @param entity - The entity to get the component from.
     * @param type - The type of the component to retrieve.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The component if it exists, otherwise undefined.
     */
    getAndVerifyComponent<T extends hz.Component>(entity: hz.Entity | undefined, type: new () => T, logLevel?: LogLevel): T | undefined;
    /**
     * Get components from an entity and verify they exist.
     * This will get all components of the type.
     * @param entity - The entity to get the components from.
     * @param type - The type of the components to retrieve.
     * @param logLevel - The log level to use if no components are found.
     * @returns An array of components if they exist, otherwise an empty array.
     */
    getAndVerifyComponents<T extends hz.Component>(entity: hz.Entity | undefined, type: new () => T, logLevel?: LogLevel): T[];
    /**
     * Check an entity for validity and return it if it is valid.
     * Otherwise, log an error and return undefined.
     * @param entity - The entity to check for validity.
     * @returns The entity if valid, otherwise undefined.
     */
    getAndVerifyEntity(entity: hz.Entity | undefined): hz.Entity | undefined;
    /**
     * Finds all entities that have a component of the specified type.
     * This uses the automatic tagging system that adds the component's class name as a tag to the entity.
     * @param componentType - The component type to search for (must be a constructor for a class that extends BaseComponent)
     * @returns An array of entities that have the specified component type
     */
    findAllEntitiesWithComponent<C extends new (...args: any[]) => BaseComponent<any>>(componentType: C): hz.Entity[];
    /**
     * Finds all component instances of the specified type across all entities.
     * This leverages findAllEntitiesWithComponent underneath to locate entities with the component.
     * @param componentType - The component type to search for (must be a constructor for a class that extends BaseComponent)
     * @returns An array of component instances of the specified type
     */
    findAllComponents<C extends new (...args: any[]) => BaseComponent<any>>(componentType: C): InstanceType<C>[];
    /**
     * Get a search for a component from an entity recursively up the hierarchy until it is found or the top is reached
     * This will get the first component of the type, if there are multiple others will be ignored.
     * @param entity - The entity to get the component from.
     * @param type - The type of the component to retrieve.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The component if it exists, otherwise undefined.
     */
    getAndVerifyComponentToParent<T extends hz.Component>(entity: hz.Entity | undefined | null, type: new () => T, logLevel?: LogLevel): T | undefined;
    /**
     * Helper method that traverses an entity hierarchy in a breadth-first manner.
     * @param entity - The entity to start the traversal from.
     * @param processEntity - A callback function that processes each entity in the hierarchy.
     *                        Return true to stop traversal, false to continue.
     */
    private _traverseEntityHierarchy;
    /**
     * Recursively searches all children of an entity in a breadth-first manner to find a component of the given type.
     * @param entity - The entity to start the search from.
     * @param type - The type of component to search for.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The first matching component if found, otherwise undefined.
     */
    findComponentInChildren<T extends hz.Component>(entity: hz.Entity | undefined | null, type: new () => T, logLevel?: LogLevel): T | undefined;
    /**
     * Recursively searches all children of an entity in a breadth-first manner to find all components of the given type.
     * @param entity - The entity to start the search from.
     * @param type - The type of component to search for.
     * @returns An array of all matching components found, or an empty array if none are found.
     */
    findComponentsInChildren<T extends hz.Component>(entity: hz.Entity | undefined | null, type: new () => T): T[];
    timeouts: Map<string, number>;
    /**
     * Starts an interval that executes as a repeating timeout with decreasing time remaining.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param intervalTime - The time interval for the execution.
     * @param maxTime - The maximum time for the interval.
     * @param options - Options for the async operation.
     * @returns The interval ID.
     */
    startInterval(id: string, intervalTime: number | {
        min: number;
        max: number;
    }, maxTime: number, options: asyncOptions): number;
    /**
     * Starts a timeout that executes a function after a specified time.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param onEnd - The function to execute when the timeout ends.
     * @param timeoutTime - The time after which the function should execute.
     * @param restartIfAlreadyActive - Whether to restart the timeout if it is already active.
     * @returns The timeout ID.
     */
    startTimeout(id: string, onEnd: () => void, timeoutTime: number | {
        min: number;
        max: number;
    }, restartIfAlreadyActive?: boolean): number;
    /**
     * Starts an asynchronous operation with a timeout.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param options - Options for the async operation.
     * @param timeoutTime - The time after which the operation should execute.
     * @param timeRemaining - The remaining time for the operation.
     * @returns The timeout ID.
     */
    startAsync(id: string, options: asyncOptions, timeoutTime: number | {
        min: number;
        max: number;
    }, timeRemaining?: number | null): number;
    /**
     * Stops an interval with the given ID.
     * @param id - The ID of the interval to stop.
     */
    stopInterval(id: string): void;
    /**
     * Stops a timeout with the given ID.
     * @param id - The ID of the timeout to stop.
     */
    stopTimeout(id: string): void;
    /**
     * Stops all intervals and timeouts running on this component.
     */
    stopAllAsyncFuncs(): void;
}
interface asyncOptions {
    onInterval?: (timeRemaining: number) => void;
    checkToEnd?: () => boolean;
    onEnd?: (endedByCondition: boolean) => void;
    restartIfAlreadyActive?: boolean;
}
export {};
