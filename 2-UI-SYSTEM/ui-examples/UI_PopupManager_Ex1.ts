import { Component, Entity, Player } from "horizon/core";
import { PopupRequest, PopupResponse } from "UI_PopupManager";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

class UI_PopupManager_Ex1 extends Component<typeof UI_PopupManager_Ex1> {
  static propsDefinition = {};

  private popupManager!: Entity;
  private popupId: number = 0;

  preStart() {
    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      this.formNewPopup(data.player);
    });

    this.connectNetworkEvent(this.entity, PopupResponse, (data) => {
      // Handle the popup response data here
      // example: Play a vfx around the player after they close the popup!
      console.log("Popup closed. Time to play some vfx!");
    });
  }

  start() {
    //Use the "UI_PopupManager" tag on the UI Popup Manager to find it.
    this.popupManager = this.world.getEntitiesWithTags(["UI_PopupManager"])[0];
  }

  formNewPopup(player: Player){
     // if popupID + 1 is greater than 3 than make it 0. If it's not, make it equal popupID + 1
      this.popupId = this.popupId + 1 > 3 ? 0 : this.popupId + 1;
      
      let popupTitle = "";
      let popupMessage = "";
      
      if (this.popupId === 0){
        popupTitle = "Level Up!";
        popupMessage = "Congratulations! You've leveled up.";
        this.showPopup(player, popupTitle, popupMessage);
      }
      else if (this.popupId === 1){
        popupTitle = "Item Found!";
        popupMessage = "You've found a rare item.";
        this.showPopup(player, popupTitle, popupMessage);
      }
      else if (this.popupId === 2){
        popupTitle = "Quest Completed!";
        popupMessage = "You've completed a quest.";
        this.showPopup(player, popupTitle, popupMessage);
      }
      else if (this.popupId === 3){
        popupTitle = "New Skill Unlocked!";
        popupMessage = "You can now use a new skill.";
        this.showPopup(player, popupTitle, popupMessage);
      }
  }

  showPopup(player: Player, title: string, message: string) {
    if (!this.popupManager) {
      console.error("Popup Manager not found");
      return;
    }

    this.sendNetworkEvent(
      this.popupManager,
      PopupRequest, //requester: Entity, player: Player, title: string, message: string
      {
        //let the popup know its this entity thats requesting the popup
        requester: this.entity,
        //let the popup know which player to show the popup to
        player: player,
        title: title,
        message: message
      }
    );
  }
 
}
Component.register(UI_PopupManager_Ex1);

