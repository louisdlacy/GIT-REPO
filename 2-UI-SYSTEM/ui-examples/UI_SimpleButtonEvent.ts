import { NetworkEvent, Player } from "horizon/core";

export const simpleButtonEvent = new NetworkEvent<{ player: Player }>("simpleButtonEvent");
export const addAmountEvent = new NetworkEvent<{ player: Player, amount: number }>("addAmountEvent");