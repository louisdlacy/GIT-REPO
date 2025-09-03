import { Behaviour } from 'Behaviour';
export declare enum SountrackStates {
    Lobby = 0,
    Battle = 1,
    Boss = 2,
    End = 3
}
export declare enum SountrackOneOffs {
    Death = 0
}
export declare class SoundtrackManager extends Behaviour<typeof SoundtrackManager> {
    static propsDefinition: {
        lobbyMusic: {
            type: "Entity";
        };
        battleMusic: {
            type: "Entity";
        };
        bossMusic: {
            type: "Entity";
        };
        endMusic: {
            type: "Entity";
        };
        deathStinger: {
            type: "Entity";
        };
    };
    private stateTracks;
    private oneOffTracks;
    private currentTrack;
    Start(): void;
    private registerEventListeners;
    private playMusicState;
    private playOneOff;
}
