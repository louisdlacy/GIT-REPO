import { TriviaUITemplate } from "triviaUITemplate";
import * as hz from "horizon/core";
import { Binding } from "horizon/ui";
export declare class MobileTriviaUI extends TriviaUITemplate {
    static instance: MobileTriviaUI;
    panelHeight: number;
    panelWidth: number;
    selectedLabelValue: string;
    selectedLabel: Binding<string>;
    blinkingIntervalId: number | null;
    lastShowTextBinding: Binding<boolean> | null;
    currentPlayers: hz.Player[];
    preStart(): void;
    setVisibility(players: hz.Player[]): void;
    assignPlayer(players: hz.Player[]): void;
    showMobileUI(): void;
    removePlayer(player: hz.Player): void;
    initiateRevealAnswerSubscription(): void;
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
    private buttonPressed;
}
