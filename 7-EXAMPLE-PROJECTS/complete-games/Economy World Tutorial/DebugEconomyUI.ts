import { DebugEconomyEvents } from 'DebugEconomy';
import * as hz from 'horizon/core';
import { WorldInventory } from 'horizon/core';
import { Binding, Pressable, Text, UIComponent, UINode, View } from 'horizon/ui';
import { PurchaseableItemEvents } from 'PurchaseableItem';
import { SimpleLootItemEvents } from 'SimpleLootItem';

class DebugEconomy extends UIComponent {

  private itemSKU = 'apple_615786d0';
  private owner: hz.Player | undefined = undefined;
  private itemCountBinding: Binding<string> = new Binding<string>('0');
  private itemCountUpdating: Binding<boolean> = new Binding<boolean>(false);
  private itemNameBinding: Binding<string> = new Binding<string>('Apple');

  static propsDefinition = {
    active: { type: hz.PropTypes.Boolean, default: false },
    itemSKU: { type: hz.PropTypes.String },
    itemName: { type: hz.PropTypes.String },
    grantAmount: { type: hz.PropTypes.Number, default: 5 },
    consumeAmount: { type: hz.PropTypes.Number, default: 5 },
  };

  toggleDebugEconomy: hz.PlayerInput | undefined = undefined;

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      if (player.name.get() !== "Trader") {
        console.log("Setting owner of DebugEconomyUI to " + player.name.get());
        this.entity.owner.set(player);
      }
    });
  }

  start() {

    if (this.props.itemSKU === undefined) {
      console.warn("DebugEconomyUI: itemSKU is undefined. Using default apple_615786d0.");
    } else {
      this.itemSKU = this.props.itemSKU;
    }

    if (this.props.itemName === undefined) {
      console.warn("DebugEconomyUI: itemName is undefined. Using default Apple.");
    } else {
      this.itemNameBinding.set(this.props.itemName);
    }
  }

  onDebugTogglePressed(){
    this.entity.visible.set(!this.entity.visible.get());
  }

  receiveOwnership(_serializableState: hz.SerializableState, _oldOwner: hz.Player, _newOwner: hz.Player): void {
    if (_newOwner !== this.world.getServerPlayer()) {
      this.owner = _newOwner;
      this.updateUI();
      this.connectNetworkBroadcastEvent(SimpleLootItemEvents.OnPickupLoot, ({player, sku, count}) => {
        console.log("Player collected loot: " + player.name.get());
        if (player === this.owner && sku === this.itemSKU) {
          console.log("This player and this sku");
        }
        this.updateUI();
      })

      if (this.props.active) {
        this.toggleDebugEconomy = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftTertiary, hz.ButtonIcon.Menu, this, {preferredButtonPlacement: hz.ButtonPlacement.Center});
        this.toggleDebugEconomy.registerCallback((action, pressed) => {
          if(pressed) {
            this.onDebugTogglePressed();
          }
        });
      }
    } else {
      this.itemCountBinding.reset();
    }

  }

  updateUI(){
    if (this.owner !== undefined) {
      console.log("Updating UI");
      WorldInventory.getPlayerEntitlementQuantity(this.owner, this.itemSKU).then((invCount) => {
        console.log("New " + this.props.itemName + " count: " + invCount.toString());
        this.itemCountBinding.set(invCount.toString());
      })
    }

  }

  initializeUI(): UINode {

    return View({
      children: [
        Pressable({
          children: [
            Text({
              text: this.itemNameBinding.derive((value) => { return "+" + this.props.grantAmount + " " + value + "s"}),
            })
          ],
          style: {
            backgroundColor: 'lightgreen',
            padding: 4,
          },
          onClick: () => {
            if (this.owner !== undefined) {
              this.sendNetworkBroadcastEvent(DebugEconomyEvents.GrantItem, {player: this.owner, itemSKU: this.itemSKU, quantity: this.props.grantAmount});
              this.itemCountUpdating.set(true);
              this.async.setTimeout(() => {
                this.itemCountUpdating.set(false);
                this.updateUI();
              }, 5000);
            }

          }
        }),
        Pressable({
          children: [
            Text({
              text: this.itemNameBinding.derive((value) => { return "-" + this.props.consumeAmount + " " + value + "s" }),
            })
          ],
          style: {
            backgroundColor: 'pink',
            padding: 4,
          },
          onClick: () => {
            if (this.owner !== undefined) {
              this.sendNetworkBroadcastEvent(DebugEconomyEvents.ConsumeItem, {player: this.owner, itemSKU: this.itemSKU, quantity: this.props.consumeAmount});
              this.itemCountUpdating.set(true);
              this.async.setTimeout(() => {
                this.itemCountUpdating.set(false);
                this.updateUI();
              }, 5000);
            }
          }
        }),
        Pressable({
          children: [
            Text({
              text: this.itemNameBinding.derive((value) => { return 'Reset ' + value + "s" }),
            })
          ],
          style: {
            backgroundColor: 'red',
            padding: 4,
          },
          onClick: () => {
            if (this.owner !== undefined) {
              this.sendNetworkBroadcastEvent(DebugEconomyEvents.ResetItem, {player: this.owner, itemSKU: this.itemSKU})
              this.itemCountUpdating.set(true);
              this.async.setTimeout(() => {
                this.itemCountUpdating.set(false);
                this.updateUI();
              }, 5000);
            }
          }
        }),
      ],
      style: {
        position: 'absolute',
        height: 100,
        width: 200,
        backgroundColor: this.itemCountUpdating.derive((updating) => { return (updating) ? 'gray' : 'black' }),
        right: 20,
        bottom: 100,
      },
    });
  }
}
hz.Component.register(DebugEconomy);
