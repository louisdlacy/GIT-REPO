import * as hz from "horizon/core";
import { NavMeshAgent } from "horizon/navmesh";
export declare enum NPCAgentEmote {
    Wave = "EmoteWave",
    Celebration = "EmoteCelebration",
    Taunt = "EmoteTaunt",
    Yes = "EmoteYes",
    No = "EmoteNo",
    Point = "EmotePoint"
}
export declare class NPCAgent<T> extends hz.Component<typeof NPCAgent & T> {
    static propsDefinition: {
        headHeight: {
            type: "number";
            default: number;
        };
        walkSpeed: {
            type: "number";
            default: number;
        };
        runSpeed: {
            type: "number";
            default: number;
        };
        hasRandomIdle: {
            type: "boolean";
            default: boolean;
        };
    };
    private assetRef_?;
    private navMeshAgent_?;
    private lookAt_;
    private animMoving_;
    private animSpeed_;
    private animDead_;
    private animLookX_;
    private animLookY_;
    get lookAt(): hz.Vec3 | undefined;
    set lookAt(value: hz.Vec3 | undefined);
    get dead(): boolean;
    set dead(value: boolean);
    get navMeshAgent(): NavMeshAgent | undefined;
    triggerAnimation(animationName: string): void;
    triggerAttackAnimation(): void;
    triggerHitAnimation(): void;
    triggerEmoteAnimation(emote: NPCAgentEmote): void;
    setMaxSpeedToWalkSpeed(): void;
    setMaxSpeedToRunSpeed(): void;
    start(): void;
    resetAllAnimationParameters(): void;
    update(deltaTime: number): void;
    private updateSpeedAnimationParameters;
    private calculateSpeedAnimationValue;
    private updateLookAtAnimationParameters;
}
