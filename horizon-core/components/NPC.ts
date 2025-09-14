import { DialogContainer } from 'Dialog_UI';
import { DialogScript } from 'DialogScript';
import * as hz from 'horizon/core';

export class DialogEvents{
  public static requestDialog = new hz.NetworkEvent<{player: hz.Player, key: number[]}>('sendDialogTreeKey'); // send the key to the dialog script to get the dialog tree
  public static sendDialogScript = new hz.NetworkEvent<{container?: DialogContainer}>('sendDialogScript');
  public static onEnterTalkableProximity = new hz.NetworkEvent<{npc: hz.Entity}>('onEnterNpcTrigger')
}

export class NPC extends hz.Component<typeof NPC> {
  static propsDefinition = {
    name: { type: hz.PropTypes.String }, // the human-readable name of the NPC
    proximityTrigger: { type: hz.PropTypes.Entity }, // trigger player enters to make this the NPC we are interacting with
    dialogScript: { type: hz.PropTypes.Entity } // first entity in the list of dialog scripts
  };

  private scriptData?: DialogScript;

  start() {
    this.scriptData = this.props.dialogScript?.getComponents<DialogScript>()[0]
    this.connectCodeBlockEvent(this.props.proximityTrigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => this.onPlayerEnterTrigger(player))
    this.connectNetworkEvent(this.entity, DialogEvents.requestDialog, (payload) => this.onOptionReceived(payload.player, payload.key))
  }

  private onPlayerEnterTrigger(player: hz.Player){
    this.sendNetworkBroadcastEvent(DialogEvents.onEnterTalkableProximity, {npc: this.entity}, [player])
  }

  private onOptionReceived(player: hz.Player, key: number[]){
    let dialog = this.scriptData?.getDialogFromTree(key)
    if (dialog){
      dialog.title = this.props.name
    }
    this.sendNetworkBroadcastEvent(DialogEvents.sendDialogScript, {container: dialog}, [player])
  }
}
hz.Component.register(NPC);
