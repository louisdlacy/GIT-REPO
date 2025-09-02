import * as hz from 'horizon/core';

export enum GameState {
  'Ready',	// Ready to start a match
  'Starting', // Starting the match, counting down
  'Playing', // Currently in a match
  'Ending', // Ending the match, counting down
  'Finished',	// The match was completed normally
};

export const Events = {
  gameStateChanged: new hz.LocalEvent<{ fromState: GameState, toState: GameState }>('gameStateChanged'),
  registerNewMatch: new hz.LocalEvent<{}>('registerNewMatch'),
  gameOver: new hz.LocalEvent<{}>('gameOver'),
  setGameState: new hz.LocalEvent<{newState: GameState}>('setGameState'),
}

export function playersEqual(a: hz.Player, b: hz.Player) : boolean{
  return a.id == b.id;
}

export class PlayerList {
  list: hz.Player[] = [];

  size(): number {
    return this.list.length;
  }

  add(p: hz.Player): void {
    if(!this.includes(p)) {
      this.list.push(p);
    }
  }

  includes(p: hz.Player): boolean {
    return this.indexOf(p) >= 0;
  }

  indexOf(p: hz.Player): number {
    for(let i = 0; i < this.list.length; ++i) {
      if(playersEqual(this.list[i], p)) {
        return i;
      }
    }
    return -1;
  }

  remove(p: hz.Player): void {
      const i = this.indexOf(p);
      if(i >= 0) {
          this.list.splice(i, 1);
      }
  }
}

export class MatchPlayers {
  all: PlayerList = new PlayerList();
  inLobby: PlayerList = new PlayerList();
  inMatch: PlayerList = new PlayerList();

  isInLobby(p: hz.Player): boolean {
    return this.inLobby.includes(p);
  }

  isInMatch(p: hz.Player): boolean {
    return this.inMatch.includes(p);
  }

  playersInLobby(): number {
    return this.inLobby.size();
  }

  playersInMatch(): number {
    return this.inMatch.size();
  }

  playersInWorld(): number {
    return this.all.size();
  }

  getPlayersInLobby(): PlayerList {
    return this.inLobby;
  }

  getPlayersInMatch(): PlayerList {
    return this.inMatch;
  }

  moveToLobby(p: hz.Player): void {
    if(!this.all.includes(p)) {
      this.all.add(p);
    }

    if(!this.inLobby.includes(p)) {
      this.inLobby.add(p);
    }

    if(this.inMatch.includes(p)) {
      this.inMatch.remove(p);
    }
  }

  moveToMatch(p: hz.Player): void {
    if(!this.all.includes(p)) {
      this.all.add(p);
    }

    if(!this.inMatch.includes(p)) {
      this.inMatch.add(p);
    }

    if(this.inLobby.includes(p)) {
      this.inLobby.remove(p);
    }
  }

  addNewPlayer(p: hz.Player): void {
    this.moveToLobby(p);
  }

  removePlayer(p: hz.Player): void {
    if(this.all.includes(p)) {
      this.all.remove(p);
    }

    if(this.inLobby.includes(p)) {
      this.inLobby.remove(p);
    }

    if(this.inMatch.includes(p)) {
      this.inMatch.remove(p);
    }
  }
}

export default Events;
