import * as hz from 'horizon/core';
import { CameraEvents } from './PlayerCamera';

class Server extends hz.Component<typeof Server> {
  static propsDefinition = {
    firstPersonTrigger:
    {
      type: hz.PropTypes.Entity
    },
    thirdPersonCamera: {
      type: hz.PropTypes.Entity
    },
    attachPersonCamera: {
      type: hz.PropTypes.Entity
    },
    attachObject: {
      type: hz.PropTypes.Entity
    },
    panCamera: {
      type: hz.PropTypes.Entity
    }
  };

  preStart(): void {
    if(this.props.firstPersonTrigger) this.connectCodeBlockEvent(this.props.firstPersonTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.firstPerson(player))
    if(this.props.thirdPersonCamera) this.connectCodeBlockEvent(this.props.thirdPersonCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.thirdPerson(player))
    if(this.props.attachPersonCamera) this.connectCodeBlockEvent(this.props.attachPersonCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.attachPerson(player))
    if(this.props.panCamera) this.connectCodeBlockEvent(this.props.panCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.panPerson(player))
  }

  start() {

  }

  firstPerson(player: hz.Player) {
    // Handle first person camera logic here
    this.sendNetworkEvent(player, CameraEvents.firstPerson, {})
  }

  thirdPerson(player: hz.Player) {
    // Handle third person camera logic here
    this.sendNetworkEvent(player, CameraEvents.thirdPerson, {})
  }

  attachPerson(player: hz.Player) {
    // Handle attach person camera logic here
    if(this.props.attachObject) this.sendNetworkEvent(player, CameraEvents.attachPerson, {target: this.props.attachObject})
  }

  panPerson(player: hz.Player) {
    // Handle pan camera logic here
    this.sendNetworkEvent(player, CameraEvents.panPerson, {})
  }
}
hz.Component.register(Server);