import { TriviaGameUI } from "answerStation";
import { Component, Player } from "horizon/core";
export type Dbentry = {
    question: string;
    answers: string[];
};
export declare let GameStatus: "idle" | "preparing" | "running";
export declare class gameManager extends Component<typeof gameManager> {
    static s_instance: gameManager;
    static propsDefinition: {};
    private players;
    private stations;
    preStart(): void;
    start(): void;
    registerStation(station: TriviaGameUI): void;
    registerPlayer(player: Player): void;
    startGame(winningCategory: number): void;
    playerElimination(player: Player): void;
}
