// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Color, Player, PropTypes, Vec3 } from "horizon/core";
import {
  AnimatedBinding,
  Animation,
  Binding,
  Easing,
  Text,
  UIComponent,
  UINode,
  View,
} from "horizon/ui";
import { addAmountEvent, simpleButtonEvent } from "UI_SimpleButtonEvent";

/**
 * UI component for displaying and animating a number increase.
 */
class UI_NumberUp extends UIComponent<typeof UI_NumberUp> {
  static propsDefinition = {
    // toggles visibility
    enabled: { type: PropTypes.Boolean, default: true },
    // The screen offset of the UI element (x and y are in percentage of screen, z is layer order)
    screenPositionPercent: { type: PropTypes.Vec3, default: new Vec3(50, 50, 10) },
    // The scale of the UI element
    scale: { type: PropTypes.Number, default: 1.0 },
    // toggles the background for the number up text
    backgroundOn: { type: PropTypes.Boolean, default: true },
    backgroundColor: { type: PropTypes.Color, default: new Color(1, .7, 0) },
    // toggles the number up animation
    useNumberUp: { type: PropTypes.Boolean, default: true },
    numberColor: { type: PropTypes.Color, default: new Color(1, 1, 1) },
    // toggles the plus up animation
    usePlusUp: { type: PropTypes.Boolean, default: true },
    plusUpColor: { type: PropTypes.Color, default: new Color(1, .1, 1) },
  };

  playerNumberMap: Map<Player, number> = new Map();

  bnd_number = new Binding<string>("1,000,000");
  animBnd_scale = new AnimatedBinding(1);

  bnd_plusNumber = new Binding<string>("0");
  animBnd_plusScale = new AnimatedBinding(1);
  animBnd_plusTranslateY = new AnimatedBinding(0);
  animBnd_plusOpacity = new AnimatedBinding(0);

  backgroundColor = new Color(255, 208, 0);
  numberColor = new Color(255, 255, 255);
  plusUpColor = new Color(255, 26, 255);

  //region initializeUI()
  initializeUI(): UINode {
    if (!this.props.enabled) this.entity.visible.set(false);

    this.backgroundColor = this.props.backgroundColor;
    this.numberColor = this.props.numberColor;
    this.plusUpColor = this.props.plusUpColor;

    return View({
      children: [
        ...numberUpText(this.bnd_number, this.animBnd_scale, this.props.backgroundOn!, this.backgroundColor, this.numberColor),
        ...plusUpText(this.bnd_plusNumber, this.animBnd_plusScale, this.animBnd_plusTranslateY, this.animBnd_plusOpacity, this.plusUpColor),
      ],
      style: {
        // backgroundColor: "rgba(0, 0, 0, 1)",
        layoutOrigin: [0.5, 0.5],
        left: `${this.props.screenPositionPercent.x}%`,
        top: `${100-this.props.screenPositionPercent.y}%`,
        height: 80,
        width: 400,
        transform: [{ scale: this.props.scale }],
        //this creates the dynamic background for the text
        alignItems: "center",
        zIndex: this.props.screenPositionPercent.z,
      },
    });
  }

  //region preStart()
  preStart(): void {
    if (!this.props.enabled) return;

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      const increment = 1;
      if (this.props.useNumberUp) this.numberUp(data.player, increment);
      if (this.props.usePlusUp) this.plusUp(data.player, increment);
    });

    this.connectNetworkEvent(this.entity, addAmountEvent, (data) => {
      if (this.props.useNumberUp) this.numberUp(data.player, data.amount);
      if (this.props.usePlusUp) this.plusUp(data.player, data.amount);
    });
  }

  //region numberUp()
  numberUp(player: Player, amount: number): void {
    const curAmount = this.playerNumberMap.get(player) || 0;
    const newAmount = curAmount + amount;
    this.playerNumberMap.set(player, newAmount);

    this.animBnd_scale.set(2, undefined, [player]);
    this.bnd_number.set(newAmount.toString(), [player]);
    this.animBnd_scale.set(
      Animation.timing(1, {
        duration: 100,
        easing: Easing.inOut(Easing.elastic(1)),
      }),
      undefined,
      [player]
    );
  }

  //region plusUp()
  plusUp(player: Player, amount: number): void {
    const curAmount = this.playerNumberMap.get(player) || 0;
    const newAmount = curAmount + amount;
    this.playerNumberMap.set(player, newAmount);

    const prefix = amount >= 0 ? "+" : "-";
    this.bnd_plusNumber.set(prefix + amount.toString(), [player]);
    this.bnd_number.set(newAmount.toString(), [player]);

    //vertical offset
    const offsetY = 65;
    this.animBnd_plusScale.set(0.5, undefined, [player]);
    this.animBnd_plusTranslateY.set(0, undefined, [player]);
    this.animBnd_plusOpacity.set(1, undefined, [player]);
    this.animBnd_plusScale.set(
      Animation.timing(1.5, {
        duration: 300,
        easing: Easing.linear,
      }),
      () => {
        this.animBnd_plusOpacity.set(
          Animation.timing(0, {
            duration: 200,
            easing: Easing.linear,
          })
        );
      },
      [player]
    );
    this.animBnd_plusTranslateY.set(
      Animation.timing(-offsetY, {
        duration: 600,
        easing: Easing.linear,
      }),
      undefined,
      [player]
    );
  }
}
UIComponent.register(UI_NumberUp);

//region numberUpText UI def
export const numberUpText = (
  bnd_number: Binding<string>,
  animBnd_scale: AnimatedBinding,
  backgroundOn: boolean = false,
  backgroundColor: Color = new Color(255, 208, 0),
  numberColor: Color = new Color(255, 255, 255),
) => {
  return [
    Text({
      text: bnd_number,
      style: {
        padding: 20,
        fontSize: 60,
        fontFamily: "Bangers",
        color: numberColor,
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%",
        transform: [{ scale: animBnd_scale }],
        borderRadius: 40,
        backgroundColor: backgroundOn ? backgroundColor : "transparent",
        borderWidth: 6,
        borderColor: backgroundOn ? numberColor : "transparent",
      },
    }),
  ];
};

//region plusUpText UI def
export const plusUpText = (
  bnd_plusNumber: Binding<string>,
  animBnd_plusScale: AnimatedBinding,
  animBnd_plusTranslateY: AnimatedBinding,
  animBnd_plusOpacity: AnimatedBinding,
  plusUpColor: Color = new Color(255, 26, 255),
) => {
  return [
    Text({
      text: bnd_plusNumber,
      style: {
        padding: 20,
        color: plusUpColor,
        fontSize: 60,
        fontFamily: "Bangers",
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%",
        width: "100%",
        transform: [{ translateY: animBnd_plusTranslateY }, { scale: animBnd_plusScale }],
        opacity: animBnd_plusOpacity,
        position: "absolute",
      },
    }),
  ];
};
