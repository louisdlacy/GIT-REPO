import * as hz from 'horizon/core';
import {objPoolSpawnControllerSpawnEvent, objPoolSpawnControllerDespawnEvent} from 'SpawnControllerManager'
import { DISPLAY_CONSOLE_SPAWNCONTROLLER } from 'SpawnControllerManager';

class SpawnControllerTrigger extends hz.Component<typeof SpawnControllerTrigger> {
    static propsDefinition = {
      // Entity/object to spawn upon trigger. This is usually an object
      // with attached SpawnControllerManager script
      target: {type: hz.PropTypes.Entity}, // SpawnControllerManager object, which has SpawnControllerTrigger.ts script attached and assetToSpawn prop set to RedHeart
    };
  
    start() {
//      console.log("SpawnController trigger script called");

      if(this.props.target == undefined){
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {console.error("SpawnControllerTrigger doesn't have a target defined");};
        return;
      }
  
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, ()=>{
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {console.log("Player entering Spawn Controller trigger");};
        if(this.props.target == undefined) {
          if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {console.error("target undefined on SpawnController OnPlayerEnterTrigger. Unable to spawn");};
          return;
        }
        this.sendLocalEvent(this.props.target, objPoolSpawnControllerSpawnEvent, {position: this.props.target.position.get()});
      });
  
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, ()=>{
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {console.log("Player exiting SpawnController Trigger");};
        if(this.props.target == undefined) {
          if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {console.error("target undefined on SpawnControllerTrigger OnPlayerExitTrigger. Unable to de-spawn");};
          return;
        }
        this.sendLocalEvent(this.props.target, objPoolSpawnControllerDespawnEvent, {position: this.props.target.position.get()});
      });
    }

  }
hz.Component.register(SpawnControllerTrigger);