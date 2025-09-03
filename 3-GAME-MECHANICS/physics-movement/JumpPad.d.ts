import * as hz from 'horizon/core';
export declare const JumpPadEvents: {
    playerLaunched: hz.NetworkEvent<{
        player: hz.Player;
        launchVelocity: hz.Vec3;
    }>;
    jumpPadActivated: hz.LocalEvent<{
        jumpPad: hz.Entity;
        player: hz.Player;
    }>;
};
type JumpPadState = {
    isActive: boolean;
    lastLaunchTime: number;
};
export declare class JumpPad extends hz.Component<typeof JumpPad> {
    static propsDefinition: {
        launchForce: {
            type: "number";
            default: number;
        };
        launchAngle: {
            type: "number";
            default: number;
        };
        cooldownTime: {
            type: "number";
            default: number;
        };
        triggerZone: {
            type: "Entity";
        };
        launchVFX: {
            type: "Entity";
        };
        launchSFX: {
            type: "Entity";
        };
        idleVFX: {
            type: "Entity";
        };
        idleSFX: {
            type: "Entity";
        };
        debugMode: {
            type: "boolean";
            default: boolean;
        };
    };
    private triggerEnter?;
    private triggerExit?;
    private playerLaunched?;
    private launchVFX?;
    private launchSFX?;
    private idleVFX?;
    private idleSFX?;
    private triggerZone?;
    private isActive;
    private lastLaunchTime;
    private playersInZone;
    preStart(): void;
    start(): void;
    dispose(): void;
    onPlayerEnterTrigger(player: hz.Player): void;
    onPlayerExitTrigger(player: hz.Player): void;
    private launchPlayer;
    private calculateLaunchVelocity;
    private playLaunchEffects;
    private startIdleEffects;
    private stopIdleEffects;
    onPlayerLaunched(data: {
        player: hz.Player;
        launchVelocity: hz.Vec3;
    }): void;
    activate(): void;
    deactivate(): void;
    getIsActive(): boolean;
    getPlayersInZone(): hz.Player[];
    receiveOwnership(state: JumpPadState | null, fromPlayer: hz.Player, toPlayer: hz.Player): void;
    transferOwnership(oldPlayer: hz.Player, newPlayer: hz.Player): JumpPadState;
}
export {};
