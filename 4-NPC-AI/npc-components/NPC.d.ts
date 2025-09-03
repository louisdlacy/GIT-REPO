import { DialogContainer } from 'Dialog_UI';
import * as hz from 'horizon/core';
export declare class DialogEvents {
    static requestDialog: hz.NetworkEvent<{
        player: hz.Player;
        key: number[];
    }>;
    static sendDialogScript: hz.NetworkEvent<{
        container?: DialogContainer;
    }>;
    static onEnterTalkableProximity: hz.NetworkEvent<{
        npc: hz.Entity;
    }>;
}
export declare class NPC extends hz.Component<typeof NPC> {
    static propsDefinition: {
        name: {
            type: "string";
        };
        proximityTrigger: {
            type: "Entity";
        };
        dialogScript: {
            type: "Entity";
        };
    };
    private scriptData?;
    start(): void;
    private onPlayerEnterTrigger;
    private onOptionReceived;
}
