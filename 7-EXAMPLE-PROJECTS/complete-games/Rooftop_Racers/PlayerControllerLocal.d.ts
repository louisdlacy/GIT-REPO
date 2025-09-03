import * as hz from "horizon/core";
export declare class PlayerControllerLocal extends hz.Component<typeof PlayerControllerLocal> {
    static propsDefinition: {
        doubleJumpSFX: {
            type: "Entity";
        };
        boostUsedSFX: {
            type: "Entity";
        };
        boostReceivedSFX: {
            type: "Entity";
        };
        respawnSFX: {
            type: "Entity";
        };
        boostUsedParticleVFX: {
            type: "Entity";
        };
    };
    private doubleJumpSFX;
    private boostUsedSFX;
    private boostReceivedSFX;
    private respawnSFX;
    private localSFXSettings;
    private boostUsedParticleVFX;
    private owner;
    private hasJumped;
    private jump1;
    private jump2;
    private isBoosted;
    private canBoost;
    private boostJumpAmount;
    private boostJumpRadians;
    private doubleJumpAmount;
    private connectedJumpInput;
    private connectedBoostInput;
    private connectLocalControlX;
    private connectLocalControlY;
    private onUpdateSub;
    private setJumpCtrlDataSub;
    private onPlayerOOBSub;
    private stopRacePosUpdatesSub;
    private playerGotBoostSub;
    preStart(): void;
    start(): void;
    private serverStart;
    private localPreStart;
    private localStart;
    private connectDoubleJumpInputs;
    private connectBoostJumpInputs;
    private getBoostVectorBasedOnInput;
    private reset;
    private cleanup;
}
