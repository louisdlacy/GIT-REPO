"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// TURBO USAGE: KEEP & CUSTOMIZE BASED ON YOUR NEEDS
const hz = __importStar(require("horizon/core"));
const analytics_1 = require("horizon/analytics");
const TurboAnalytics_1 = require("TurboAnalytics");
/* True if the string is legit */
function isLegit(x) {
    return !!x && x.trim() !== '';
}
class TurboArea extends hz.Component {
    cacheProps() {
        this.areaResolved = isLegit(this.props.area) ? this.props.area : 'UNKNOWN';
        this.isLobby = this.props.isLobby ?? true;
        this.isPlayerReady = this.props.isPlayerReady ?? false;
        this.isInRound = this.props.isInRound ?? false;
    }
    start() {
        this.cacheProps();
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enterBy) => {
            this.onAreaEnter(enterBy);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (exitedBy) => {
            this.onAreaExit(exitedBy);
        });
    }
    onAreaEnter(player) {
        (0, TurboAnalytics_1.Analytics)()?.sendAreaEnter({
            player,
            actionArea: this.areaResolved,
            actionAreaIsLobbySection: this.isLobby,
            actionAreaIsPlayerReadyZone: this.isPlayerReady,
            turboState: this.isInRound ? analytics_1.ParticipationEnum.IN_ROUND : undefined // otherwise player isn't included in the round
        });
    }
    onAreaExit(player) {
        (0, TurboAnalytics_1.Analytics)()?.sendAreaExit({
            player,
            actionArea: this.areaResolved,
            actionAreaIsLobbySection: this.isLobby,
            actionAreaIsPlayerReadyZone: this.isPlayerReady
        });
    }
}
TurboArea.propsDefinition = {
    area: { type: hz.PropTypes.String },
    isLobby: { type: hz.PropTypes.Boolean, default: true },
    isPlayerReady: { type: hz.PropTypes.Boolean, default: false },
    isInRound: { type: hz.PropTypes.Boolean, default: false }
};
hz.Component.register(TurboArea);
