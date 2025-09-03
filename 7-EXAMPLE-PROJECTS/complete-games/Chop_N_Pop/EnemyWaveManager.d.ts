import { Behaviour } from "Behaviour";
export declare class EnemyWaveManager extends Behaviour<typeof EnemyWaveManager> {
    static propsDefinition: {
        activeFromStart: {
            type: "boolean";
            default: boolean;
        };
        waveGroupName: {
            type: "string";
        };
        initialWaveTimeDelay: {
            type: "number";
            default: number;
        };
        wavePlayerMultiplier: {
            type: "number";
            default: number;
        };
        wave1Config: {
            type: "Entity";
        };
        wave2TimeDelay: {
            type: "number";
            default: number;
        };
        wave2Config: {
            type: "Entity";
        };
        wave3TimeDelay: {
            type: "number";
            default: number;
        };
        wave3Config: {
            type: "Entity";
        };
    };
    private currentWave;
    private waveSpawns;
    private updateInterval;
    private isActive;
    private waveConfigs;
    private waveCompleteNotified;
    name: string;
    Start(): void;
    private findMonstersInRange;
    private resetWaveManager;
    private updateState;
    private activateWaveGroup;
    private deactivateWaveGroup;
    private nextWave;
}
