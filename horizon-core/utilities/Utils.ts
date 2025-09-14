/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/*
  This script contains a shared function for determining if a hz.Player entity is an NPC avatar or not.

*/

import * as hz from 'horizon/core';
// import { AvatarAIAgent } from 'horizon/avatar_ai_agent';

export function isNPC(player: hz.Player) {
  // isNPC == true -> NPC; isNPC == false -> player
  // const isNpc = AvatarAIAgent.getGizmoFromPlayer(player) !== undefined;
  // $$$ Below fix came from Engg. 
  const isNpc = player.id > 10000;
  if (isNpc) {
    // console.log("[Utils] isNPC for " + player.name.get() + " = TRUE")
    return true;
  } else {
    // console.log("[Utils] isNPC for " + player.name.get() + " = FALSE")
    return false;
  };
};



