"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const analytics_1 = require("horizon/analytics");
class SaveAreaAnalytics extends core_1.Component {
    preStart() {
        analytics_1.Turbo.register(this, analytics_1.TurboDefaultSettings);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger(player) {
        // Save the analytics data when the player enters the trigger
        const payload = {
            actionArea: 'Lobby',
            actionAreaIsLobbySection: true,
            actionAreaIsPlayerReadyZone: true,
            player: player
        };
        analytics_1.Turbo.send(analytics_1.TurboEvents.OnAreaEnter, payload);
    }
    onPlayerExitTrigger(player) {
        // Save the analytics data when the player exits the trigger
        const payload = {
            actionArea: 'Lobby',
            actionAreaIsLobbySection: true,
            actionAreaIsPlayerReadyZone: true,
            player: player
        };
        analytics_1.Turbo.send(analytics_1.TurboEvents.OnAreaExit, payload);
    }
}
core_1.Component.register(SaveAreaAnalytics);
