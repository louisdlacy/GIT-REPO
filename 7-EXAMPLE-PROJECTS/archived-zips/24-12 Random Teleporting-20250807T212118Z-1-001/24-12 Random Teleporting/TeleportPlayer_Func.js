"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teleportPlayer_Func = void 0;
const core_1 = require("horizon/core");
const TeleportPlayer_Data_1 = require("TeleportPlayer_Data");
const UtilComponent_Data_1 = require("UtilComponent_Data");
exports.teleportPlayer_Func = {
    randomLocation,
};
function randomLocation(player) {
    const spawnPoint = TeleportPlayer_Data_1.teleportPlayer_Data.spawnPoints[player.index.get()] ?? TeleportPlayer_Data_1.teleportPlayer_Data.spawnPoints[0];
    spawnPoint.position.set(getBestLocation(50));
    UtilComponent_Data_1.componentUtil_Data.component?.async.setTimeout(() => {
        spawnPoint.teleportPlayer(player);
    }, 500);
}
function getBestLocation(positionsToTry) {
    const groundedPositions = [];
    while (groundedPositions.length < positionsToTry) {
        groundedPositions.push({ pos: getRandomGroundedPosition(), playerCount: 0, closestWallDistance: 999 });
    }
    let minPlayers = TeleportPlayer_Data_1.teleportPlayer_Data.players.length;
    let curPos = groundedPositions[0].pos;
    const zeroPlayerPositions = [];
    groundedPositions.forEach((payload) => {
        payload.playerCount = countNumberOfPlayersWithLineOfSight(payload.pos);
        if (payload.playerCount < minPlayers) {
            minPlayers = payload.playerCount;
            curPos = payload.pos;
        }
        if (payload.playerCount === 0) {
            TeleportPlayer_Data_1.teleportPlayer_Data.checkDirections.forEach((dir) => {
                const rayHit = TeleportPlayer_Data_1.teleportPlayer_Data.ray?.raycast(payload.pos, dir);
                if (rayHit) {
                    if (rayHit.distance < payload.closestWallDistance) {
                        payload.closestWallDistance = rayHit.distance;
                    }
                }
            });
            zeroPlayerPositions.push({ pos: payload.pos, distance: payload.closestWallDistance });
        }
    });
    if (zeroPlayerPositions.length > 1) {
        let closestDistance = zeroPlayerPositions[0].distance;
        curPos = zeroPlayerPositions[0].pos;
        zeroPlayerPositions.forEach((payload) => {
            if (payload.distance < closestDistance) {
                closestDistance = payload.distance;
                curPos = payload.pos;
            }
        });
    }
    return curPos;
}
function getRandomGroundedPosition() {
    const randomPosition = getRandomPosition(TeleportPlayer_Data_1.teleportPlayer_Data.center, TeleportPlayer_Data_1.teleportPlayer_Data.radius, TeleportPlayer_Data_1.teleportPlayer_Data.yRadius);
    const rayHit = TeleportPlayer_Data_1.teleportPlayer_Data.ray?.raycast(randomPosition, core_1.Vec3.down);
    const groundedPosition = rayHit?.hitPoint ?? randomPosition;
    groundedPosition.y += 1;
    if (TeleportPlayer_Data_1.teleportPlayer_Data.useNavMesh) {
        TeleportPlayer_Data_1.teleportPlayer_Data.navMesh?.rebake();
        const closestPosition = TeleportPlayer_Data_1.teleportPlayer_Data.navMesh?.getNearestPoint(groundedPosition, 50) ?? randomPosition;
        closestPosition.y += 1;
        return closestPosition;
    }
    else {
        return groundedPosition;
    }
}
function getRandomPosition(center, radius, yRadius) {
    const randomPosition = center.clone();
    if (yRadius) {
        randomPosition.y += (Math.random() - 0.5) * 2 * yRadius;
    }
    randomPosition.x += (Math.random() - 0.5) * 2 * radius;
    randomPosition.z += (Math.random() - 0.5) * 2 * radius;
    return randomPosition;
}
function countNumberOfPlayersWithLineOfSight(pos) {
    let count = 0;
    TeleportPlayer_Data_1.teleportPlayer_Data.players.forEach((player) => {
        const rayHit = TeleportPlayer_Data_1.teleportPlayer_Data.ray?.raycast(pos, player.position.get().sub(pos).normalize());
        if (rayHit?.targetType === core_1.RaycastTargetType.Player) {
            count++;
        }
    });
    return count;
}
