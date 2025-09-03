import { Entity, Quaternion, Vec3 } from "horizon/core";
export declare const overTime: {
    scaleTo: {
        /**
         * Start a scaling motion on an entity (cancels any previous scaling applied to the entity)
         * @param entity Entity to affect
         * @param scaleTo End scale
         * @param durationMs Time in Ms to reach the scaleTo
         * @returns `number` ID that can be used to cancel this scaleTo
         */
        start: typeof addScalingEntity;
        /**
         * Cancel an object that is currently scaling
         * @param identifier Either the number ID assigned when scaleTo was started, or the entity that is scaling
         */
        cancel: typeof cancelScalingEntity;
        /**
         * @returns an array of all currently scaling `EntityInMotion`
         */
        getAll: typeof getScalingEntities;
    };
    moveTo: {
        /**
         * Start moving an entity (cancels any previous moveTo applied to the entity)
         * @param entity Entity to affect
         * @param moveTo End position
         * @param durationMs Time in Ms to reach the moveTo
         * @returns `number` ID that can be used to cancel this moveTo
         */
        start: typeof addMovingEntity;
        /**
         * Cancel an object that is currently moving
         * @param identifier Either the number ID assigned when moveTo was started, or the entity that is moving
         */
        cancel: typeof cancelMovingEntity;
        /**
         * @returns an array of all currently moving `EntityInMotion`
         */
        getAll: typeof getMovingEntities;
    };
    rotateTo: {
        /**
         * Start rotating an entity (cancels any previous rotation applied to the entity)
         * @param entity Entity to affect
         * @param rotateTo End rotation
         * @param durationMs Time in Ms to reach the rotateTo
         * @returns `number` ID that can be used to cancel this rotateTo
         */
        start: typeof addRotatingEntity;
        /**
         * Cancel an object that is currently rotating
         * @param identifier Either the number ID assigned when rotateTo was started, or the entity that is rotating
         */
        cancel: typeof cancelRotatingEntity;
        /**
         * @returns an array of all currently rotating `EntityInMotion`
         */
        getAll: typeof getRotatingEntities;
    };
};
declare function getScalingEntities(): EntityInMotion[];
declare function addScalingEntity(entity: Entity, scaleTo: Vec3, durationMs: number): number;
declare function cancelScalingEntity(identifier: number | Entity): void;
declare function getMovingEntities(): EntityInMotion[];
declare function addMovingEntity(entity: Entity, moveTo: Vec3, durationMs: number): number;
declare function cancelMovingEntity(identifier: number | Entity): void;
declare function getRotatingEntities(): EntityInMotion[];
declare function addRotatingEntity(entity: Entity, rotateTo: Quaternion, durationMs: number): number;
declare function cancelRotatingEntity(identifier: number | Entity): void;
type EntityInMotion = {
    entity: Entity;
    startTime: number;
    endTime: number;
    durationMs: number;
    start: Vec3 | Quaternion;
    end: Vec3 | Quaternion;
    id: number;
};
export {};
