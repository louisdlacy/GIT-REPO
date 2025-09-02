// This is a helper class for Object Pooling
export class Pool<T> {
  all:T[] = [];
  available:T[] = [];
  active:T[] = [];

  hasAvailable(): boolean {
    return this.available.length > 0;
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
