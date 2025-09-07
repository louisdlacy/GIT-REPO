"use strict";
// MAKE THIS SCRIPT RUN LOCAL
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class FiringController extends core_1.Component {
    start() {
        const owner = this.entity.owner.get();
        //When the server owns the weapon, ignore the script
        if (owner === this.world.getServerPlayer()) {
            console.log("Script owned by Server Player");
        }
        else {
            // Connect to the grab event to cleanup when the weapon is dropped
            this.grabbingEventSub = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onWeaponGrabbed.bind(this));
            // Connect to the grab event to cleanup when the weapon is dropped
            this.droppingEventSub = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onWeaponDropped.bind(this));
        }
        // Hide the laser pointer ball from everyone
        this.props.laserPointer?.setVisibilityForPlayers([], core_1.PlayerVisibilityMode.HiddenFrom);
    }
    onWeaponGrabbed(isRightHand, player) {
        console.log(`${this.entity.name.get()}> was grabbed by <${player.name.get()}`);
        // Setup local variables
        this.projLaunchGizmo = this.props.projectileLauncher?.as(core_1.ProjectileLauncherGizmo);
        this.projLaunchGizmo.projectileGravity.set(this.props.projectileGravity);
        this.lastShottimestamp = 0;
        this.ammoLeft = this.props.ammoPerClip;
        this.totalAmmo = this.props.totalAmmo;
        this.updateAmmoDisplay();
        // Assign the projectile launcher to the player
        this.projLaunchGizmo.owner.set(this.entity.owner.get());
        //Connect to the player's input
        // Aim
        this.connectedAimInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.LeftTrigger, core_1.ButtonIcon.Aim, this);
        this.connectedAimInput.registerCallback(this.onPlayerAiming.bind(this));
        // Shoot
        this.connectedFireInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightTrigger, core_1.ButtonIcon.Fire, this);
        this.connectedFireInput.registerCallback(this.onPlayerFire.bind(this));
        // Reload
        this.connectedReloadInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightPrimary, core_1.ButtonIcon.Reload, this);
        this.connectedReloadInput.registerCallback(this.onPlayerReload.bind(this));
    }
    onWeaponDropped(player) {
        // Disconnect event subscriptions so we don't get events
        // when the player is not holding this weapon
        console.log("Cleaning after dropping the pistol");
        this.projLaunchGizmo.owner.set(this.world.getServerPlayer());
        this.connectedAimInput?.disconnect();
        this.connectedFireInput?.disconnect();
        this.aimingEventSub.disconnect();
    }
    onPlayerAiming(action, pressed) {
        // Only support the "laser dot" with VR controllers
        if (this.entity.owner.get().deviceType.get() != core_1.PlayerDeviceType.VR)
            return;
        // There seems to be an issue where hiding things from players only work later after load.
        // Only setting this up here to avoid it.
        this.props.laserPointer?.visible.set(pressed);
        // Hide the laser pointer if we're not aiming
        if (!pressed)
            this.props.laserPointer?.setVisibilityForPlayers([], core_1.PlayerVisibilityMode.HiddenFrom);
        if (pressed && this.props.useLaserTargeting) {
            this.aimingEventSub = this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdateAim.bind(this));
        }
        else {
            this.aimingEventSub?.disconnect();
        }
    }
    onPlayerFire(action, pressed) {
        // Fire on button down only
        if (!pressed)
            return;
        // Check if we have ammo and if the cooldown has passed
        if (this.ammoLeft > 0 && Date.now() > this.lastShottimestamp + this.props.projectileLauncherCooldownMs) {
            this.lastShottimestamp = Date.now();
            this.projLaunchGizmo.launchProjectile(this.props.projectileSpeed);
            this.props.gunFireSFX?.as(core_1.AudioGizmo)?.play();
            this.props.smokeFX?.as(core_1.ParticleGizmo)?.play();
            this.ammoLeft -= 1;
            this.updateAmmoDisplay();
        }
        else {
            console.log("Still cooling down");
        }
    }
    onPlayerReload(action, pressed) {
        // Reload on button up
        if (!pressed) {
            this.props.gunReloadSFX?.as(core_1.AudioGizmo)?.play();
            var ammoToReload = Math.min(this.props.totalAmmo - this.ammoLeft, this.props.ammoPerClip - this.ammoLeft);
            this.ammoLeft += ammoToReload;
            this.totalAmmo -= ammoToReload;
            this.updateAmmoDisplay();
        }
    }
    onUpdateAim(data) {
        if (this.props.projectileLauncher && this.props.laserGizmo) {
            // Get position and orientation directly from the raycast gizmo and use the raycast to get a target
            const raycastPosition = this.props.laserGizmo.position.get();
            const raycastForward = this.props.laserGizmo.forward.get();
            const laserGizmo = this.props.laserGizmo.as(core_1.RaycastGizmo);
            var raycastHit = laserGizmo?.raycast(raycastPosition, raycastForward, { layerType: core_1.LayerType.Both, maxDistance: 100 });
            if (raycastHit) {
                this.props.laserPointer?.setVisibilityForPlayers([this.entity.owner.get()], core_1.PlayerVisibilityMode.VisibleTo);
                this.props.laserPointer?.position.set(raycastHit.hitPoint);
                if (raycastHit.targetType == core_1.RaycastTargetType.Player) {
                    this.props.laserPointer?.color.set(core_1.Color.red);
                }
                if (raycastHit.targetType == core_1.RaycastTargetType.Entity) {
                    this.props.laserPointer?.color.set(core_1.Color.green);
                }
            }
            else {
                this.props.laserPointer?.setVisibilityForPlayers([this.entity.owner.get()], core_1.PlayerVisibilityMode.HiddenFrom);
            }
        }
    }
    updateAmmoDisplay() {
        this.props.clipAmmoDisplay?.as(core_1.TextGizmo)?.text.set(this.ammoLeft.toString());
        this.props.totalAmmoDisplay?.as(core_1.TextGizmo)?.text.set(this.totalAmmo.toString());
    }
}
FiringController.propsDefinition = {
    projectileLauncher: { type: core_1.PropTypes.Entity },
    ammoPerClip: { type: core_1.PropTypes.Number, default: 17 },
    clipAmmoDisplay: { type: core_1.PropTypes.Entity },
    totalAmmo: { type: core_1.PropTypes.Number, default: 300 },
    totalAmmoDisplay: { type: core_1.PropTypes.Entity },
    laserGizmo: { type: core_1.PropTypes.Entity },
    laserPointer: { type: core_1.PropTypes.Entity },
    smokeFX: { type: core_1.PropTypes.Entity },
    gunFireSFX: { type: core_1.PropTypes.Entity },
    gunReloadSFX: { type: core_1.PropTypes.Entity },
    projectileLauncherCooldownMs: { type: core_1.PropTypes.Number, default: 1000 },
    projectileSpeed: { type: core_1.PropTypes.Number, default: 10 },
    projectileGravity: { type: core_1.PropTypes.Number, default: 0 },
    useLaserTargeting: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(FiringController);
