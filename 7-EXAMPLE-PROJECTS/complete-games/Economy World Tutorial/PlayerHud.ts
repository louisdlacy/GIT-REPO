import * as hz from 'horizon/core';
import { Binding, Image, ImageSource, Text, UIComponent, UINode, View } from 'horizon/ui';
import { PurchaseableItemEvents } from 'PurchaseableItem';
import { SimpleLootItemEvents } from 'SimpleLootItem';

class PlayerHud extends UIComponent {

  static propsDefinition = {
    currency1Name: { type: hz.PropTypes.String },
    currency1SKU: { type: hz.PropTypes.String },
    currency1Texture: { type: hz.PropTypes.Asset },
    currency2Name: { type: hz.PropTypes.String },
    currency2SKU: { type: hz.PropTypes.String },
    currency2Texture: { type: hz.PropTypes.Asset },
    currency3Name: { type: hz.PropTypes.String },
    currency3SKU: { type: hz.PropTypes.String },
    currency3Texture: { type: hz.PropTypes.Asset },
  };

  private currency1CountBinding: Binding<number> = new Binding(0);
  private currency2CountBinding: Binding<number> = new Binding(0);
  private currency3CountBinding: Binding<number> = new Binding(0);
  private owner: hz.Player | undefined = undefined;

  // Position constants for easy adjustment
  private static readonly MOBILE_TOP_POSITION = 90;
  private static readonly MOBILE_RIGHT_POSITION = 60;

  private static readonly DESKTOP_TOP_POSITION = 120;
  private static readonly DESKTOP_RIGHT_POSITION = 29;

  // Platform-specific position values as Bindings
  private topPositionBinding: Binding<number> = new Binding(0);
  private rightPositionBinding: Binding<number> = new Binding(0);

  preStart() {
    this.connectNetworkBroadcastEvent(SimpleLootItemEvents.OnPickupLoot, ({ player, sku, count }) => {
      if (this.owner === player) {
        this.async.setTimeout(() => {
          hz.WorldInventory.getPlayerEntitlementQuantity(player, this.props.currency1SKU).then(quantity => {
            this.currency1CountBinding.set(Number(quantity));
          });
        }, 1500);
      }

    })
    this.connectNetworkBroadcastEvent(PurchaseableItemEvents.OnReceiveItem, ({ player, itemSKU, itemAmount }) => {
      if (this.owner === player) {
        this.async.setTimeout(() => {
          hz.WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then(quantity => {
            this.updateForSKU(itemSKU, quantity);
          });
        }, 1500);
      }
    });
    this.connectNetworkBroadcastEvent(PurchaseableItemEvents.OnConsumeItem, ({ player, itemSKU, itemAmount }) => {
      if (this.owner === player) {
        this.async.setTimeout(() => {
          hz.WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then(quantity => {
            this.updateForSKU(itemSKU, quantity);
          });
        }, 1500);
      }
    });
    this.connectNetworkBroadcastEvent(PurchaseableItemEvents.OnInventoryChanged, ({ player }) => {
      if (this.owner === player) {
        this.async.setTimeout(() => {
          this.updateUI();
        }, 1500);
      }
    })

    this.connectNetworkBroadcastEvent(hz.InWorldShopHelpers.OnPlayerPurchasedItemEvent, (payload) => {
      const player = payload.playerId
      if (this.owner && this.owner.id === player) {
        this.async.setTimeout(() => {
          this.updateUI();
        }, 1500);
      }
    });

    // Add your own event listeners for players receiving or consuming items here

  }

  updateUI() {
    if (this.owner !== undefined && this.owner !== this.world.getServerPlayer()) {
      hz.WorldInventory.getPlayerEntitlements(this.owner).then(entitlements => {
        entitlements.forEach((entitlement) => {
          this.updateForSKU(entitlement.sku, entitlement.quantity);
        });
      });

      // Set platform-specific position values
      const isMobile = this.world.getLocalPlayer().deviceType.get() === hz.PlayerDeviceType.Mobile;
      this.topPositionBinding.set(isMobile ? PlayerHud.MOBILE_TOP_POSITION : PlayerHud.DESKTOP_TOP_POSITION);
      this.rightPositionBinding.set(isMobile ? PlayerHud.MOBILE_RIGHT_POSITION : PlayerHud.DESKTOP_RIGHT_POSITION);
    }

  }

  updateForSKU(sku: string, quantity: number) {
    if (sku === this.props.currency1SKU) {
      this.currency1CountBinding.set(Number(quantity));
    }
    if (sku === this.props.currency2SKU) {
      this.currency2CountBinding.set(Number(quantity));
    }
    if (sku === this.props.currency3SKU) {
      this.currency3CountBinding.set(Number(quantity));
    }
  }


  start() {

  }

  receiveOwnership(_serializableState: hz.SerializableState, _oldOwner: hz.Player, _newOwner: hz.Player): void {
    if (_newOwner !== this.world.getServerPlayer()) {
      console.log("Setting hud owner: " + _newOwner.name.get());
      this.owner = _newOwner;
      this.updateUI();

      this.connectCodeBlockEvent(this.owner, hz.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => {
        console.log(player.name.get() + " purchased " + item + " with success: " + success);
      })
    }

  }

  initializeUI(): UINode {

    return View({
      children: [
        View({
          children: [
            Image({
              source: ImageSource.fromTextureAsset(this.props.currency1Texture),
              style: { height: 40, width: 40 }
            }),
            Text({
              text: this.currency1CountBinding.derive((count) => {
                return "x " + count;
              }),
              style: {
                color: 'white',
                fontSize: 20,
                paddingTop: 10,
              }
            })
          ],
          style: {
            flexDirection: 'row',
          }
        }),
        View({
          children: [
            Image({
              source: ImageSource.fromTextureAsset(this.props.currency2Texture),
              style: { height: 40, width: 40 }
            }),
            Text({
              text: this.currency2CountBinding.derive((count) => {
                return "x " + count;
              }),
              style: {
                color: 'white',
                fontSize: 20,
                paddingTop: 10,
              }
            }),
          ],
          style: {
            flexDirection: 'row',
          }
        }),
        View({
          children: [
            Image({
              source: ImageSource.fromTextureAsset(this.props.currency3Texture),
              style: { height: 40, width: 40 }
            }),
            Text({
              text: this.currency3CountBinding.derive((count) => {
                return "X " + count;
              }),
              style: {
                color: 'white',
                fontSize: 20,
                paddingTop: 10,
              }
            })
          ],
          style: {
            flexDirection: 'row',
          }

        })


      ],
      style: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: 100,
        position: 'absolute',
        top: this.topPositionBinding,
        right: this.rightPositionBinding,
        margin: 20,
        padding: 5,
        borderRadius: 5
      }
    })
  }
}
hz.Component.register(PlayerHud);
