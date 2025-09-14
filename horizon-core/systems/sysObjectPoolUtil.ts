//Feature Labs 

import { Asset, Entity, NetworkEvent } from "horizon/core";

export const objectPoolRequest = new NetworkEvent<{requesterEntity: Entity, assetId: string, amount: number}>("objectPoolRequest");
export const objectPoolResponse = new NetworkEvent<{response: Entity[]}>("objectPoolResponse");
export const returnObjectToPool = new NetworkEvent<{obj: Entity}>("returnObjectToPool");
export const returnObjectsToPool = new NetworkEvent<{objs: Entity[]}>("returnObjectsToPool");

// This is a helper class for Object Pooling
export class Pool<T> {
  all:T[] = [];
  available:T[] = [];
  active:T[] = [];

  hasAvailable(): boolean {
    return this.available.length > 0;
  }

  //spawning items takes time so if we're close to limit we can spawn more items before we run out
  needsMore(): boolean { 
    return this.available.length < 2;
  }

  hasActive(): boolean {
    return this.active.length > 0;
  }

  isAvailable(t: T): boolean {
    return this.available.includes(t);
  }

  getNextAvailable(): T | null {
    if(this.hasAvailable()) {
      const available = this.available.shift()!;
      if(!this.active.includes(available)) {
        this.active.push(available);
      }
      return available;
    } else {
      return null;
    }
  }

  getRandomAvailable(): T | null {
    if(this.hasAvailable()) {
      const rand = Math.floor(Math.random() * this.available.length);
      const available = this.available.splice(rand,1)[0]!;
      if(!this.active.includes(available)) {
        this.active.push(available);
      }
      return available;
    } else {
      return null;
    }
  }

  getRandomActive(): T | null {
    if(this.hasActive()) {
      const rand = Math.floor(Math.random() * this.active.length);
      const active = this.active.splice(rand,1)[0]!;
      return active;
    } else {
      return null;
    }
  }

  //Add an object to the pool or back to the pool, if it already exists, it will not be added again
  addToPool(t: T): void {
    if(!this.all.includes(t)) {
      this.all.push(t);
    }

    if(!this.available.includes(t)) {
      this.available.push(t);
    }

    if(this.active.includes(t)) {
      this.active.splice(this.active.indexOf(t),1);
    }
  }

  //When you use a getNextAvailable, you should call this to remove it from the pool
  removeFromPool(t:T): void {
    if(this.active.includes(t)) {
      this.active.splice(this.active.indexOf(t),1);
    }

    if(this.available.includes(t)) {
      this.available.splice(this.available.indexOf(t),1);
    }

    if(this.all.includes(t)) {
      this.all.splice(this.all.indexOf(t),1);
    }
  }

  resetAvailability(): void {
    this.available = this.all.slice();
  }
}


