import * as hz from "horizon/core";
import { Binding, UINode } from "horizon/ui";
import { TriviaUITemplate } from "triviaUITemplate";
import { EventSubscription } from "horizon/core";
export declare class TriviaGameUI extends TriviaUITemplate {
    static s_instance: TriviaGameUI;
    panelHeight: number;
    panelWidth: number;
    timerBinding: Binding<string>;
    roundBinding: Binding<string>;
    subscriptions: EventSubscription[];
    preStart(): void;
    start(): void;
    pointAssigner(answer: number): void;
    initializeUI(): UINode<import("horizon/ui").ViewProps>;
    assignplayer(player: hz.Player): void;
}
