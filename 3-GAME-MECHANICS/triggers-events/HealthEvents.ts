import { Entity, LocalEvent } from 'horizon/core';

// Event to broadcast when health reaches zero
export const HealthZeroEvent = new LocalEvent<{ entity: Entity }>();

// Event to apply damage
export const DamageEvent = new LocalEvent<{ amount: number }>();
