import * as hz from 'horizon/core';
import * as GC from 'GameConsts';

export const Events = {
    // UAB
    onStartUabAnimation: new hz.LocalEvent("onUabNeedUpdate"),

    // NPC
    onNpcJoinWorld: new hz.LocalEvent<{ npc: any }>('onNpcJoinWorld'),
    onGloballyPerceivedEvent: new hz.LocalEvent<{ description: string }>('onGloballyPerceivedEvent'),
    onEmotionChanged: new hz.LocalEvent<{ emotion: GC.Emotions }>('onEmotionChanged'),
    onStoppedTalking: new hz.LocalEvent('onStoppedTalking'),
    resetAnimation: new hz.LocalEvent('resetAnimation'),
    onVisemeReceived: new hz.LocalEvent<{ viseme: string }>('onViseme'),
    onStartedLookingAtTarget: new hz.LocalEvent<{ target: hz.Player | hz.Entity }>('onStartedLookingAtTarget'),
    onStoppedLookingAtTarget: new hz.LocalEvent('onStoppedLookingAtTarget'),

    // Attention
    onUnsubscribeFromAttention: new hz.LocalEvent<{ target: hz.Player | hz.Entity }>('onUnsubscribeFromAttention'),
    onStoppedNoticeAttention: new hz.LocalEvent('onStoppedLookingAtAttention'),

    // Navigation
    stopNavigation: new hz.LocalEvent<{ player: hz.Player }>('stopNavigation'),
    resumeNavigation: new hz.LocalEvent('resumeNavigation'),
    navigateToTarget: new hz.LocalEvent<{ target: hz.Player | hz.Entity | hz.Vec3 }>('navigateToTarget'),

    // Npc Navigation
    navigateOut: new hz.LocalEvent<{ target: hz.Player | hz.Entity | hz.Vec3 }>('navigateOut'),
};
