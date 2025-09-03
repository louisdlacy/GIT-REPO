import * as hz from 'horizon/core';
import * as GC from 'GameConsts';
export declare const Events: {
    onStartUabAnimation: hz.LocalEvent<Record<string, never>>;
    onNpcJoinWorld: hz.LocalEvent<{
        npc: any;
    }>;
    onGloballyPerceivedEvent: hz.LocalEvent<{
        description: string;
    }>;
    onEmotionChanged: hz.LocalEvent<{
        emotion: GC.Emotions;
    }>;
    onStoppedTalking: hz.LocalEvent<Record<string, never>>;
    resetAnimation: hz.LocalEvent<Record<string, never>>;
    onVisemeReceived: hz.LocalEvent<{
        viseme: string;
    }>;
    onStartedLookingAtTarget: hz.LocalEvent<{
        target: hz.Player | hz.Entity;
    }>;
    onStoppedLookingAtTarget: hz.LocalEvent<Record<string, never>>;
    onUnsubscribeFromAttention: hz.LocalEvent<{
        target: hz.Player | hz.Entity;
    }>;
    onStoppedNoticeAttention: hz.LocalEvent<Record<string, never>>;
    stopNavigation: hz.LocalEvent<{
        player: hz.Player;
    }>;
    resumeNavigation: hz.LocalEvent<Record<string, never>>;
    navigateToTarget: hz.LocalEvent<{
        target: hz.Player | hz.Entity | hz.Vec3;
    }>;
    navigateOut: hz.LocalEvent<{
        target: hz.Player | hz.Entity | hz.Vec3;
    }>;
};
