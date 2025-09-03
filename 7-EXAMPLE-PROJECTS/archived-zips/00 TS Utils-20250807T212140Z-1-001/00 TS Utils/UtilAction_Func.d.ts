import { AudioGizmo, Entity, HapticSharpness, HapticStrength, ParticleGizmo, Player, Vec3 } from "horizon/core";
export declare const actionUtils: {
    playSFX: typeof playSFX;
    playSFXForDuration: typeof playSFXForDuration;
    playVFX: typeof playVFX;
    playVFXForDuration: typeof playVFXForDuration;
    playHaptics: typeof playHaptics;
};
declare function playSFX(fx: Entity | AudioGizmo | undefined | null, pos: Vec3 | undefined, players?: Player[] | undefined): void;
declare function playSFXForDuration(fx: Entity | AudioGizmo | undefined | null, pos: Vec3 | undefined, durationSeconds: number): Promise<void>;
declare function playVFX(fx: Entity | ParticleGizmo | undefined | null, pos: Vec3 | undefined): void;
declare function playVFXForDuration(fx: Entity | ParticleGizmo | undefined | null, pos: Vec3 | undefined, durationSeconds: number): Promise<void>;
/**
 * Play haptics on a player
 * @param player to feel haptic rumble
 * @param haptics [duration in ms, haptic strength, haptic sharpness]
 * @param isRightHand use undefined to play on both hands
 */
declare function playHaptics(player: Player, haptics: [number, HapticStrength, HapticSharpness], isRightHand?: boolean | undefined): void;
export {};
