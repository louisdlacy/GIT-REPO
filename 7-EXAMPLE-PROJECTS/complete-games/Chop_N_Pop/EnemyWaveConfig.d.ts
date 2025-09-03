import { Behaviour } from 'Behaviour';
import { Entity } from 'horizon/core';
export declare class EnemyWaveConfig extends Behaviour<typeof EnemyWaveConfig> {
    static propsDefinition: {
        spawnPoints: {
            type: "Entity";
        };
        spawnSquareSize: {
            type: "number";
            default: number;
        };
        waveSize: {
            type: "number";
            default: number;
        };
        enemy1: {
            type: "Asset";
        };
        enemy1Odds: {
            type: "number";
            default: number;
        };
        enemy2: {
            type: "Asset";
        };
        enemy2Odds: {
            type: "number";
            default: number;
        };
        enemy3: {
            type: "Asset";
        };
        enemy3Odds: {
            type: "number";
            default: number;
        };
        enemy4: {
            type: "Asset";
        };
        enemy4Odds: {
            type: "number";
            default: number;
        };
    };
    private enemies;
    Start(): void;
    spawnEnemyWave(waveMultiplier: number): Set<Entity>;
}
