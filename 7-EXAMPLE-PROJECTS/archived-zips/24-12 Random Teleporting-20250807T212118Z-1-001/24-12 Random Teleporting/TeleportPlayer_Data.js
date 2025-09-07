"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teleportPlayer_Data = void 0;
const core_1 = require("horizon/core");
let ray;
let navMesh;
const players = [];
const spawnPoints = [];
exports.teleportPlayer_Data = {
    ray,
    center: new core_1.Vec3(0, 50, 0),
    radius: 32,
    yRadius: 0,
    players,
    checkDirections: [
        new core_1.Vec3(1, 0, 0),
        new core_1.Vec3(-1, 0, 0),
        new core_1.Vec3(0, 0, 1),
        new core_1.Vec3(0, 0, -1),
        new core_1.Vec3(0.707, 0, 0.707),
        new core_1.Vec3(-0.707, 0, -0.707),
        new core_1.Vec3(-0.707, 0, 0.707),
        new core_1.Vec3(0.707, 0, -0.707),
    ],
    spawnPoints,
    useNavMesh: false,
    navMesh,
};
