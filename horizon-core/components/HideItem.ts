import { AudioGizmo, CodeBlockEvents, Component, Entity, ParticleGizmo, Player, PropTypes, Vec3 } from "horizon/core";

class HideItem extends Component<typeof HideItem> {
  static propsDefinition = {
    foundVfx: { type: PropTypes.Entity },
    foundSfx: { type: PropTypes.Entity },
    hideVfx: { type: PropTypes.Entity },
    hideSfx: { type: PropTypes.Entity }
  };

  foundVfx?: ParticleGizmo;
  foundSfx?: AudioGizmo;
  hideVfx?: ParticleGizmo;
  hideSfx?: AudioGizmo;

  hideSpots: Entity[] = [];
  lastHideSpotIndex = -1;

  preStart() {
    this.foundVfx = this.props.foundVfx?.as(ParticleGizmo);
    this.foundSfx = this.props.foundSfx?.as(AudioGizmo);
    this.hideVfx = this.props.hideVfx?.as(ParticleGizmo);
    this.hideSfx = this.props.hideSfx?.as(AudioGizmo);

    this.hideSpots = this.world.getEntitiesWithTags(['HideSpot']);

    this.firstHide();

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabStart, this.onGrab);

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd, this.onRelease);
  }

  start() {

  }

  onGrab = (isRightHand: boolean, player: Player) => {
    this.foundVfx?.play();
    this.foundSfx?.play();
    this.world.ui.showPopupForEveryone(player.name.get() + ' found the lost item!', 3);
  }

  onRelease = () => {
    this.entity.collidable.set(false);

    this.world.ui.showPopupForEveryone('Find the lost item!', 3);
    this.hideItem();
  }

  firstHide = () => {
    if (this.hideSpots.length === 0) {
      console.warn('No hide spots found!');
      return;
    }
    this.lastHideSpotIndex = Math.floor(Math.random() * this.hideSpots.length);
    const hideSpot = this.hideSpots[this.lastHideSpotIndex];
    this.entity.position.set(hideSpot.position.get());
    this.entity.rotation.set(hideSpot.rotation.get());
  }

  hideItem = () => {
    if (this.hideSpots.length === 0) {
      console.warn('No hide spots available');
      return;
    }

    let newIndex;
    newIndex = Math.floor(Math.random() * this.hideSpots.length);
    if (newIndex === this.lastHideSpotIndex) {// Ensure we don't hide in the same spot
      newIndex = (newIndex + 1) % this.hideSpots.length;
    }

    this.hideVfx?.play();
    this.hideSfx?.play();
    this.lastHideSpotIndex = newIndex;
    this.entity.position.set(this.hideSpots[newIndex].position.get());
    this.entity.rotation.set(this.hideSpots[newIndex].rotation.get());
    
    this.entity.collidable.set(true);
  }
}
Component.register(HideItem);