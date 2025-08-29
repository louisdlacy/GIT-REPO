import { NetworkEvent, Player } from "horizon/core";

export const simpleButtonEvent = new NetworkEvent<{ player: Player }>("simpleButtonEvent");