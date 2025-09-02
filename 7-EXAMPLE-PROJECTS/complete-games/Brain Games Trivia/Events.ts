import { LocalEvent, NetworkEvent, Player } from "horizon/core";

export const Events = {
    //LOCAL EVENTS
    displayQuestion: new LocalEvent<{ question: string; answerA: string; answerB: string; answerC: string; answerD: string; }>("displayQuestion"),
    gameOver: new LocalEvent(),
    processPlayerAnswer: new LocalEvent<{ index: number }>(),
    revealanswer: new LocalEvent<{ answer: number; }>("revealanswer"),
    showOnlyToVR: new LocalEvent(),
    startGame: new LocalEvent<{ winningCategory: number; players: Map<Player, boolean>; }>("startGame"),
    allplayersEliminated: new LocalEvent<{}>("allplayersEliminated"),
    hideMobileUI: new LocalEvent<{}>("hideMobileUI"),
    assignMobilePlayers: new LocalEvent<{ mobilePlayers: Player[] }>("assignMobilePlayers"),
    RemoveMobilePlayer: new LocalEvent<{ player: Player }>("RemoveMobilePlayer"),

    // NETWORK EVENTS
    setCameratoViewMode: new NetworkEvent<{ player: Player; }>("setCameratoViewMode"),
    setCameraPlayerview: new NetworkEvent("setCameraPlayerview"),
};
