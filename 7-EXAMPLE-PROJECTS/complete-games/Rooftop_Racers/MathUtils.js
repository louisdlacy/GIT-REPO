"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rad2Deg = exports.Deg2Rad = void 0;
exports.acuteAngleBetweenVecs = acuteAngleBetweenVecs;
exports.getClockwiseAngle = getClockwiseAngle;
exports.getForward = getForward;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Contains helper classes for advanced Math functions
 */
const core_1 = require("horizon/core");
exports.Deg2Rad = Math.PI / 180; //mutiply by this to convert degrees to radians
exports.Rad2Deg = 180 / Math.PI; //mutiply by this to convert radians to degrees
function acuteAngleBetweenVecs(v1, v2) {
    return Math.acos(v1.dot(v2));
}
function getClockwiseAngle(v1, v2) {
    let dot = v1.x * v2.x + v1.z * v2.z; // dot product
    let det = v1.x * v2.z - v1.z * v2.x; // determinant
    let angle = Math.atan2(det, dot); // atan2(y, x) or atan2(sin, cos)
    // atan2 returns counterclockwise angles from -180 to 180,
    // so convert to clockwise and make sure it's from 0 to 360
    angle = (-angle + (2 * Math.PI)) % (2 * Math.PI);
    return angle;
}
function getForward(rotation) {
    return core_1.Quaternion.mulVec3(rotation, core_1.Vec3.forward).normalize();
}
