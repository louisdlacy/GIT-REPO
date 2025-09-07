"use strict";
// MAKE THIS SCRIPT RUN LOCAL
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class LaserGun extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isHitting = false;
    }
    start() {
        const owner = this.entity.owner.get();
        //When the server owns the weapon, ignore the script
        if (owner === this.world.getServerPlayer()) {
            console.log("Script owned by Server Player");
        }
        else {
            // Initialize the weapon when grabbging it
            this.grabbingEventSub = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onWeaponGrabbed.bind(this));
            // Connect to the grab event to cleanup when the weapon is dropped
            this.droppingEventSub = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, (player) => {
                this.cleanupSubscriptions();
            });
        }
    }
    onWeaponGrabbed(isRightHand, player) {
        console.log(`${this.entity.name.get()}> was grabbed by <${player.name.get()}`);
        //Connect to the player's shooting input
        this.connectedFireInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightTrigger, core_1.ButtonIcon.Fire, this);
        this.connectedFireInput.registerCallback(this.onPlayerFire.bind(this));
        // Connect to audio end event to loop sounds
        // Shooting loop
        var laserSoundGizmo = this.props.laserBeamSFX?.as(core_1.AudioGizmo);
        if (laserSoundGizmo) {
            this.firingAudioEventSub = this.connectCodeBlockEvent(laserSoundGizmo, // Make sure this Entity is an AudioGizmo.
            core_1.CodeBlockEvents.OnAudioCompleted, this.playLaserSound.bind(this));
        }
        // Hitting loop
        var laserHitSoundGizmo = this.props.laserBeamHitSFX?.as(core_1.AudioGizmo);
        if (laserHitSoundGizmo) {
            this.hitAudioEventSub = this.connectCodeBlockEvent(laserHitSoundGizmo, // Make sure this Entity is an AudioGizmo.
            core_1.CodeBlockEvents.OnAudioCompleted, this.playLaserHitSound.bind(this));
        }
    }
    cleanupSubscriptions() {
        // Disconnect event subscriptions so we don't get events
        // when the player is not holding this weapon
        console.log("Cleaning after dropping the laser weapon");
        this.connectedFireInput?.disconnect();
        this.firingEventSub?.disconnect();
        this.firingAudioEventSub?.disconnect();
        this.hitAudioEventSub?.disconnect();
    }
    onPlayerFire(action, pressed) {
        this.props.laserBeam?.visible.set(pressed);
        this.playLaserSound();
        if (pressed) {
            this.firingEventSub = this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onLaserUpdate.bind(this));
        }
        else {
            this.firingEventSub?.disconnect();
            this.props.laserBeamHitVFX?.as(core_1.ParticleGizmo)?.stop();
        }
    }
    onLaserUpdate(data) {
        if (this.props.laserProjector) {
            // Get position and orientation directly from the raycast gizmo and use the raycast to get a target
            const raycastPosition = this.props.laserProjector.position.get();
            const raycastForward = this.props.laserProjector.forward.get();
            const laserGizmo = this.props.laserProjector.as(core_1.RaycastGizmo);
            var raycastHit = laserGizmo?.raycast(raycastPosition, raycastForward, { layerType: core_1.LayerType.Both });
            var laserLength = this.props.maxLaserLength;
            if (raycastHit && raycastHit.distance <= this.props.maxLaserLength) {
                laserLength = raycastHit.distance;
                if (!this.isHitting) {
                    this.isHitting = true;
                    this.props.laserBeamHitVFX?.as(core_1.ParticleGizmo)?.play();
                    this.props.laserBeamHitSFX?.as(core_1.AudioGizmo)?.play();
                }
                if (raycastHit.targetType == core_1.RaycastTargetType.Entity) {
                    this.props.laserBeamHitVFX?.position.set(raycastHit.hitPoint);
                    this.props.laserBeamHitSFX?.position.set(raycastHit.hitPoint);
                    var hitEntity = raycastHit.target.as(core_1.PhysicalEntity);
                    if (hitEntity) {
                        hitEntity.applyForce(raycastHit.normal.mulInPlace(-data.deltaTime * this.props.laserBeamPushPower), core_1.PhysicsForceMode.VelocityChange);
                    }
                }
                if (raycastHit.targetType == core_1.RaycastTargetType.Player) {
                    // Don't do anything for now
                }
            }
            else {
                this.isHitting = false;
                this.props.laserBeamHitVFX?.as(core_1.ParticleGizmo)?.stop();
            }
            if (this.props.laserBeam) {
                var thisEntityScaleY = this.entity.scale.get().y;
                var laserBeamScale = this.props.laserBeam.scale.get();
                laserBeamScale.x = this.props.laserBeamWidth;
                laserBeamScale.y = laserLength / thisEntityScaleY;
                laserBeamScale.z = this.props.laserBeamWidth;
                this.props.laserBeam.scale.set(laserBeamScale);
                this.props.laserBeam.color.set(core_1.Color.red);
                this.props.laserBeam.moveRelativeTo(this.entity, new core_1.Vec3(0, laserLength / (2 * thisEntityScaleY), 0));
            }
        }
    }
    playLaserSound() {
        if (this.props.laserBeam?.visible.get()) {
            this.props.laserBeamSFX?.as(core_1.AudioGizmo)?.play();
        }
        else {
            this.props.laserBeamHitSFX?.as(core_1.AudioGizmo)?.stop();
        }
    }
    playLaserHitSound() {
        if (this.isHitting) {
            this.props.laserBeamSFX?.as(core_1.AudioGizmo)?.play();
        }
        else {
            this.props.laserBeamSFX?.as(core_1.AudioGizmo)?.stop();
        }
    }
}
LaserGun.propsDefinition = {
    maxLaserLength: { type: core_1.PropTypes.Number, default: 10 },
    laserProjector: { type: core_1.PropTypes.Entity },
    laserBeam: { type: core_1.PropTypes.Entity },
    laserBeamWidth: { type: core_1.PropTypes.Number, default: 0.2 },
    laserBeamPushPower: { type: core_1.PropTypes.Number, default: 100 },
    laserBeamSFX: { type: core_1.PropTypes.Entity },
    laserBeamHitSFX: { type: core_1.PropTypes.Entity },
    laserBeamHitVFX: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(LaserGun);
