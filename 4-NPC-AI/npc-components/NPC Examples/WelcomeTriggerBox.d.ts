import * as hz from "horizon/core";
export declare class WelcomeTriggerBox extends hz.Component<typeof WelcomeTriggerBox> {
    static propsDefinition: {};
    static welcomeTriggerZoneEvent: hz.LocalEvent<{
        player: hz.Player;
        entered: boolean;
    }>;
    start(): void;
}
