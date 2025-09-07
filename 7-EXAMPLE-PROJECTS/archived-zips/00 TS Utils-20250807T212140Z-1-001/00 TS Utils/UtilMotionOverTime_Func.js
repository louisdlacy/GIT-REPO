"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overTime = void 0;
let id = 0;
const scalingEntities = [];
const movingEntities = [];
const rotatingEntities = [];
exports.overTime = {
    scaleTo: {
        /**
         * Start a scaling motion on an entity (cancels any previous scaling applied to the entity)
         * @param entity Entity to affect
         * @param scaleTo End scale
         * @param durationMs Time in Ms to reach the scaleTo
         * @returns `number` ID that can be used to cancel this scaleTo
         */
        start: addScalingEntity,
        /**
         * Cancel an object that is currently scaling
         * @param identifier Either the number ID assigned when scaleTo was started, or the entity that is scaling
         */
        cancel: cancelScalingEntity,
        /**
         * @returns an array of all currently scaling `EntityInMotion`
         */
        getAll: getScalingEntities,
    },
    moveTo: {
        /**
         * Start moving an entity (cancels any previous moveTo applied to the entity)
         * @param entity Entity to affect
         * @param moveTo End position
         * @param durationMs Time in Ms to reach the moveTo
         * @returns `number` ID that can be used to cancel this moveTo
         */
        start: addMovingEntity,
        /**
         * Cancel an object that is currently moving
         * @param identifier Either the number ID assigned when moveTo was started, or the entity that is moving
         */
        cancel: cancelMovingEntity,
        /**
         * @returns an array of all currently moving `EntityInMotion`
         */
        getAll: getMovingEntities,
    },
    rotateTo: {
        /**
         * Start rotating an entity (cancels any previous rotation applied to the entity)
         * @param entity Entity to affect
         * @param rotateTo End rotation
         * @param durationMs Time in Ms to reach the rotateTo
         * @returns `number` ID that can be used to cancel this rotateTo
         */
        start: addRotatingEntity,
        /**
         * Cancel an object that is currently rotating
         * @param identifier Either the number ID assigned when rotateTo was started, or the entity that is rotating
         */
        cancel: cancelRotatingEntity,
        /**
         * @returns an array of all currently rotating `EntityInMotion`
         */
        getAll: getRotatingEntities,
    },
};
/* Scale To Over Time */
function getScalingEntities() {
    return scalingEntities;
}
function addScalingEntity(entity, scaleTo, durationMs) {
    cancelScalingEntity(entity);
    id++;
    addEntityInMotionToArray(entity, entity.scale.get(), scaleTo, durationMs, id, scalingEntities);
    return id;
}
function cancelScalingEntity(identifier) {
    cancelFromArray(identifier, scalingEntities);
}
/* Move To Over Time */
function getMovingEntities() {
    return movingEntities;
}
function addMovingEntity(entity, moveTo, durationMs) {
    cancelMovingEntity(entity);
    id++;
    addEntityInMotionToArray(entity, entity.position.get(), moveTo, durationMs, id, movingEntities);
    return id;
}
function cancelMovingEntity(identifier) {
    cancelFromArray(identifier, movingEntities);
}
/* Rotate To Over Time */
function getRotatingEntities() {
    return rotatingEntities;
}
function addRotatingEntity(entity, rotateTo, durationMs) {
    cancelRotatingEntity(entity);
    id++;
    addEntityInMotionToArray(entity, entity.rotation.get(), rotateTo, durationMs, id, rotatingEntities);
    return id;
}
function cancelRotatingEntity(identifier) {
    cancelFromArray(identifier, rotatingEntities);
}
/* Helper Functions */
function cancelFromArray(identifier, array) {
    let cancelIndex = -1;
    array.forEach((entityInMotion, index) => {
        if (entityInMotion.id === identifier || entityInMotion.entity === identifier) {
            cancelIndex = index;
        }
    });
    if (cancelIndex >= 0) {
        array.splice(cancelIndex, 1);
    }
}
function addEntityInMotionToArray(entity, start, end, durationMs, id, array) {
    const curTimeSinceEpoch = Date.now();
    const entityInMotion = {
        entity: entity,
        startTime: curTimeSinceEpoch,
        endTime: curTimeSinceEpoch + durationMs,
        durationMs: durationMs,
        start: start.clone(),
        end: end.clone(),
        id: id,
    };
    array.push(entityInMotion);
}
