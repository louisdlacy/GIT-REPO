import { Entity, NetworkEvent, Player, Vec3 } from "horizon/core";
export declare const Events: {
    gameReset: NetworkEvent<{}>;
    projectileHit: NetworkEvent<{
        hitPos: Vec3;
        hitNormal: Vec3;
        fromPlayer: Player;
    }>;
    playerScoredHit: NetworkEvent<{
        player: Player;
        entity: Entity;
    }>;
    gunRequestAmmo: NetworkEvent<{
        player: Player;
        weapon: Entity;
        ammoCount: number;
    }>;
    gunRequestAmmoResponse: NetworkEvent<{
        ammoCount: number;
    }>;
    axeHit: NetworkEvent<{
        hitPos: Vec3;
        hitNormal: Vec3;
        fromPlayer: Player;
    }>;
    playerHit: NetworkEvent<{
        player: Player;
        damage: number;
        damageOrigin: Vec3;
    }>;
    monstersInRange: NetworkEvent<{
        entity: Entity;
        range: number;
    }>;
    monstersInRangeResponse: NetworkEvent<{
        monsters: Entity[];
    }>;
    lootPickup: NetworkEvent<{
        player: Player;
        loot: string;
    }>;
    playerDeath: NetworkEvent<{
        player: Player;
    }>;
    registerLocalPlayerController: NetworkEvent<{
        entity: Entity;
    }>;
    playerDataUpdate: NetworkEvent<{
        ammo: number;
        hp: number;
    }>;
    playerAmmoUpdate: NetworkEvent<{
        player: Player;
        ammo: number;
    }>;
    playerHpUpdate: NetworkEvent<{
        player: Player;
        hp: number;
    }>;
};
export declare const WaveManagerNetworkEvents: {
    StartWaveGroup: NetworkEvent<{
        waveGroupName: string;
    }>;
    StopWaveGroup: NetworkEvent<{
        waveGroupName: string;
    }>;
    NextWave: NetworkEvent<{
        waveGroupName: string;
    }>;
    StartingWave: NetworkEvent<{
        waveGroupName: string;
        waveNumber: number;
    }>;
    WaveComplete: NetworkEvent<{
        waveGroupName: string;
        waveNumber: number;
    }>;
    FightStarted: NetworkEvent<{
        waveGroupName: string;
    }>;
    FightEnded: NetworkEvent<{
        waveGroupName: string;
    }>;
};
