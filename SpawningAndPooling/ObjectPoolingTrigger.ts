import * as hz from 'horizon/core';
import { objPoolDespawnTriggerEvent, objPoolSpawnTriggerEvent } from 'ObjectPooling';
import { DISPLAY_CONSOLE_OBJECTPOOLING } from 'ObjectPooling';

class ObjectPoolingTrigger extends hz.Component<typeof ObjectPoolingTrigger> {
  static propsDefinition = {
    // Entity/object to spawn upon trigger. This is usually an object
    // with attached SpawnManager script
    target: {type: hz.PropTypes.Entity}, // ObjectPoolingManager object, which has ObjectPooling.ts script attached and assetSpawn prop set to RedHeart
  };

  start() {
    // console.log("ObjectPooling: trigger script called");

    if(this.props.target == undefined){
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {console.error("ObjectPooling: Trigger doesn't have a target defined");};
      return;
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, ()=>{
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {console.log("ObjectPooling: Player entering trigger");};
      if(this.props.target == undefined) {
        if (DISPLAY_CONSOLE_OBJECTPOOLING) {console.error("ObjectPooling: target undefined on ObjectPoolingTrigger OnPlayerEnterTrigger. Unable to spawn");};
        return;
      }
      this.sendLocalEvent(this.props.target, objPoolSpawnTriggerEvent, {position: this.props.target.position.get()});
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, ()=>{
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {console.log("ObjectPooling: Player exiting Trigger");};
      if(this.props.target == undefined) {
        if (DISPLAY_CONSOLE_OBJECTPOOLING) {console.error("ObjectPooling: target undefined on ObjectPoolingTrigger OnPlayerExitTrigger. Unable to de-spawn");};
        return;
      }
      this.sendLocalEvent(this.props.target, objPoolDespawnTriggerEvent, {});
    });
  }
}
hz.Component.register(ObjectPoolingTrigger);
