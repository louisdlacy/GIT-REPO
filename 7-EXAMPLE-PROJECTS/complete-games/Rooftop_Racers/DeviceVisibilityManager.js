"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
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
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const hz = __importStar(require("horizon/core"));
class VisiblePerPlatform extends hz.Component {
    constructor() {
        super(...arguments);
        this.visibleToList = [];
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            let canSee = false;
            const deviceType = player.deviceType.get();
            canSee || (canSee = this.props.showOnVR && deviceType == hz.PlayerDeviceType.VR);
            canSee || (canSee = this.props.showOnDesktop && deviceType == hz.PlayerDeviceType.Desktop);
            canSee || (canSee = this.props.showOnMobile && deviceType == hz.PlayerDeviceType.Mobile);
            if (canSee) {
                this.visibleToList.push(player);
            }
            this.setVisibilityForPlayers(this.visibleToList);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            const indexToRemove = this.visibleToList.findIndex((p) => p.id == player.id);
            if (indexToRemove != -1) {
                this.visibleToList.splice(indexToRemove, 1);
            }
        });
    }
    start() { }
    setVisibilityForPlayers(players, visibleTo = true) {
        this.entity.setVisibilityForPlayers(players, visibleTo ? hz.PlayerVisibilityMode.VisibleTo : hz.PlayerVisibilityMode.HiddenFrom);
    }
}
VisiblePerPlatform.propsDefinition = {
    showOnVR: { type: hz.PropTypes.Boolean, default: false },
    showOnDesktop: { type: hz.PropTypes.Boolean, default: false },
    showOnMobile: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(VisiblePerPlatform);
