import { Entity, NetworkEvent, Player, PropTypes } from "horizon/core";
import {
  AnimatedBinding,
  Animation,
  Binding,
  Easing,
  Image,
  ImageSource,
  Pressable,
  Text,
  UIComponent,
  UINode,
  View,
} from "horizon/ui";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

//region Popup Events
// A request/response event pair informs any requesting Entity when the player closes the popup. 
export const PopupRequest = new NetworkEvent<{ requester: Entity, player: Player, title: string, message: string }>("PopupRequest");
export const PopupResponse = new NetworkEvent<{player: Player}>("PopupResponse");
/**
 * This asset provides a simple and reusable Popup UI template 
 * Features dynamic Title and Message 
 * Animated show and hide action
 */
class UI_PopupManager extends UIComponent<typeof UI_PopupManager> {
  protected panelHeight: number = 250;
  protected panelWidth: number = 500;

  static propsDefinition = {
    // toggles the visibility of the popup
    enabled: { type: PropTypes.Boolean, default: true },
    hideOnStart: { type: PropTypes.Boolean, default: false },
    // the 
    defaultWatermark: { type: PropTypes.Asset },
  };

  //region bindings defined
  private bndDisplay = new Binding<string>("flex");
  private bndTitle = new Binding<string>("New Popup!");
  private bndContent = new Binding<string>("Popup Content");
  private bndWatermark = new Binding<ImageSource>(""); // Provide an initial value, e.g., empty string or default image source
  private animBnd_posY = new AnimatedBinding(1);

  //keeps track of which entity by which player requested the popup, so we can respond to the right entity when they close it
  private requestResponseMap = new Map<Player, Entity>();

  //region UI Initialization
  initializeUI(): UINode {
    if (!this.props.enabled) this.entity.visible.set(false);

    const defaultWatermark = ImageSource.fromTextureAsset(this.props.defaultWatermark!);
    this.bndWatermark.set(defaultWatermark);

    const bndBtnScale = new Binding<number>(1);

    return View({
      children: [
        Image({
          source: this.bndWatermark,
          style: {
            position: "absolute",
            height: "100%",
            width: "75%",
            opacity: 0.4,
            // layoutOrigin: [0.5, 0.5],
            right: 0,
            bottom: 5,
          },
        }),
        //region UI Title
        Text({
          text: this.bndTitle,
          style: {
            fontSize: 50,
            fontFamily: "Kallisto",
            color: "rgba(3, 3, 3, 1)",
            // backgroundColor: "rgba(255, 0, 0, 0.8)",
            padding: 30,
            top: "5%",
            height: 110,
            textAlignVertical: "center",
            width: this.panelWidth,
            position: "absolute",
          },
        }),
        //region UI Content
        Text({
          text: this.bndContent,
          style: {
            fontSize: 28,
            fontFamily: "Kallisto",
            color: "rgba(3, 3, 3, 1)",
            // backgroundColor: "rgba(51, 255, 0, 0.8)",
            padding: 30,
            top: "50%",
            height: 100,
            textAlignVertical: "center",
            width: this.panelWidth,
            position: "absolute",
          },
        }),
        //region Pressable 
        Pressable({
          children: [...button(new Binding<string>("OK!"), new Binding<number>(24), bndBtnScale)],
          //Cancel
          onPress: (player: Player) => {
            if (player) {
              console.log(`Player ${player.name.get()} pressed the button`);
            }

            bndBtnScale.set(0.9, [player]);
            this.async.setTimeout(() => {
              bndBtnScale.set(1, [player]);
              this.hidePopup(player);
            }, 100);
          },
          style: {
            width: 100,
            height: 50,
            position: "absolute",

            //This would center the view
            layoutOrigin: [0.5, 0],
            left: "80%",
            bottom: -20,
          },
        }),
        //Optional image WIP
        // View({
        //   style: {
        //     backgroundColor: "rgba(255, 255, 255, 1)",
        //     position: "absolute",
        //     width: 150,
        //     height: 150,
        //     top: "90%",
        //     left: "50%",
        //     layoutOrigin: [.5, 0],
        //     borderRadius: 20,
        //     overflow: "visible",
        //     display: "none",
        //   },
        // }),
      ],
      //region UI Style
      style: {
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 1)",
        height: this.panelHeight,
        width: this.panelWidth,
        layoutOrigin: [0.5, 0.5],
        left: "50%",
        top: "50%",
        position: "absolute",
        transform: [{ translateY: this.animBnd_posY }],
        display: this.bndDisplay,
      },
    });
  }
//region preStart
  preStart(): void {
    if (!this.props.enabled) return;

    this.connectNetworkEvent(this.entity, PopupRequest, (data) => {
      this.requestResponseMap.set(data.player, data.requester);
      this.showPopup(data.player, data.title, data.message);
    });

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      this.showPopup(data.player, "Simple Button!", "Try assigning the 'Another Script Example' entity to the Simple Button");
    });
  }

  //region start
  start(): void {
      if (this.props.hideOnStart) {
      this.entity.visible.set(false);
    }
  }

  //region showPopup()
  showPopup(player: Player, title: string, message: string): void {
    this.bndTitle.set(title, [player]);
    this.bndContent.set(message, [player]);
    this.bndDisplay.set("flex", [player]);
    const startVal = -900;
    this.animBnd_posY.set(startVal);
    const defaultSequence = Animation.sequence(
      Animation.timing(0, {
        duration: 1000,
        easing: Easing.elastic(1.0),
      })
    );
    
    this.animBnd_posY.set(
      defaultSequence,
      undefined,
      [player]
    );
  }

  //region hidePopup()
  hidePopup(player: Player): void {
    const defaultSequence = Animation.sequence(
      Animation.timing(-900, {
        duration: 700,
        easing: Easing.sin,
      })
    );

    this.animBnd_posY.set(
      defaultSequence,
      () => {
        this.bndDisplay.set("none", [player]);
      },
      [player]
    );
    const requester = this.requestResponseMap.get(player);
    if (requester){
      console.log(`Sending popup response to ${requester.name.get()}`);
      this.sendNetworkEvent(requester, PopupResponse, {player: player});
    }
  }
}
UIComponent.register(UI_PopupManager);

//region UI Button Defined
export const button = (bndHeaderText: Binding<string>, bndFontSize: Binding<number>, bndBtnScale: Binding<number>) => {
  return [
    Text({
      text: bndHeaderText,
      style: {
        fontFamily: "Kallisto",
        width: "100%",
        height: "100%",
        alignSelf: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 20,
        color: "rgba(2, 2, 2, 1)",
        fontSize: bndFontSize,
        textAlign: "center",
        textAlignVertical: "center",
        transform: [{ scale: bndBtnScale }],
        borderColor: "rgba(109, 109, 109, 1)",
        borderWidth: 3,
      },
    }),
  ];
};