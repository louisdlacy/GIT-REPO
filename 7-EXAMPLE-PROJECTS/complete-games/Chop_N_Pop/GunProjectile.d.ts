import { Behaviour } from "Behaviour";
import { Entity, Vec3 } from "horizon/core";
export declare class GunProjectile extends Behaviour<typeof GunProjectile> {
    static propsDefinition: {
        hitSFX: {
            type: "Entity";
        };
        missSFX: {
            type: "Entity";
        };
    };
    sfxDelayTimeMs: number;
    private sfxDelays;
    Awake(): void;
    handleHit(itemHit: Entity, position: Vec3, normal: Vec3, headshot?: boolean): void;
}
