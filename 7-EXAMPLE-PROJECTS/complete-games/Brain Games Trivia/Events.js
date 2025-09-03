"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const core_1 = require("horizon/core");
exports.Events = {
    //LOCAL EVENTS
    displayQuestion: new core_1.LocalEvent("displayQuestion"),
    gameOver: new core_1.LocalEvent(),
    processPlayerAnswer: new core_1.LocalEvent(),
    revealanswer: new core_1.LocalEvent("revealanswer"),
    showOnlyToVR: new core_1.LocalEvent(),
    startGame: new core_1.LocalEvent("startGame"),
    allplayersEliminated: new core_1.LocalEvent("allplayersEliminated"),
    hideMobileUI: new core_1.LocalEvent("hideMobileUI"),
    assignMobilePlayers: new core_1.LocalEvent("assignMobilePlayers"),
    RemoveMobilePlayer: new core_1.LocalEvent("RemoveMobilePlayer"),
    // NETWORK EVENTS
    setCameratoViewMode: new core_1.NetworkEvent("setCameratoViewMode"),
    setCameraPlayerview: new core_1.NetworkEvent("setCameraPlayerview"),
};
