"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class LocalManager extends core_1.Component {
    preStart() {
        this.props.local?.owner?.set(this.entity.owner.get());
    }
    start() { }
}
LocalManager.propsDefinition = {
    local: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(LocalManager);
class ShoulderPet extends core_1.Component {
    constructor() {
        super(...arguments);
        this.shouldShow = false;
        this.timeElapsed = 0;
        this.maxTime = 2;
    }
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        if (this.owner === this.serverPlayer) {
            return;
        }
        this.shoulderAnchor = this.props.shoulderAnchor;
        this.pet = this.props.pet;
        this.entity.visible.set(false);
        this.entity.as(core_1.AttachableEntity).attachToPlayer(this.entity.owner.get(), core_1.AttachablePlayerAnchor.Torso);
        const showPetInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightPrimary, core_1.ButtonIcon.Ability, this);
        showPetInput.registerCallback((action, pressed) => {
            if (pressed) {
                this.shouldShow = !this.shouldShow;
                this.entity.visible.set(this.shouldShow);
            }
        });
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => {
            if (!this.shouldShow) {
                return;
            }
            this.timeElapsed = (this.timeElapsed + data.deltaTime) % this.maxTime;
            const alpha = (this.timeElapsed / this.maxTime);
            const y = Math.sin(alpha * Math.PI * 2) * 0.1; // Oscillate up and down
            const newPosition = this.shoulderAnchor?.position.get().add(new core_1.Vec3(0, y, 0)) ?? core_1.Vec3.zero;
            this.pet?.position.set(newPosition);
        });
    }
    start() {
    }
}
ShoulderPet.propsDefinition = {
    shoulderAnchor: { type: core_1.PropTypes.Entity },
    pet: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ShoulderPet);
