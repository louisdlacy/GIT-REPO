// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.

import { Asset, NetworkEvent, Player, PropTypes } from "horizon/core";
import {
  AnimatedBinding,
  Animation,
  Binding,
  Easing,
  Image,
  ImageSource,
  Text,
  UIComponent,
  UINode,
  View,
} from "horizon/ui";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

//region define events
export const NotificationEvent = new NetworkEvent<{
  message: string;
  players: Player[];
  imageAssetId: string | null;
}>("NotificationEvent");

class UI_NotificationManager extends UIComponent<typeof UI_NotificationManager> {
  protected panelHeight: number = 100;
  protected panelWidth: number = 400;

  static propsDefinition = {
    hideOnStart: { type: PropTypes.Boolean, default: false },
    notificationImg: { type: PropTypes.Asset },
  };

  //region bindings defined
  private bndAlertImg = new Binding<ImageSource>("");
  private bndAlertMsg = new Binding<string>("Looking good today!");
  private animBnd_translateX = new AnimatedBinding(0);

  //simple button variables
  private easeTypeIndex = 0;
  private easeVariation = 0;
  private easing!: Easing;

  //region Initialize UI
  initializeUI(): UINode {
    this.bndAlertImg.set(ImageSource.fromTextureAsset(this.props.notificationImg!));

    return View({
      children: [
        Image({
          source: this.bndAlertImg,
          style: {
            height: 80,
            width: 80,
            alignSelf: "center",
            margin: 10,
            borderRadius: 40,
            // backgroundColor: 'rgba(229, 233, 0, 1)',
          },
        }),
        Text({
          text: this.bndAlertMsg,
          style: {
            fontSize: 25,
            color: "rgba(255, 255, 255, 1)",
            alignSelf: "center",
            textAlign: "left",
            textAlignVertical: "center",
            height: this.panelHeight,
            width: 280,
            padding: 10,
            fontWeight: "bold", // Make text bold
            // backgroundColor: 'rgba(0, 255, 85, 1)',
          },
        }),
      ],
      style: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 0, 0, 1)",
        layoutOrigin: [0.5, 0.5],
        left: "50%",
        top: "50%",
        height: this.panelHeight,
        width: this.panelWidth,
        borderRadius: 60,
        transform: [{ translateX: this.animBnd_translateX }],
      },
    });
  }

  //region preStart()
  preStart() {
    this.easing = Easing.inOut(Easing.cubic);

    this.connectNetworkEvent(this.entity, NotificationEvent, (data) => {
      this.populateNotification(data.message, data.players, data.imageAssetId);
    });

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      this.simpleButtonPressed(data.player);
    });
  }

  //region start()
  start() {
    if (this.props.hideOnStart) {
      this.entity.visible.set(false);
    } else {
      this.showNotification();
    }
  }

  //region populateNotification()
  //Populate notification with required message and optional player & imageAssetId
  populateNotification(message: string, players: Player[], imageAssetId: string | null) {
    const asset = imageAssetId ? new Asset(BigInt(imageAssetId)) : this.props.notificationImg!;
    const imgSrc = ImageSource.fromTextureAsset(asset);
    let recipients = players.length > 0 ? players : undefined;
    this.bndAlertImg.set(imgSrc, recipients);

    this.bndAlertMsg.set(message, recipients);

    this.showNotification(recipients);
  }

  //region showNotification()
  showNotification(recipients: Player[] | null = null) {
    //set the UI alll the way to the right
    this.animBnd_translateX.set(1000);
    const defaultSequence = Animation.sequence(
      //Move the UI to the center(0px) over 800ms
      Animation.timing(0, {
        duration: 800,
        easing: this.easing,
      }),
      //wait for 1500ms
      Animation.delay(
        //Notice delay wraps the next animation
        1500,
        //then move the UI alll the way to the left(-1000px) over 1000ms
        Animation.timing(-1000, {
          duration: 800,
          easing: this.easing,
        })
      )
    );

    this.animBnd_translateX.set(
      //apply the animation sequence
      defaultSequence,
      //this could easily be an arrow function () => {console.log("Anim finished");},
      undefined,
      //if recipients array has players then only show to those players
      //if recipients array is null, set to undefined == show to all players
      //that's what the ?? is doing
      recipients ?? undefined
    );
  }

    // region UI Simple Button
  /* 
    Import the `UI Simple Button` asset by (RocketTrouble)
    and assign this entity to its -targetEntity- to access
    the functionality below!
  */
  simpleButtonPressed(player: Player) {
      const result = cycleEaseTypesAndVariation(this.easeTypeIndex, this.easeVariation);
      this.easeTypeIndex = result[0];
      this.easeVariation = result[1];
      const easeDisplay = result[2];

      const ease = easeTypes[this.easeTypeIndex][0];
      if (this.easeVariation === 1) {
        this.easing = Easing.in(ease);
      } else if (this.easeVariation === 2) {
        this.easing = Easing.inOut(ease);
      } else {
        this.easing = ease;
      }

      this.populateNotification(easeDisplay, [player], null);
  }
}
UIComponent.register(UI_NotificationManager);

//region CycleEase Logic
export function cycleEaseTypesAndVariation(
  easeTypeIndex: number,
  variationIndex: number
): [number, number, string] {
  // Cycle through all the ease types, then toggle ease variation after a full cycle
  // 0: normal, 1: in, 2: inOut
  let newEaseTypeIndex = easeTypeIndex;
  let newVariationIndex = variationIndex;
  newEaseTypeIndex++;
  if (newEaseTypeIndex >= easeTypes.length) {
    newEaseTypeIndex = 0;
    newVariationIndex = newVariationIndex + 1 > 2 ? 0 : newVariationIndex + 1;
  }
  console.log(`variation: ${newVariationIndex}, index: ${newEaseTypeIndex}`);
  // Determine the string to display
  let easeLabel = easeTypes[newEaseTypeIndex][1];
  let displayString = "";
  if (newVariationIndex === 1) {
    displayString = `Easing.in(${easeLabel})`;
  } else if (newVariationIndex === 2) {
    displayString = `Easing.inOut(${easeLabel})`;
  } else {
    displayString = `Easing.${easeLabel}`;
  }
  return [newEaseTypeIndex, newVariationIndex, displayString];
}

//region Easing Types
export const easeTypes = [
  [Easing.linear, "linear"],
  [Easing.ease, "ease"],
  [Easing.quad, "quad"],
  [Easing.cubic, "cubic"],
  [Easing.poly(4), "poly(4)"],
  [Easing.sin, "sin"],
  [Easing.exp, "exp"],
  [Easing.circle, "circle"],
  [Easing.bounce, "bounce"],
  [Easing.back, "back"],
  [Easing.elastic(2), "elastic(2)"],
];
