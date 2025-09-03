import { Player, RaycastGizmo, SpawnPointGizmo, Vec3 } from "horizon/core";
export declare const teleportPlayer_Data: {
    ray: RaycastGizmo | undefined;
    center: Vec3;
    radius: number;
    yRadius: number;
    players: Player[];
    checkDirections: Vec3[];
    spawnPoints: SpawnPointGizmo[];
    useNavMesh: boolean;
    navMesh: any;
};
