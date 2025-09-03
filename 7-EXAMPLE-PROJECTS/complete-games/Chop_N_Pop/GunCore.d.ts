import { Behaviour } from "Behaviour";
import { HapticHand } from "HapticFeedback";
import { EventSubscription, Player, Vec3 } from "horizon/core";
declare enum AnimationState {
    open = "open",
    closed = "closed"
}
type GunConfig = {
    fireRate: number;
    fireSpeed: number;
    maxAmmo: number;
    burstCount: number;
    reloadTime: number;
    upwardsRecoilVel: number;
    upwardsRecoilAcc: number;
    backwardsRecoilVel: number;
    backwardsRecoilAcc: number;
};
export declare class GunCore extends Behaviour<typeof GunCore> {
    static propsDefinition: {
        projectileLauncher: {
            type: "Entity";
        };
        mode: {
            type: "number";
            default: number;
        };
        slide: {
            type: "Entity";
        };
        slidePosition: {
            type: "Vec3";
        };
        slideRotation: {
            type: "Quaternion";
        };
        ammoDisplay: {
            type: "Entity";
        };
        fireSFX: {
            type: "Entity";
        };
        reloadSFX: {
            type: "Entity";
        };
        grabSFX: {
            type: "Entity";
        };
        dryFireSFX: {
            type: "Entity";
        };
        dropShellSFX: {
            type: "Entity";
        };
        dropShellMinDelay: {
            type: "number";
            default: number;
        };
        dropShellRandomDelay: {
            type: "number";
            default: number;
        };
        clip: {
            type: "Entity";
        };
        muzzleFlash: {
            type: "Entity";
        };
        playerManager: {
            type: "Entity";
        };
    };
    gunConfig: GunConfig;
    AnimateTo: any;
    currentAmmo: number;
    currentOwner?: Player;
    slideOriginalPosition: Vec3;
    clipOriginalPosition: Vec3;
    triggerHeld: boolean;
    fireWait: boolean;
    fireQueue: boolean;
    isHeld: boolean;
    isReloading: boolean;
    inCooldown: boolean;
    reloadAvailable: boolean;
    isOnVr: boolean;
    state: {
        isAmmoOpen: boolean;
    };
    upwardsRecoilDis: number;
    backwardsRecoilDis: number;
    upwardsRecoilVel: number;
    backwardsRecoilVel: number;
    upwardsRecoilAcc: number;
    backwardsRecoilAcc: number;
    slidePosition: AnimationState;
    clipPositionState: AnimationState;
    playerHand?: HapticHand;
    triggerDownSubscription?: EventSubscription;
    triggerReleasedSubscription?: EventSubscription;
    reloadSubscription?: EventSubscription;
    private currentBurstCount;
    Awake(): void;
    Start(): void;
    OnGrabStart(isRight: boolean, player: Player): void;
    OnGrabEnd(player: Player): void;
    private initializeGunConfig;
    private fireWeapon;
    private shouldFireMore;
    Update(deltaTime: number): void;
    private endFireWait;
    private reload;
    private ammoOutFX;
    private refillAmmo;
    private updateclipPosition;
    private kickbackEffect;
    private updateSlidePosition;
    private triggerDown;
    private triggerReleased;
    private updateAmmoDisplay;
}
export {};
