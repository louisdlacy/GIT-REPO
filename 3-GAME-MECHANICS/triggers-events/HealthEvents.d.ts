import { Entity, LocalEvent } from 'horizon/core';
export declare const HealthZeroEvent: LocalEvent<{
    entity: Entity;
}>;
export declare const DamageEvent: LocalEvent<{
    amount: number;
}>;
