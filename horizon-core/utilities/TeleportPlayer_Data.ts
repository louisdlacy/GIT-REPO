import { Player, RaycastGizmo, SpawnPointGizmo, Vec3 } from "horizon/core";
import { NavMesh } from "horizon/navmesh";


let ray: RaycastGizmo | undefined;
let navMesh: NavMesh | undefined | null;
const players: Player[] = [];
const spawnPoints: SpawnPointGizmo[] = [];

export const teleportPlayer_Data = {
  ray,
  center: new Vec3(0, 50, 0),
  radius: 32,
  yRadius: 0,
  players,
  checkDirections: [
    new Vec3(1, 0, 0),
    new Vec3(-1, 0, 0),
    new Vec3(0, 0, 1),
    new Vec3(0, 0, -1),
    new Vec3(0.707, 0, 0.707),
    new Vec3(-0.707, 0, -0.707),
    new Vec3(-0.707, 0, 0.707),
    new Vec3(0.707, 0, -0.707),
  ],
  spawnPoints,
  useNavMesh: false,
  navMesh,
}