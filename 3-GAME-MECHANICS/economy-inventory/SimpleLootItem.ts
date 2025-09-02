import * as hz from 'horizon/core';
import { WorldInventory } from 'horizon/core';

export const SimpleLootItemEvents = {
  OnPickupLoot: new hz.NetworkEvent<{player: hz.Player, sku: string, count: number}>('OnPickupLoot'),
}

class SimpleLootItem extends hz.Component<typeof SimpleLootItem> {
  static propsDefinition = {
    active: {type: hz.PropTypes.Boolean, default: true},

    mesh: {type: hz.PropTypes.Entity},
    pfx: {type: hz.PropTypes.Entity},
    light: {type: hz.PropTypes.Entity},

    animRotationFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobAmplitude: {type: hz.PropTypes.Number, default: 0.1},

    lootSKU: {type: hz.PropTypes.String, default: ''},
    lootCount: {type: hz.PropTypes.Number, default: 1},

    respawnEnabled: {type: hz.PropTypes.Boolean, default: true},
    respawnDelay: {type: hz.PropTypes.Number, default: 10},
  };

  private updateIntervalId: number = -1;
  private updateDelayS: number = 0.1;
  private update: (deltaTime: number)=>void = (deltaTime)=>{};

  private elapsed: number = 0;
  private active: boolean = true;

  private respawnRemaining: number = -1;

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
      this.onTriggerEnter(enteredBy);
    })
  }

  start() {

    this.active = this.props.active || false;
    if (this.active){
      // Set the update method to point to the animateMesh method
      this.update = this.animateMesh;
    }

    // Repeatedly call this.update every this.updateDelayS seconds (0.1s by default)
    this.updateIntervalId = this.async.setInterval(() => {
      this.update(this.updateDelayS)
    }, this.updateDelayS * 1000);
  }

  awaitRespawn(deltaTime: number) {
    this.respawnRemaining -= deltaTime;
    if (this.respawnRemaining <= 0) {
      this.activate();
    }
  }

  animateMesh(deltaTime: number) {
    if (this.props.mesh === undefined || this.props.mesh === null) {
      return;
    }

    this.elapsed += deltaTime;

    // Rotation
    const animRotationTheta = this.elapsed * this.props.animRotationFrequency * Math.PI * 2;
    this.props.mesh.rotateRelativeTo(this.entity, hz.Quaternion.fromAxisAngle(this.props.mesh.up.get(), animRotationTheta), hz.Space.World);

    // Position
    const animPositionDelta = Math.sin(this.elapsed * this.props.animBobFrequency) * this.props.animBobAmplitude;
    this.props.mesh.moveRelativeTo(this.entity, this.props.mesh.up.get().mul(animPositionDelta), hz.Space.Local);

  }

  onTriggerEnter(player: hz.Player) {
    if (this.active) {
      WorldInventory.grantItemToPlayer(player, this.props.lootSKU, this.props.lootCount);
      this.sendNetworkBroadcastEvent(SimpleLootItemEvents.OnPickupLoot, {player, sku: this.props.lootSKU, count: this.props.lootCount});
      this.deactivate();
    }
  }

  activate(){
    this.active = true;
    this.entity.as(hz.TriggerGizmo).enabled.set(true);
    this.props.mesh?.visible.set(true);
    this.props.pfx?.as(hz.ParticleGizmo).play();
    this.props.light?.as(hz.DynamicLightGizmo).enabled.set(true);
    this.update = this.animateMesh;
  }

  deactivate(){
    this.active = false;
    this.entity.as(hz.TriggerGizmo).enabled.set(false);
    this.props.mesh?.visible.set(false);
    this.props.pfx?.as(hz.ParticleGizmo).stop();
    this.props.light?.as(hz.DynamicLightGizmo).enabled.set(false);

    // If respawn is enabled, start the timer to delay the respawn
    if (this.props.respawnEnabled) {
      this.respawnRemaining = this.props.respawnDelay;
      this.update = this.awaitRespawn;
    } else {
      this.async.clearInterval(this.updateIntervalId);
      this.updateIntervalId = -1;
    }
  }
}
hz.Component.register(SimpleLootItem);
