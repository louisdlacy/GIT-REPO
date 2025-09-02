import { Player, RaycastTargetType, Vec3 } from "horizon/core";
import { teleportPlayer_Data } from "TeleportPlayer_Data";
import { componentUtil_Data } from "UtilComponent_Data";



export const teleportPlayer_Func = {
  randomLocation,
}


function randomLocation(player: Player) {
  const spawnPoint = teleportPlayer_Data.spawnPoints[player.index.get()] ?? teleportPlayer_Data.spawnPoints[0];

  spawnPoint.position.set(getBestLocation(50));

  componentUtil_Data.component?.async.setTimeout(() => {
    spawnPoint.teleportPlayer(player);
  }, 500);
}

function getBestLocation(positionsToTry: number): Vec3 {
  const groundedPositions: { pos: Vec3, playerCount: number, closestWallDistance: number }[] = [];

  while (groundedPositions.length < positionsToTry) {
    groundedPositions.push({ pos: getRandomGroundedPosition(), playerCount: 0, closestWallDistance: 999 });
  }

  let minPlayers = teleportPlayer_Data.players.length;
  let curPos = groundedPositions[0].pos;

  const zeroPlayerPositions: { pos: Vec3, distance: number }[] = [];

  groundedPositions.forEach((payload) => {
    payload.playerCount = countNumberOfPlayersWithLineOfSight(payload.pos);

    if (payload.playerCount < minPlayers) {
      minPlayers = payload.playerCount;
      curPos = payload.pos;
    }

    if (payload.playerCount === 0) {
      teleportPlayer_Data.checkDirections.forEach((dir) => {
        const rayHit = teleportPlayer_Data.ray?.raycast(payload.pos, dir);

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

function getRandomGroundedPosition(): Vec3 {
  const randomPosition = getRandomPosition(teleportPlayer_Data.center, teleportPlayer_Data.radius, teleportPlayer_Data.yRadius);

  const rayHit = teleportPlayer_Data.ray?.raycast(randomPosition, Vec3.down);

  const groundedPosition = rayHit?.hitPoint ?? randomPosition;
  groundedPosition.y += 1;

  if (teleportPlayer_Data.useNavMesh) {
    teleportPlayer_Data.navMesh?.rebake();

    const closestPosition = teleportPlayer_Data.navMesh?.getNearestPoint(groundedPosition, 50) ?? randomPosition;
    closestPosition.y += 1;

    return closestPosition;
  }
  else {
    return groundedPosition;
  }
}

function getRandomPosition(center: Vec3, radius: number, yRadius: number | undefined): Vec3 {
  const randomPosition = center.clone();

  if (yRadius) {
    randomPosition.y += (Math.random() - 0.5) * 2 * yRadius;
  }

  randomPosition.x += (Math.random() - 0.5) * 2 * radius;
  randomPosition.z += (Math.random() - 0.5) * 2 * radius;

  return randomPosition;
}

function countNumberOfPlayersWithLineOfSight(pos: Vec3): number {
  let count = 0;

  teleportPlayer_Data.players.forEach((player) => {
    const rayHit = teleportPlayer_Data.ray?.raycast(pos, player.position.get().sub(pos).normalize());

    if (rayHit?.targetType === RaycastTargetType.Player) {
      count++;
    }
  });

  return count;
}