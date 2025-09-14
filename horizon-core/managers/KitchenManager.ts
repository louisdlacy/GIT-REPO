import * as hz from 'horizon/core';
import { KitchenEvents } from 'Kitchen';

class KitchenManager extends hz.Component<typeof KitchenManager> {
  static propsDefinition = {
    kitchen1: {type: hz.PropTypes.Entity},
    kitchen2: {type: hz.PropTypes.Entity},
    kitchen3: {type: hz.PropTypes.Entity},
    kitchen4: {type: hz.PropTypes.Entity},
  };

  private kitchens: hz.Entity[] = [];
  private kitchenAssignmentAttempts: number = 0;
  private maxKitchenAssignmentAttempts: number = 5;

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      console.log("Player entered world");
      if (player.name.get() !== "Trader") {
        this.getPlayerKitchen(player);
      }

    });
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      if (this.kitchens.length > player.index.get()) {
        const kitchen = this.kitchens[player.index.get()];
        this.sendLocalEvent(kitchen, KitchenEvents.SetOwner, {owner: undefined});
      }
    });
  }

  start() {
  }

  getPlayerKitchen(player: hz.Player) {
    if (player === undefined) return;
    if (this.kitchens.length > player.index.get()) {
      console.log("Assigning kitchen");
      const kitchen = this.kitchens[player.index.get()];
      this.sendLocalEvent(kitchen, KitchenEvents.SetOwner, {owner: player});
    } else {
      this.populateKitchens();
      this.async.setTimeout(() => {
        console.log("Not enough kitchens. Retrying...");
        if (this.kitchenAssignmentAttempts < this.maxKitchenAssignmentAttempts) {
          this.kitchenAssignmentAttempts ++;
          this.getPlayerKitchen(player);
        }

      }, 1000)
    }
  }

  populateKitchens(){
    if (this.props.kitchen1 !== undefined && this.kitchens.indexOf(this.props.kitchen1) === -1) {
      this.kitchens.push(this.props.kitchen1);
    }
    if (this.props.kitchen2 !== undefined && this.kitchens.indexOf(this.props.kitchen2) === -1) {
      this.kitchens.push(this.props.kitchen2);
    }
    if (this.props.kitchen3 !== undefined && this.kitchens.indexOf(this.props.kitchen3) === -1) {
      this.kitchens.push(this.props.kitchen3);
    }
    if (this.props.kitchen4 !== undefined && this.kitchens.indexOf(this.props.kitchen4) === -1) {
      this.kitchens.push(this.props.kitchen4);
    }
  }
}
hz.Component.register(KitchenManager);
