import * as hz from 'horizon/core';

class playerManager extends hz.Component<typeof playerManager> {
  static propsDefinition = {

    index : { type: hz.PropTypes.Number, default: 0 },
    localRunner : { type: hz.PropTypes.Entity },
  };

preStart() {
this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld,(player)=>{

  if (this.props.index === player.index.get()){
    this.props.localRunner?.owner.set(player);
  }

})

this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld,(player)=>{

  if (this.props.index === player.index.get()){
    this.props.localRunner?.owner.set(this.world.getServerPlayer());
  }

})
  }

  start() {

  }
}
hz.Component.register(playerManager);