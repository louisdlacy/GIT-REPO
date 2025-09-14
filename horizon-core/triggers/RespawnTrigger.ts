import * as hz from 'horizon/core';

export class RespawnTrigger extends hz.Component<typeof RespawnTrigger> {
  static propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }, // Reference to your trigger gizmo
    respawnPoint: { type: hz.PropTypes.Entity }, // Reference to your spawn point gizmo/entity
  };

  private triggerEnter?: hz.EventSubscription;

  start() {
    if (this.props.triggerZone) {
      this.triggerEnter = this.connectCodeBlockEvent(
        this.props.triggerZone,
        hz.CodeBlockEvents.OnPlayerEnterTrigger,
        this.onPlayerEnterTrigger.bind(this)
      );
    }
  }

  private onPlayerEnterTrigger(player: hz.Player) {
    if (this.props.respawnPoint) {
      // Move the player to the respawn point's position
      player.position.set(this.props.respawnPoint.position.get());
      // Optionally reset velocity, play sound, etc.
      player.velocity.set(new hz.Vec3(0, 0, 0));
    }
  }

  dispose() {
    this.triggerEnter?.disconnect();
    super.dispose();
  }
}

hz.Component.register(RespawnTrigger); 