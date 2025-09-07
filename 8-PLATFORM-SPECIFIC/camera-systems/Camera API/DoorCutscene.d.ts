import * as hz from 'horizon/core';
export declare const CutsceneEvents: {
    OnStartCutscene: hz.LocalEvent<{
        player: hz.Player;
        doorButton: hz.Entity;
    }>;
    OnCutsceneComplete: hz.LocalEvent<{}>;
};
