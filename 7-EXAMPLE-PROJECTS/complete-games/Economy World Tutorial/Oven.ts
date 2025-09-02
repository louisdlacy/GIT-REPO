import * as hz from 'horizon/core';
import { WorldInventory } from 'horizon/core';
import { KitchenEvents } from 'Kitchen';
import { PurchaseableItem, PurchaseableItemEvents } from 'PurchaseableItem';

class Oven extends PurchaseableItem<typeof Oven> {
  static propsDefinition = {
    ...PurchaseableItem.propsDefinition,
    ovenMesh: {type: hz.PropTypes.Entity},
    piePriceSKU: {type: hz.PropTypes.String},
    piePriceAmount: {type: hz.PropTypes.Number, default: 1},
    pieSKU: {type: hz.PropTypes.String},
    pieAmount: {type: hz.PropTypes.Number, default: 1},
    pieBakeDuration: {type: hz.PropTypes.Number, default: 15},
  };

  private owner: hz.Player | undefined = undefined;
  private purchased: boolean = false;
  private bakeRemaining: number = -1;

  private bakeIntervalDelayS: number = 0.1;
  private bakeIntervalId: number = -1;

  preStart(): void {
    super.preStart();

    if (this.props.trigger !== undefined && this.props.trigger !== null) {
      this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.onPlayerEnterTrigger(player);
      });
    }

    this.connectLocalEvent(this.entity, KitchenEvents.SetOvenOwner, ({owner, purchased}) => {
      this.setOwner(owner);
      this.setPurchased(purchased);
    });
  }

  start() {
    super.start();
  }

  reset(){
    this.setPurchased(false);
    if (this.bakeRemaining > 0){
      this.async.clearInterval(this.bakeIntervalId);
      this.bakeIntervalId = -1;
      this.bakeRemaining = -1;
    }
    this.clearOwner();
  }

  onPlayerEnterTrigger(player: hz.Player) {
    if (this.owner === player) {
      if (!this.purchased) {
        this.onAttemptPurchase(player);
      }else {
        this.attemptPieBake();
      }
    }
  }

  setOwner(owner: hz.Player | undefined){
    if (owner === undefined || owner === null) {
      this.reset();
      return;
    }
    this.owner = owner;
    this.connectCodeBlockEvent(this.owner, hz.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => {
      console.log(player.name.get() + " purchased " + item + " with success: " + success);
    })
  }

  clearOwner(){
    this.owner = this.world.getServerPlayer();
  }

  protected override onPurchaseSuccess(player: hz.Player): void {
    super.onPurchaseSuccess(player);
    this.setPurchased(true);
  }

  setPurchased(purchased: boolean) {
    this.purchased = purchased;
    if (this.props.ovenMesh !== undefined && this.props.ovenMesh !== null) {
      this.props.ovenMesh.visible.set(purchased);
    }

    if (purchased) {
      this.updateText("Bake Apple Pie: " + this.props.piePriceAmount + " Apples");
    }
  }

  attemptPieBake(){
    if (this.owner === undefined || this.bakeRemaining > 0) {
      return;
    }
    const owner: hz.Player = this.owner;
    WorldInventory.getPlayerEntitlementQuantity(owner, this.props.piePriceSKU).then((quantity) => {
      if (quantity >= this.props.piePriceAmount) {
        WorldInventory.consumeItemForPlayer(owner, this.props.piePriceSKU, this.props.piePriceAmount);
        this.sendNetworkBroadcastEvent(PurchaseableItemEvents.OnConsumeItem, { player: owner, itemSKU: this.props.piePriceSKU, itemAmount: this.props.piePriceAmount });
        this.startBakingPie();
      } else {

        const shortfall = this.props.piePriceAmount - Number(quantity);
        this.updateFailText("Not enough apples. " + shortfall + " more needed!");
      }
    })
  }

  startBakingPie(){
    this.bakeRemaining = this.props.pieBakeDuration;
    this.bakeIntervalId = this.async.setInterval(() => {
      this.bakeUpdate(this.bakeIntervalDelayS);
    }, this.bakeIntervalDelayS * 1000);
  }

  bakeUpdate(deltaTime: number) {
    this.bakeRemaining -= deltaTime;
    this.updateText("Baking Apple Pie: " + this.bakeRemaining.toFixed(1) + "s");
    if (this.bakeRemaining <= 0) {
      this.async.clearInterval(this.bakeIntervalId);
      this.bakeIntervalId = -1;
      this.onPieBakeComplete();
    }
  }

  onPieBakeComplete(){
    if (this.owner === undefined) {
      return;
    }

    WorldInventory.grantItemToPlayer(this.owner, this.props.pieSKU, this.props.pieAmount);
    this.sendNetworkBroadcastEvent(PurchaseableItemEvents.OnReceiveItem, { player: this.owner, itemSKU: this.props.pieSKU, itemAmount: this.props.pieAmount });

    this.updateText("Bake Apple Pie: " + this.props.piePriceAmount + " Apples");
  }

}
hz.Component.register(Oven);
