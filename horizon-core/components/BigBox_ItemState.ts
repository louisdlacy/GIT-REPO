import { BigBox_ItemBaseInfo } from 'BigBox_ItemBaseInfo';
import * as hz from 'horizon/core';

/**
 * Stores the state of an instance of an item
 */
export class BigBox_ItemState {
  public info: BigBox_ItemBaseInfo;
  public player: hz.Player
  public equipped: boolean = false

  private grabbable: hz.GrabbableEntity | null = null
  private loadingInProgress = false

  constructor (info: BigBox_ItemBaseInfo, player: hz.Player){
    this.info = info
    this.player = player

    if (info.props.model){
      this.loadingInProgress = true;

      info.world.spawnAsset(info.props.model, new hz.Vec3(0, -100, 0)).then((entities) => {
        let spawned = entities[0]

        spawned.owner.set(player)
        this.grabbable = spawned.as(hz.GrabbableEntity)
        spawned.visible.set(false)
        this.loadingInProgress = false

        if (this.equipped){
          this.equip()
        }
      })
    }
  }

  public equip(){
    if (this.grabbable && this.grabbable.interactionMode.get() === hz.EntityInteractionMode.Grabbable){
      this.grabbable.visible.set(true)
      this.grabbable.forceHold(this.player, hz.Handedness.Right, false) // currently does not support Horizon's build-in dropping
      this.equipped = true
    }
    else if (this.loadingInProgress){ // queue an equip
      this.equipped = true
    }
  }
  
  public unequip(){
    if (this.grabbable){ // note: if we call this before item spawn, the item will be orphaned
      this.grabbable.forceRelease()
      this.grabbable.position.set(new hz.Vec3(0, -100, 0))
      this.grabbable.visible.set(false)
    }

    this.equipped = false
  }

  public dispose(){
    if (this.grabbable){
      this.info.world.deleteAsset(this.grabbable)
      this.equipped = false
    }
  }
}

/**
 * Componentize this script so it can be imported via an asset
 */
class ItemStateComponent extends hz.Component<typeof ItemStateComponent> {
  start(){
  }
  
}hz.Component.register(ItemStateComponent);