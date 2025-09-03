"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HealthEvents_1 = require("HealthEvents");
const core_1 = require("horizon/core");
class ChickenWhacker extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hitBoxOffset = core_1.Vec3.zero;
        this.touchedEntities = new Set();
        this.onTouchStart = (entity) => {
            //console.log(`Entity ${entity.name} touched the hitbox.`);
            if (this.touchedEntities.has(entity)) {
                return;
            }
            this.touchedEntities.add(entity);
        };
        this.onTouchEnd = (entity) => {
            this.touchedEntities.delete(entity);
        };
        this.onSwing = (player) => {
            player.playAvatarGripPoseAnimationByName(core_1.AvatarGripPoseAnimationNames.Fire);
            this.sfx?.play();
            const entities = Array.from(this.touchedEntities.values());
            //console.log(entities);
            // Damage all entities currently in the hitbox
            for (const entity of entities) {
                //console.log(`Swing hit entity: ${entity.name.get()}`);
                this.sendNetworkEvent(entity, HealthEvents_1.DamageEvent, { amount: this.props.damage });
            }
        };
        this.onUpdate = () => {
            if (!this.owner || !this.hitBoxContainer) {
                return;
            }
            this.hitBoxContainer?.moveRelativeToPlayer(this.owner, core_1.PlayerBodyPartType.Head, this.hitBoxOffset, core_1.Space.Local);
            this.hitBoxContainer?.rotateRelativeToPlayer(this.owner, core_1.PlayerBodyPartType.Head, core_1.Quaternion.zero, core_1.Space.Local);
        };
    }
    start() {
        this.owner = this.entity.owner.get();
        this.hitBox = this.props.hitBox?.as(core_1.TriggerGizmo);
        this.hitBox?.owner.set(this.owner);
        this.hitBoxContainer = this.props.hitBoxContainer;
        this.hitBoxContainer?.owner.set(this.owner);
        this.sfx = this.props.sfx?.as(core_1.AudioGizmo);
        this.sfx?.owner.set(this.owner);
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        this.hitBoxOffset = core_1.Vec3.forward.mul(0.5).add(core_1.Vec3.down.mul(0.4));
        if (this.hitBox) {
            this.connectCodeBlockEvent(this.hitBox, core_1.CodeBlockEvents.OnEntityEnterTrigger, this.onTouchStart);
            this.connectCodeBlockEvent(this.hitBox, core_1.CodeBlockEvents.OnEntityExitTrigger, this.onTouchEnd);
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.onSwing);
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate);
    }
}
ChickenWhacker.propsDefinition = {
    hitBox: { type: core_1.PropTypes.Entity },
    hitBoxContainer: { type: core_1.PropTypes.Entity },
    sfx: { type: core_1.PropTypes.Entity },
    damage: { type: core_1.PropTypes.Number, default: 25 }
};
core_1.Component.register(ChickenWhacker);
