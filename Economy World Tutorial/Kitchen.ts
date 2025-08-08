import * as hz from 'horizon/core';
import { WorldInventory } from 'horizon/core';

export const KitchenEvents = {
  SetOwner: new hz.LocalEvent<{ owner: hz.Player | undefined }>('SetOwner'),
  SetOvenOwner: new hz.LocalEvent<{ owner: hz.Player | undefined, purchased: boolean }>('SetOvenOwner'),
}

class Kitchen extends hz.Component<typeof Kitchen> {
  static propsDefinition = {
    oven1: {type: hz.PropTypes.Entity},
    oven2: {type: hz.PropTypes.Entity},
    oven3: {type: hz.PropTypes.Entity},
    oven4: {type: hz.PropTypes.Entity},
    ovenSku: {type: hz.PropTypes.String},
    kitchenTxtInternal: {type: hz.PropTypes.Entity},
    kitchenTxtExternal: {type: hz.PropTypes.Entity}
  };

  private ovens: hz.Entity[] = [];

  preStart(): void {
    this.connectLocalEvent(this.entity, KitchenEvents.SetOwner, ({owner}) => {
      this.setKitchenOwner(owner);
    });
  }

  start() {
    this.setKitchenOwner(undefined);
    if (this.props.oven1 !== undefined && this.props.oven2 !== undefined && this.props.oven3 !== undefined && this.props.oven4 !== undefined) {
      this.ovens = [this.props.oven1, this.props.oven2, this.props.oven3, this.props.oven4];
    }
  }

  setKitchenOwner(owner: hz.Player | undefined){
    if (owner !== undefined) {

      this.entity.visible.set(true);
      this.entity.collidable.set(true);
      WorldInventory.getPlayerEntitlementQuantity(owner, this.props.ovenSku).then((quantity) => {
        if (quantity == 0) {
          if (this.ovens.length > 0) {
            WorldInventory.grantItemToPlayer(owner, this.props.ovenSku, 1);
            this.sendLocalEvent(this.ovens[0], KitchenEvents.SetOvenOwner, {owner, purchased: true});
          }
        } else {
          for(let i = 0; i < this.ovens.length; i++) {

            const purchased = i < quantity;
            this.sendLocalEvent(this.ovens[i], KitchenEvents.SetOvenOwner, {owner, purchased});
          }
        }

      });
      if (this.props.kitchenTxtInternal !== undefined) {
        this.props.kitchenTxtInternal.visible.set(true);
        this.props.kitchenTxtInternal.as(hz.TextGizmo).text.set(owner.name.get() + " Kitchen");
      }
      if (this.props.kitchenTxtExternal !== undefined) {
        this.props.kitchenTxtExternal.visible.set(true);
        this.props.kitchenTxtExternal.as(hz.TextGizmo).text.set(owner.name.get() + " Kitchen");
      }
    } else {
      this.ovens.forEach((oven) => {
        this.sendLocalEvent(oven, KitchenEvents.SetOwner, {owner: undefined});
      });
      this.entity.visible.set(false);
      this.entity.collidable.set(false);
      this.props.kitchenTxtInternal?.visible.set(false);
      this.props.kitchenTxtExternal?.visible.set(false);
    }
  }
}
hz.Component.register(Kitchen);
