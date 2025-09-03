import { Behaviour } from "Behaviour";
import { Vec3 } from "horizon/core";
import { StateMachine } from "StateMachine";
export declare enum NpcAnimation {
    Idle = "Idle",
    Attack = "Attack",
    Hit = "Hit",
    Death = "Death",
    Wave = "EmoteWave",
    Celebration = "EmoteCelebration",
    Taunt = "EmoteTaunt",
    Yes = "EmoteYes",
    No = "EmoteNo",
    Point = "EmotePoint"
}
export declare enum NpcMovementSpeed {
    Walk = 0,
    Run = 1
}
export interface INpcAgent {
    isDead: boolean;
}
export declare class NpcAgent<T> extends Behaviour<typeof NpcAgent & T> implements INpcAgent {
    static propsDefinition: {
        agentFPS: {
            type: "number";
            default: number;
        };
        headHeight: {
            type: "number";
            default: number;
        };
        collider: {
            type: "Entity";
        };
        configName: {
            type: "string";
            default: string;
        };
    };
    private assetRef?;
    private navMesh?;
    private navAgent?;
    private frameTimer;
    private nextTarget?;
    private lastKnownGood?;
    private currentLookAt;
    private animMoving;
    private animSpeed;
    isDead: boolean;
    protected stateMachine: StateMachine | null;
    protected config: any;
    Start(): void;
    Update(deltaTime: number): void;
    setMovementSpeed(speed: NpcMovementSpeed): void;
    goToTarget(target: Vec3): void;
    animate(animation: NpcAnimation): void;
    private bulletHit;
    private axeHit;
    protected npcHit(hitPos: Vec3, hitNormal: Vec3, damage: number): void;
    private resetAllAnimationParameters;
    private updateSpeedAnimationParameters;
    private calculateSpeedAnimationValue;
    private updateLookAtAnimationParameters;
}
