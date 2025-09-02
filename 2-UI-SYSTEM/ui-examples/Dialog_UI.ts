import * as hz from 'horizon/core';
import { Binding, Pressable, Text, UIComponent, UINode, View } from 'horizon/ui';
import { DialogEvents } from 'NPC';

export type DialogContainer = {
  title?: string;
  response: string;
  option1Text: string;
  option2Text?: string;
  option3Text?: string;
}

const SHOW_RESPONSE_DELAY_MS = 700;

export class Dialog_UI extends UIComponent<typeof Dialog_UI> {
  static propsDefinition = {
    trigger: {type: hz.PropTypes.Entity},
  };
  private dialogTitle = new Binding<string>("title");

  private line = new Binding<string>("dialog");
  private option1 = new Binding<string>("option1");
  private option2 = new Binding<string>("option2");
  private option3 = new Binding<string>("option3");

  private optionTree: number[] = []; // tracks which options we have chosen
  private localPlayer!: hz.Player;
  private talkingEntity!: hz.Entity;
  private trigger!: hz.TriggerGizmo;

  start(){
    this.localPlayer = this.world.getLocalPlayer();
    this.entity.visible.set(false)
    this.trigger = this.props.trigger!.as(hz.TriggerGizmo)
    this.trigger.enabled.set(false)

    if (this.localPlayer === hz.World.prototype.getServerPlayer()){
      return;
    }

    // Set up trigger gizmo to only detect our owning player
    this.trigger.setWhoCanTrigger([this.localPlayer])

    // Triggers when a player enters the proximity of a talkable entity
    this.connectNetworkBroadcastEvent(DialogEvents.onEnterTalkableProximity, (payload) => {
      this.talkingEntity = payload.npc;
      this.entity.position.set(payload.npc.position.get())
      this.trigger.enabled.set(true)
    })

    // Triggers when a player clicks on the "talk" button
    // Sends a request to the server to start the dialog
    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => {
      this.optionTree = []
      this.sendNetworkEvent(this.talkingEntity, DialogEvents.requestDialog, { player: this.localPlayer, key: this.optionTree });
    })

    // Triggers when the server sends a response to the dialog request
    // If response has content, will fill out the UI
    // If response is empty, will hide the UI
    this.connectNetworkBroadcastEvent(DialogEvents.sendDialogScript, (payload) => {
      if (payload.container) {
        this.updateText(payload.container);
        this.entity.visible.set(true);
        this.trigger.enabled.set(false);
      } else{
        this.entity.visible.set(false)
        this.async.setTimeout(() => {
          this.trigger.enabled.set(true)
        }, SHOW_RESPONSE_DELAY_MS)
      }
    })
  }

  // Triggers when a player clicks on an option in the dialog UI
  chooseDialogOption(option: number){
    this.optionTree.push(option)
    this.sendNetworkEvent(this.talkingEntity, DialogEvents.requestDialog, {player: this.localPlayer, key: this.optionTree})
  }

  updateText(container: DialogContainer){
    const target = [this.localPlayer]
    this.dialogTitle.set(container.title || "", target);
    this.line.set(container.response, target);

    this.option1.set("", target);
    this.option2.set("", target);
    this.option3.set("", target);

    this.async.setTimeout(() => {
      this.option1.set(container.option1Text, target);
      this.option2.set(container.option2Text || "", target);
      this.option3.set(container.option3Text || "", target);
    }, SHOW_RESPONSE_DELAY_MS)
  }

  initializeUI() {
    const root = View({
      children: [
          View({
          children: [
            View({
              children: [],
              style: {
                width: 472,
                flexShrink: 0,
                alignSelf: "stretch",
                borderRadius: 12,
                borderWidth: 4,
                borderColor: "#F9D470",
                backgroundColor: "#FAECD3"
              }
          }),
              View({
                children: [
                  Text({
                    text: this.line,
                    style: {
                      width: 424,
                      color: "#5A3715",
                      textAlign: "center",
                      textAlignVertical: "center",
                      fontFamily: "Roboto",
                      fontSize: 24,
                      fontWeight: "700",
                      minHeight: 84
                    }
                  })],
                style: {
                  display: "flex",
                  paddingTop: 24,
                  paddingRight: 24,
                  paddingBottom: 16,
                  paddingLeft: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: -472
                }
              }),
          View({
             children: [
              View({
              children: [
              Text({
                text: this.dialogTitle,
                style: {
                  color: "#5A3715",
                  textAlign: "center",
                  fontFamily: "Roboto",
                  fontSize: 28,
                  fontWeight: "900"
                }
              })],
              style: {
                  display: "flex",
                  height: 36,
                  paddingVertical: 0,
                  paddingHorizontal: 24,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 18,
                  backgroundColor: "#F9D470"
              }
            })],
          style: {
                display: "flex",
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: -17
            }
          })
          ],
            style: {
              display: "flex",
              width: 472,
              justifyContent: "center",
              alignItems: "flex-end",
              borderRadius: 12,
              flexDirection: "row"
            }
          }),

      View({
        children: [
          UINode.if(this.option1.derive(x => x.length > 0),
          Pressable({
            children: [View({
              children: [Text({
                text: this.option1,
                style: {
                  color: "#61470B",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontFamily: "Roboto",
                  fontSize: 24,
                  fontWeight: "700"
                },
              })],
              style: {
                display: "flex",
                paddingVertical: 12,
                paddingHorizontal: 24,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                borderBottomWidth: 4,
                backgroundColor: "#FFD98B",
                borderColor: "#E8BC57",
                flexDirection: "row",
                minWidth: 328
              },
            })],
            onClick: () => this.chooseDialogOption(0),
          })),
          UINode.if(this.option2.derive(x => x.length > 0),
          Pressable({
            children: [View({
              children: [Text({
                text: this.option2,
                style: {
                  color: "#61470B",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontFamily: "Roboto",
                  fontSize: 24,
                  fontWeight: "700"
                }
              })],
              style: {
                display: "flex",
                paddingVertical: 12,
                paddingHorizontal: 24,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                borderBottomWidth: 4,
                backgroundColor: "#FFD98B",
                borderColor: "#E8BC57",
                marginTop: 10,
                flexDirection: "row",
                minWidth: 328
              },
            })],
            onClick: () => this.chooseDialogOption(1),
          })),
          UINode.if(this.option3.derive(x => x.length > 0),
          Pressable({
            children: [View({
              children: [Text({
                text: this.option3,
                style: {
                  color: "#61470B",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontFamily: "Roboto",
                  fontSize: 24,
                  fontWeight: "700"
                }
              })],
              style: {
                display: "flex",
                paddingVertical: 12,
                paddingHorizontal: 24,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                borderBottomWidth: 4,
                backgroundColor: "#FFD98B",
                borderColor: "#E8BC57",
                marginTop: 10,
                flexDirection: "row",
                minWidth: 328
              },
            })],
            onClick: () => this.chooseDialogOption(2),
          }))
        ],
        style: {
          display: "flex",
          width: 812,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          borderRadius: 12,
          marginTop: 13
        }
      })],
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        paddingVertical: 108,
        paddingHorizontal: 32,
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        position: "relative"
      }
    })

    return root
  }
}
UIComponent.register(Dialog_UI);
