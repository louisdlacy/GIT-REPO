"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class HideItem extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hideSpots = [];
        this.lastHideSpotIndex = -1;
        this.onGrab = (isRightHand, player) => {
            this.foundVfx?.play();
            this.foundSfx?.play();
            this.world.ui.showPopupForEveryone(player.name.get() + ' found the lost item!', 3);
        };
        this.onRelease = () => {
            this.entity.collidable.set(false);
            this.world.ui.showPopupForEveryone('Find the lost item!', 3);
            this.hideItem();
        };
        this.firstHide = () => {
            if (this.hideSpots.length === 0) {
                console.warn('No hide spots found!');
                return;
            }
            this.lastHideSpotIndex = Math.floor(Math.random() * this.hideSpots.length);
            const hideSpot = this.hideSpots[this.lastHideSpotIndex];
            this.entity.position.set(hideSpot.position.get());
            this.entity.rotation.set(hideSpot.rotation.get());
        };
        this.hideItem = () => {
            if (this.hideSpots.length === 0) {
                console.warn('No hide spots available');
                return;
            }
            let newIndex;
            newIndex = Math.floor(Math.random() * this.hideSpots.length);
            if (newIndex === this.lastHideSpotIndex) { // Ensure we don't hide in the same spot
                newIndex = (newIndex + 1) % this.hideSpots.length;
            }
            this.hideVfx?.play();
            this.hideSfx?.play();
            this.lastHideSpotIndex = newIndex;
            this.entity.position.set(this.hideSpots[newIndex].position.get());
            this.entity.rotation.set(this.hideSpots[newIndex].rotation.get());
            this.entity.collidable.set(true);
        };
    }
    preStart() {
        this.foundVfx = this.props.foundVfx?.as(core_1.ParticleGizmo);
        this.foundSfx = this.props.foundSfx?.as(core_1.AudioGizmo);
        this.hideVfx = this.props.hideVfx?.as(core_1.ParticleGizmo);
        this.hideSfx = this.props.hideSfx?.as(core_1.AudioGizmo);
        this.hideSpots = this.world.getEntitiesWithTags(['HideSpot']);
        this.firstHide();
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease);
    }
    start() {
    }
}
HideItem.propsDefinition = {
    foundVfx: { type: core_1.PropTypes.Entity },
    foundSfx: { type: core_1.PropTypes.Entity },
    hideVfx: { type: core_1.PropTypes.Entity },
    hideSfx: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(HideItem);
