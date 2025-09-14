import * as hz from 'horizon/core';
import { BaseComponent } from "./BaseComponent";
import { NPC_Base } from "./NPC_Base";
import { CustomerNavigation } from "./CustomerNavigation";
import { Vec3 } from "horizon/core";

/**
 * This class controls the overarching behavior of the customer. It is responsible for
 * managing the customer's interactions and navigation within the environment.
 */
export class CustomerControl extends BaseComponent<typeof CustomerControl> {
  static propsDefinition = {
    ...BaseComponent.propsDefinition,
    npcControl: { type: hz.PropTypes.Entity },
    navigation: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
    usePrescripted: { type: hz.PropTypes.Boolean }
  };

  private _inTrigger = false; // used to prevent trigger from hitting twice due to HW oddity
  private _llmControl: NPC_Base | undefined;
  private _navigation: CustomerNavigation | undefined;

  /**
   * Initializes the customer control by setting up entity references and enabling customer behavior.
   * Also connects events for player entering and exiting the trigger area.
   */
  start() {
    super.start();
    this.getEntityReferences();
    this.enableCustomer();
    this._navigation!.startNavigation();

    let sub = this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.stopAndSayHi(player);
      sub.disconnect();
    });

    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
      this.resumeWalking();
    });
  }

  /**
   * Retrieves and verifies the necessary component references for LLM control and navigation.
   */
  getEntityReferences() {
    // Get references to entities
    this._llmControl = this.getAndVerifyComponent<NPC_Base>(this.props.npcControl!, NPC_Base);
    this._navigation = this.getAndVerifyComponent<CustomerNavigation>(this.props.navigation!, CustomerNavigation);
  }

  /**
   * Enables the customer by subscribing to events and resetting the LLM session.
   */
  enableCustomer() {
    this._llmControl!.subscribeEvents();
    this._llmControl!.resetLLMSession();
  }

  /**
   * Resumes the customer's walking behavior by resetting the trigger state and starting navigation.
   */
  resumeWalking() {
    this._inTrigger = false;
    this._llmControl?.askLLMToStopTalking();
    this._navigation?.startNavigation();
  }

  /**
   * Stops the customer's navigation and makes the customer greet the player.
   * @param player - The player who has entered the trigger area.
   */
  stopAndSayHi(player: hz.Player): void {
    if (!this._inTrigger) {
      this._inTrigger = true;
      this._navigation?.stopNavigation();
      this.entity.lookAt(player.position.get().componentMul(new Vec3(1, 0, 1)));
      if (this.props.usePrescripted) {
        this._llmControl?.speak(`Hi ${player.name.get()}! I'm a horizon worlds N P C`, player);
      } else {
        this._llmControl?.elicitSpeech(
          `Tell the player, named ${player.name.get()} that you are a Horizon Worlds NPC. Keep it short, under 20 words.`,
          player);
      }
      this.world.ui.showPopupForEveryone(`NPC should be speaking now`, 1);
    }
  }
}

hz.Component.register(CustomerControl);
