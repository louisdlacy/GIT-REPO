import { LocalEvent, NetworkEvent, Player } from "horizon/core";
export declare const Events: {
    displayQuestion: LocalEvent<{
        question: string;
        answerA: string;
        answerB: string;
        answerC: string;
        answerD: string;
    }>;
    gameOver: LocalEvent<Record<string, never>>;
    processPlayerAnswer: LocalEvent<{
        index: number;
    }>;
    revealanswer: LocalEvent<{
        answer: number;
    }>;
    showOnlyToVR: LocalEvent<Record<string, never>>;
    startGame: LocalEvent<{
        winningCategory: number;
        players: Map<Player, boolean>;
    }>;
    allplayersEliminated: LocalEvent<{}>;
    hideMobileUI: LocalEvent<{}>;
    assignMobilePlayers: LocalEvent<{
        mobilePlayers: Player[];
    }>;
    RemoveMobilePlayer: LocalEvent<{
        player: Player;
    }>;
    setCameratoViewMode: NetworkEvent<{
        player: Player;
    }>;
    setCameraPlayerview: NetworkEvent<Record<string, never>>;
};
