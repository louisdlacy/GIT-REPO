import * as hz from 'horizon/core';
export declare class RespawnTrigger extends hz.Component<typeof RespawnTrigger> {
    static propsDefinition: {
        triggerZone: {
            type: "Entity";
        };
        respawnPoint: {
            type: "Entity";
        };
    };
    private triggerEnter?;
    start(): void;
    private onPlayerEnterTrigger;
    dispose(): void;
}
