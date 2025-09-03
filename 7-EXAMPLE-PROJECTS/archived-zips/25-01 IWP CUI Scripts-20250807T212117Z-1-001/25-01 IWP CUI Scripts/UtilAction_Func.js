"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionUtils = void 0;
const core_1 = require("horizon/core");
const UtilComponent_Data_1 = require("UtilComponent_Data");
exports.actionUtils = {
    playSFX,
    playSFXForDuration,
    playVFX,
    playVFXForDuration,
    playHaptics,
};
function playSFX(fx, pos, players = undefined) {
    if (fx) {
        if (pos) {
            fx?.position.set(pos);
        }
        if (players) {
            fx.as(core_1.AudioGizmo).play({ fade: 0, players: players });
        }
        else {
            fx.as(core_1.AudioGizmo).play();
        }
    }
}
async function playSFXForDuration(fx, pos, durationSeconds) {
    if (fx) {
        if (pos) {
            fx?.position.set(pos);
        }
        fx.as(core_1.AudioGizmo).play();
    }
    UtilComponent_Data_1.componentUtil_Data.component?.async.setTimeout(() => {
        fx?.as(core_1.AudioGizmo).stop();
    }, durationSeconds * 1000);
}
function playVFX(fx, pos) {
    if (fx) {
        if (pos) {
            fx?.position.set(pos);
        }
        fx.as(core_1.ParticleGizmo).play();
    }
}
async function playVFXForDuration(fx, pos, durationSeconds) {
    if (fx) {
        if (pos) {
            fx?.position.set(pos);
        }
        fx.as(core_1.ParticleGizmo).play();
    }
    UtilComponent_Data_1.componentUtil_Data.component?.async.setTimeout(() => {
        fx?.as(core_1.ParticleGizmo).stop();
    }, durationSeconds * 1000);
}
function playHaptics(player, haptics, isRightHand = undefined) {
    if (isRightHand === undefined) {
        player.rightHand.playHaptics(...haptics);
        player.leftHand.playHaptics(...haptics);
    }
    else if (isRightHand) {
        player.rightHand.playHaptics(...haptics);
    }
    else {
        player.leftHand.playHaptics(...haptics);
    }
}
