// Copyright (c) Richard Lee (Shards632). Released under the MIT License.

import { NetworkEvent } from "horizon/core";

/**
 * Events that are shared between ammo boxes, guns, and targets.
 */
export const Events = {
  // send from ammo box when a player picks it up
  pickupAmmo: new NetworkEvent<{ ammoType: string, amount: number }>('shardsPickupAmmo'),
  // send from the gun to the target it hit
  ammoHit: new NetworkEvent<{ damage: number }>('shardsAmmoHit'),
}