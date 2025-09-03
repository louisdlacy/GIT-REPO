"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilMotionOverTime_Func_1 = require("UtilMotionOverTime_Func");
const core_1 = require("horizon/core");
let oncePerWorld = true; //This boolean prevents multiple OverTime entities from connecting onUpdate
//Make sure to attach this script to just *ONE* object in the world
class OverTime extends core_1.Component {
    preStart() {
        if (oncePerWorld) {
            oncePerWorld = false;
            this.connectLocalBroadcastEvent(core_1.World.onUpdate, (payload) => { onUpdate(payload.deltaTime); });
        }
    }
    start() {
    }
}
OverTime.propsDefinition = {};
core_1.Component.register(OverTime);
function onUpdate(deltaTime) {
    const curTimeSinceEpoch = Date.now();
    updateScalingEntities(curTimeSinceEpoch);
    updateMovingEntities(curTimeSinceEpoch);
    updateRotatingEntities(curTimeSinceEpoch);
}
function updateScalingEntities(curTimeSinceEpoch) {
    const curScaling = UtilMotionOverTime_Func_1.overTime.scaleTo.getAll();
    const curScalingToRemove = [];
    curScaling.forEach((entityInMotion) => {
        if (entityInMotion.endTime > curTimeSinceEpoch) {
            const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;
            if (entityInMotion.start instanceof core_1.Vec3 && entityInMotion.end instanceof core_1.Vec3) {
                entityInMotion.entity.scale.set(core_1.Vec3.lerp(entityInMotion.start, entityInMotion.end, percentComplete));
            }
        }
        else {
            if (entityInMotion.end instanceof core_1.Vec3) {
                entityInMotion.entity.scale.set(entityInMotion.end);
            }
            curScalingToRemove.push(entityInMotion.entity);
        }
    });
    curScalingToRemove.forEach((entity) => {
        UtilMotionOverTime_Func_1.overTime.scaleTo.cancel(entity);
    });
}
function updateMovingEntities(curTimeSinceEpoch) {
    const curMoving = UtilMotionOverTime_Func_1.overTime.moveTo.getAll();
    const curMovingToRemove = [];
    curMoving.forEach((entityInMotion) => {
        if (entityInMotion.endTime > curTimeSinceEpoch) {
            const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;
            if (entityInMotion.start instanceof core_1.Vec3 && entityInMotion.end instanceof core_1.Vec3) {
                entityInMotion.entity.position.set(core_1.Vec3.lerp(entityInMotion.start, entityInMotion.end, percentComplete));
            }
        }
        else {
            if (entityInMotion.end instanceof core_1.Vec3) {
                entityInMotion.entity.position.set(entityInMotion.end);
            }
            curMovingToRemove.push(entityInMotion.entity);
        }
    });
    curMovingToRemove.forEach((entity) => {
        UtilMotionOverTime_Func_1.overTime.moveTo.cancel(entity);
    });
}
function updateRotatingEntities(curTimeSinceEpoch) {
    const curRotating = UtilMotionOverTime_Func_1.overTime.rotateTo.getAll();
    const curRotatingToRemove = [];
    curRotating.forEach((entityInMotion) => {
        if (entityInMotion.endTime > curTimeSinceEpoch) {
            const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;
            if (entityInMotion.start instanceof core_1.Quaternion && entityInMotion.end instanceof core_1.Quaternion) {
                entityInMotion.entity.rotation.set(core_1.Quaternion.slerp(entityInMotion.start, entityInMotion.end, percentComplete));
            }
        }
        else {
            if (entityInMotion.end instanceof core_1.Quaternion) {
                entityInMotion.entity.rotation.set(entityInMotion.end);
            }
            curRotatingToRemove.push(entityInMotion.entity);
        }
    });
    curRotatingToRemove.forEach((entity) => {
        UtilMotionOverTime_Func_1.overTime.rotateTo.cancel(entity);
    });
}
