import * as hz from 'horizon/core';
import {despawnTriggerEvent, spawnTriggerEvent} from 'SimpleSpawn'
import { DISPLAY_CONSOLE_SIMPLESPAWN } from 'SimpleSpawn';

class SpawnningTrigger extends hz.Component<typeof SpawnningTrigger> {
  static propsDefinition = {
    // Entity/object to spawn upon trigger. This is usually an object
    // with attached SpawnManager script
    target: {type: hz.PropTypes.Entity},
  };

  start() {

    if(this.props.target == undefined){
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {console.error("SimpleSpawn: SpawnningTrigger doesn't have a target defined");};
      return;
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, ()=>{
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {console.log("SimpleSpawn: Player entering Spawnning Trigger");};
      if(this.props.target == undefined) return;
      this.sendLocalEvent(this.props.target, spawnTriggerEvent, {position: this.props.target.position.get()});
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, ()=>{
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {console.log("SimpleSpawn: Player exiting Spawning Trigger");};
      if(this.props.target == undefined) return;
      this.sendLocalEvent(this.props.target, despawnTriggerEvent, {});
    });
  }

}
hz.Component.register(SpawnningTrigger);
