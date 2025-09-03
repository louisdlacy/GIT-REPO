/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script orhcestrates behaviors of the NPCs in the world.

 */
import * as hz from 'horizon/core';
import { AgentLocomotionResult, AvatarAIAgent } from 'horizon/avatar_ai_agent';
import { NavMesh } from 'horizon/navmesh';
import { NPCAudioPlayback } from 'NPCAudioPlayback';
export declare class PlayerState {
    player: hz.Player;
    gemsCollected: number;
    coins: number;
    redGems: number;
    gemQuestCompleted: boolean;
    constructor(init?: Partial<PlayerState>);
}
declare abstract class NPCBehavior {
    abstract updateForPlayer(ps: PlayerState): void;
    onTransactionDone(ps: PlayerState, gemDelta: number, coinDelta: Number): void;
    manager: NPCManager;
    constructor(manager: NPCManager);
    getPathTo(from: hz.Vec3, to: hz.Vec3): Array<hz.Vec3>;
    protected moveToPosition(agent: AvatarAIAgent, destination: hz.Vec3, onfulfilled?: ((value: AgentLocomotionResult) => void | PromiseLike<void>) | null | undefined, onrejected?: ((reason: any) => void | PromiseLike<never>) | null | undefined): Promise<void>;
    protected calcTargetPos(target: hz.Entity | hz.Player): hz.Vec3;
    protected moveToEntity(agent: AvatarAIAgent, target: hz.Entity | hz.Player, onfulfilled?: ((value: AgentLocomotionResult) => void | PromiseLike<void>) | null | undefined, onrejected?: ((reason: any) => void | PromiseLike<never>) | null | undefined): Promise<void>;
}
export declare class NPCManager extends hz.Component<typeof NPCManager> {
    static propsDefinition: {
        villageElder: {
            type: "Entity";
        };
        merchant: {
            type: "Entity";
        };
        resetLocation: {
            type: "Entity";
        };
        startLocation: {
            type: "Entity";
        };
        audioBank: {
            type: "Entity";
        };
        merchantIdleLocation: {
            type: "Entity";
        };
        gemGrabLocation: {
            type: "Entity";
        };
    };
    playerMap: Map<number, PlayerState>;
    navMesh: NavMesh;
    veBusy: boolean;
    merchantBusy: boolean;
    currentBehavior: NPCBehavior;
    private updateId;
    audio?: NPCAudioPlayback;
    preStart(): Promise<void>;
    private onSpawnResult;
    start(): void;
    private onUpdate;
    private handleOnPlayerExit;
    private handleOnPlayerEnter;
    private onGameStateChanged;
    private onGemCollected;
    onTransactionDone(ps: PlayerState, GemDelta: number, CoinDelta: number): void;
    refreshEconUI(): void;
}
export {};
