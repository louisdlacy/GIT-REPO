/**
 * Contains the event container for the entire world
 */
import { GameState } from "GameUtils";
import * as hz from "horizon/core";
export declare const Events: {
    onGameStateChanged: hz.LocalEvent<{
        fromState: GameState;
        toState: GameState;
    }>;
    onRegisterPlayerForMatch: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onDeregisterPlayerForMatch: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onPlayerJoinedStandby: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onPlayerLeftMatch: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onPlayerLeftStandby: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onPlayerReachedGoal: hz.LocalEvent<{
        player: hz.Player;
    }>;
    onResetLocalObjects: hz.NetworkEvent<Record<string, never>>;
    onResetWorld: hz.NetworkEvent<Record<string, never>>;
    onGameEndTimeLeft: hz.LocalEvent<{
        timeLeftMS: number;
    }>;
    onGameStartTimeLeft: hz.LocalEvent<{
        timeLeftMS: number;
    }>;
    onRegisterPlyrCtrl: hz.LocalEvent<{
        caller: hz.Entity;
    }>;
    onGetPlyrCtrlData: hz.NetworkEvent<{
        caller: hz.Player;
    }>;
    onSetPlyrCtrlData: hz.NetworkEvent<{
        doubleJumpAmount: number;
        boostJumpAmount: number;
        boostJumpAngle: number;
    }>;
    onPlayerGotBoost: hz.NetworkEvent<Record<string, never>>;
    onPlayerUsedBoost: hz.LocalEvent<Record<string, never>>;
    onPlayerUsedDoubleJump: hz.LocalEvent<Record<string, never>>;
    onRegisterOOBRespawner: hz.LocalEvent<{
        caller: hz.Entity;
    }>;
    onGetOOBRespawnerData: hz.NetworkEvent<{
        caller: hz.Entity;
    }>;
    onSetOOBRespawnerData: hz.NetworkEvent<{
        intervalMS: number;
        OOBWorldYHeight: number;
    }>;
    onPlayerOutOfBounds: hz.NetworkEvent<Record<string, never>>;
    onRegisterRaceHUD: hz.LocalEvent<{
        caller: hz.Entity;
    }>;
    onRacePosUpdate: hz.NetworkEvent<{
        playerPos: number;
        totalRacers: number;
        matchTime: number;
    }>;
    onStopRacePosUpdates: hz.NetworkEvent<Record<string, never>>;
};
