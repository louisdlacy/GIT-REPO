import { Asset, Entity, Player } from 'horizon/core';
import { ImageStyle } from 'horizon/ui';
export declare class PlayerData {
    player: Player;
    isInvincible: boolean;
    ammo: number;
    hp: number;
    initialHp: number;
    initialAmmo: number;
    hud: Entity | null | undefined;
    constructor(player: Player, ammo: number, hp: number);
    reset(): void;
}
export declare class GamePlayers {
    all: Map<Player, PlayerData>;
    inLobby: Set<number>;
    inMatch: Set<number>;
    get(p: Player): PlayerData | undefined;
    addAmmo(p: Player, amount: number): void;
    takeDamage(p: Player, amount: number): number;
    setInvincible(p: Player, isInvincible: boolean): boolean;
    heal(p: Player, amount: number, max: number): number;
    revive(p: Player): void;
    isInLobby(p: Player): boolean;
    isInMatch(p: Player): boolean;
    playersInLobby(): number;
    playersInMatch(): number;
    playersInWorld(): number;
    getPlayersInLobby(): PlayerData[];
    getPlayersInMatch(): PlayerData[];
    moveToLobby(p: Player): void;
    moveToMatch(p: Player): void;
    addNewPlayer(p: PlayerData): PlayerData;
    removePlayer(p: Player): void;
    resetAllPlayers(): void;
}
export declare function loadImageFromTexture(asset: Asset, style: ImageStyle): import("horizon/ui").UINode<import("horizon/ui").ImageProps>;
export type UITextureProps = {
    textureAsset: Asset;
};
