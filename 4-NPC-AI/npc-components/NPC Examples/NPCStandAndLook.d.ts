import * as hz from "horizon/core";
import { NPCAgent } from "NPCAgent";
export declare const LookAtPlayer: hz.LocalEvent<{
    player: hz.Player;
}>;
export declare const StopLookingAtPlayer: hz.LocalEvent<{
    player: hz.Player;
}>;
export declare const PlayAnimation: hz.LocalEvent<{
    animation: string;
    player: hz.Player | undefined;
}>;
export declare class NPCStandAndLook extends NPCAgent<typeof NPCStandAndLook> {
    static propsDefinition: any;
    static dummy: number;
    players: hz.Player[];
    playerToLookAt: hz.Player | undefined;
    reevaluateTimer: number;
    start(): void;
    onLookAtPlayer(player: hz.Player): void;
    onStopLookingAtPlayer(player: hz.Player): void;
    update(deltaTime: number): void;
    selectRandomPlayerToLookAt(): hz.Player | undefined;
    getReevaluateDelay(): number;
}
