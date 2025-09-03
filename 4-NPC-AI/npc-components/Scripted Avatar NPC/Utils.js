"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNPC = isNPC;
// import { AvatarAIAgent } from 'horizon/avatar_ai_agent';
function isNPC(player) {
    // isNPC == true -> NPC; isNPC == false -> player
    // const isNpc = AvatarAIAgent.getGizmoFromPlayer(player) !== undefined;
    // $$$ Below fix came from Engg. 
    const isNpc = player.id > 10000;
    if (isNpc) {
        // console.log("[Utils] isNPC for " + player.name.get() + " = TRUE")
        return true;
    }
    else {
        // console.log("[Utils] isNPC for " + player.name.get() + " = FALSE")
        return false;
    }
    ;
}
;
