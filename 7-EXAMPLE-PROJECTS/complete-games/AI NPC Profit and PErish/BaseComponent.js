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
exports.BaseComponent = void 0;
const hz = __importStar(require("horizon/core"));
const MU = __importStar(require("MathUtils"));
const GC = __importStar(require("GameConsts"));
const BaseLogger_1 = require("BaseLogger");
/**
 * Base class for components that provides common functionality, lifecycle hooks, and timer-based functions.
 */
class BaseComponent extends BaseLogger_1.BaseLogger {
    constructor() {
        super(...arguments);
        //#endregion
        //#region Async
        this.timeouts = new Map();
        //#endregion
    }
    //#region Lifecycle
    /**
     * Called before start. Adds the component's class name as a tag to the entity.
     * This makes it easier to find entities with specific components using getEntitiesWithTags.
     */
    preStart() {
        // Add the component's class name as a tag to the entity
        const componentName = this.constructor.name;
        this.entity.tags.add(componentName);
    }
    start() {
        this.enableUpdate(false);
    }
    /**
     * Enables or disables the update event.
     * @param enable - A boolean indicating whether to enable or disable the update event.
     */
    enableUpdate(enable) {
        if (enable) {
            if (!this.updateEvent) {
                this.updateEvent = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
                    this.update(data.deltaTime);
                });
            }
        }
        else {
            this.updateEvent?.disconnect();
            this.updateEvent = undefined;
        }
    }
    /**
     * Update method to be overridden by subclasses.
     * @param deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
    }
    //#endregion
    //#region Finding Components
    /**
     * Get a component from an entity and verify it exists.
     * This will get the first component of the type, if there are multiple others will be ignored.
     * @param entity - The entity to get the component from.
     * @param type - The type of the component to retrieve.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The component if it exists, otherwise undefined.
     */
    getAndVerifyComponent(entity, type, logLevel = BaseLogger_1.LogLevel.Error) {
        const component = entity?.getComponents(type)[0] ?? undefined;
        if (!component) {
            this.log(`Component not found on item: ${entity?.name.get()} for ${this.entity.name.get()}`, true, logLevel);
        }
        return component;
    }
    /**
     * Get components from an entity and verify they exist.
     * This will get all components of the type.
     * @param entity - The entity to get the components from.
     * @param type - The type of the components to retrieve.
     * @param logLevel - The log level to use if no components are found.
     * @returns An array of components if they exist, otherwise an empty array.
     */
    getAndVerifyComponents(entity, type, logLevel = BaseLogger_1.LogLevel.Error) {
        const components = entity?.getComponents(type) || [];
        return components;
    }
    /**
     * Check an entity for validity and return it if it is valid.
     * Otherwise, log an error and return undefined.
     * @param entity - The entity to check for validity.
     * @returns The entity if valid, otherwise undefined.
     */
    getAndVerifyEntity(entity) {
        if (!entity) {
            this.log(`Entity not valid ${this.entity.name.get()}`, true, BaseLogger_1.LogLevel.Error);
            return undefined;
        }
        return entity;
    }
    /**
     * Finds all entities that have a component of the specified type.
     * This uses the automatic tagging system that adds the component's class name as a tag to the entity.
     * @param componentType - The component type to search for (must be a constructor for a class that extends BaseComponent)
     * @returns An array of entities that have the specified component type
     */
    findAllEntitiesWithComponent(componentType) {
        const componentName = componentType.name;
        return this.world.getEntitiesWithTags([componentName]);
    }
    /**
     * Finds all component instances of the specified type across all entities.
     * This leverages findAllEntitiesWithComponent underneath to locate entities with the component.
     * @param componentType - The component type to search for (must be a constructor for a class that extends BaseComponent)
     * @returns An array of component instances of the specified type
     */
    findAllComponents(componentType) {
        const entities = this.findAllEntitiesWithComponent(componentType);
        const components = [];
        for (const entity of entities) {
            // Get all components of this entity and find the one that matches our component type name
            const allComponents = entity.getComponents();
            for (const component of allComponents) {
                if (component.constructor.name === componentType.name) {
                    components.push(component);
                    break;
                }
            }
        }
        return components;
    }
    /**
     * Get a search for a component from an entity recursively up the hierarchy until it is found or the top is reached
     * This will get the first component of the type, if there are multiple others will be ignored.
     * @param entity - The entity to get the component from.
     * @param type - The type of the component to retrieve.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The component if it exists, otherwise undefined.
     */
    getAndVerifyComponentToParent(entity, type, logLevel = BaseLogger_1.LogLevel.Error) {
        let component = entity?.getComponents(type)[0] ?? undefined;
        if (!component) {
            if (this.entity.parent == undefined || this.entity.parent == null) {
                this.log(`Component not found in parent chain of: ${entity?.name.get()} for ${this.entity.name.get()}`, true, logLevel);
                return undefined;
            }
            return this.getAndVerifyComponentToParent(this.entity.parent.get(), type, logLevel);
        }
        return component;
    }
    /**
     * Helper method that traverses an entity hierarchy in a breadth-first manner.
     * @param entity - The entity to start the traversal from.
     * @param processEntity - A callback function that processes each entity in the hierarchy.
     *                        Return true to stop traversal, false to continue.
     */
    _traverseEntityHierarchy(entity, processEntity) {
        if (!entity)
            return;
        // Check the starting entity first
        if (processEntity(entity))
            return;
        // Initialize queue for breadth-first search
        const queue = [];
        // Add all immediate children to the queue
        const children = entity.children.get();
        for (const child of children) {
            queue.push(child);
        }
        // Process the queue
        while (queue.length > 0) {
            const currentEntity = queue.shift();
            // Process the current entity
            if (processEntity(currentEntity))
                return;
            // Add all children of the current entity to the queue
            const currentChildren = currentEntity.children.get();
            for (const child of currentChildren) {
                queue.push(child);
            }
        }
    }
    /**
     * Recursively searches all children of an entity in a breadth-first manner to find a component of the given type.
     * @param entity - The entity to start the search from.
     * @param type - The type of component to search for.
     * @param logLevel - The log level to use if the component is not found.
     * @returns The first matching component if found, otherwise undefined.
     */
    findComponentInChildren(entity, type, logLevel = BaseLogger_1.LogLevel.Warn) {
        if (!entity)
            return undefined;
        let foundComponent = undefined;
        this._traverseEntityHierarchy(entity, (currentEntity) => {
            const component = currentEntity.getComponents(type)[0];
            if (component) {
                foundComponent = component;
                return true; // Stop traversal once we find a component
            }
            return false; // Continue traversal
        });
        // If we get here and no component was found, log an error
        if (!foundComponent) {
            this.log(`Component ${type.name} not found in children of entity: ${entity.name.get()}`, true, logLevel);
        }
        return foundComponent;
    }
    /**
     * Recursively searches all children of an entity in a breadth-first manner to find all components of the given type.
     * @param entity - The entity to start the search from.
     * @param type - The type of component to search for.
     * @returns An array of all matching components found, or an empty array if none are found.
     */
    findComponentsInChildren(entity, type) {
        const results = [];
        if (!entity)
            return results;
        this._traverseEntityHierarchy(entity, (currentEntity) => {
            const components = currentEntity.getComponents(type);
            results.push(...components);
            return false; // Always continue traversal to find all components
        });
        return results;
    }
    /**
     * Starts an interval that executes as a repeating timeout with decreasing time remaining.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param intervalTime - The time interval for the execution.
     * @param maxTime - The maximum time for the interval.
     * @param options - Options for the async operation.
     * @returns The interval ID.
     */
    startInterval(id, intervalTime, maxTime, options) {
        let interval = this.startAsync(id, options, intervalTime, maxTime);
        return interval;
    }
    /**
     * Starts a timeout that executes a function after a specified time.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param onEnd - The function to execute when the timeout ends.
     * @param timeoutTime - The time after which the function should execute.
     * @param restartIfAlreadyActive - Whether to restart the timeout if it is already active.
     * @returns The timeout ID.
     */
    startTimeout(id, onEnd, timeoutTime, restartIfAlreadyActive = false) {
        let timeout = this.startAsync(id, {
            onEnd: onEnd,
            restartIfAlreadyActive: restartIfAlreadyActive,
        }, timeoutTime);
        return timeout;
    }
    /**
     * Starts an asynchronous operation with a timeout.
     * @param id - Unique ID for duplication detection, removal, etc.
     * @param options - Options for the async operation.
     * @param timeoutTime - The time after which the operation should execute.
     * @param timeRemaining - The remaining time for the operation.
     * @returns The timeout ID.
     */
    startAsync(id, options, timeoutTime, timeRemaining = null) {
        if (this.timeouts.has(id)) {
            // If we're already running with this timeout ID, don't run another
            this.log(`Async ${id} already running, stopping and restarting`, GC.CONSOLE_LOG_ASYNC);
            if (options.restartIfAlreadyActive) {
                // If opting to restart, then restart
                this.stopTimeout(id);
            }
            else {
                // Otherwise, don't run another
                return 0;
            }
        }
        // Resolve interval time if it's a random range
        let t = (typeof timeoutTime === 'object') ? MU.RandomInt(timeoutTime.min, timeoutTime.max) : timeoutTime;
        // Check the numbers look right (i.e. not confused with MS)
        if (t >= 1000) {
            this.log(`Very long time provided for async ${id}, check that's in MS!`, true, BaseLogger_1.LogLevel.Warn);
        }
        let timeout = this.async.setTimeout(() => {
            this.stopTimeout(id);
            let prevTimeRemaining = timeRemaining != null ? timeRemaining : null;
            timeRemaining = timeRemaining != null ? timeRemaining -= t : null;
            // If an interval is provided, execute it
            if (options.onInterval && timeRemaining != null) {
                options.onInterval(timeRemaining);
            }
            // Check if the timeout has ended, or if it's an interval and the end condition is met or time remaining has run out
            let endedByCondition = options.checkToEnd != undefined && options.checkToEnd && options.checkToEnd();
            if (timeRemaining == null || endedByCondition || (timeRemaining <= 0 && prevTimeRemaining > 0)) {
                // Execute any callback on the timeout ending, if provided
                if (options.onEnd) {
                    options.onEnd(endedByCondition);
                }
            }
            else {
                // If not ended yet, this is an interval, so restart timeout with remaining time
                this.startAsync(id, options, timeoutTime, timeRemaining);
            }
        }, t * 1000); // Convert to ms
        this.timeouts.set(id, timeout);
        return timeout;
    }
    /**
     * Stops an interval with the given ID.
     * @param id - The ID of the interval to stop.
     */
    stopInterval(id) {
        this.stopTimeout(id);
    }
    /**
     * Stops a timeout with the given ID.
     * @param id - The ID of the timeout to stop.
     */
    stopTimeout(id) {
        let timeout = this.timeouts.get(id);
        if (timeout) {
            this.async.clearInterval(timeout);
            this.timeouts.delete(id);
        }
    }
    /**
     * Stops all intervals and timeouts running on this component.
     */
    stopAllAsyncFuncs() {
        this.timeouts.forEach((value, key) => {
            this.stopTimeout(key);
        });
    }
}
exports.BaseComponent = BaseComponent;
BaseComponent.propsDefinition = {};
