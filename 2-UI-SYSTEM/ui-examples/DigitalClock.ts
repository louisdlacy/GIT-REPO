//
// Digital Clock Script 
// Author: Craigusprime
// always stop the world or turn world sim off before making changes in the properties panel or the old time will hang!!!
//

import { Component, PropTypes, Color } from "horizon/core";
import {
  Binding,
  UINode,
  UIComponent,
  View,
  Text,
  TextStyle,
  ViewStyle,
} from "horizon/ui";

function pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export class DigitalClock extends UIComponent<typeof DigitalClock> {
  
  static propsDefinition = {
    clockColor: {
      type: PropTypes.Color,
      default: new Color(0, 1, 0),
    },
    hourOffset: {
      type: PropTypes.Number,
      default: 0,
    },
    minuteOffset: {
      type: PropTypes.Number,
      default: 0,
    },
  };

  
  private readonly timeBinding = new Binding("00:00:00");
  private readonly colorBinding = new Binding("#00FF00");


  private lastKnownColor: string = "";
  private lastKnownHourOffset: number = 0;
  private lastKnownMinuteOffset: number = 0;

  
  override initializeUI(): UINode {
    const containerStyle: ViewStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const textStyle: TextStyle = {
      fontSize: 60,
      fontWeight: "bold",
      color: this.colorBinding,
    };

    return View({
      style: containerStyle,
      children: [
        Text({
          text: this.timeBinding,
          style: textStyle
        })
      ]
    });
  }

  
  override start() {
    
    const initialColorHex = this.props.clockColor.toHex();
    const initialHourOffset = this.props.hourOffset;
    const initialMinuteOffset = this.props.minuteOffset;
    
    
    this.lastKnownColor = initialColorHex;
    this.lastKnownHourOffset = initialHourOffset;
    this.lastKnownMinuteOffset = initialMinuteOffset;
    
  
    this.colorBinding.set(initialColorHex);
    
    
    this.async.setInterval(() => this.updateTime(), 1000);
  }

 
  private updateTime() {
  
    

    const currentColorHex = this.props.clockColor.toHex();
    if (currentColorHex !== this.lastKnownColor) {
      this.colorBinding.set(currentColorHex);
      this.lastKnownColor = currentColorHex;
    }


    if (this.props.hourOffset !== this.lastKnownHourOffset) {
      this.lastKnownHourOffset = this.props.hourOffset;
    }
    

    if (this.props.minuteOffset !== this.lastKnownMinuteOffset) {
      this.lastKnownMinuteOffset = this.props.minuteOffset;
    }

   
    const now = new Date();
    now.setHours(now.getHours() + this.lastKnownHourOffset);
    now.setMinutes(now.getMinutes() + this.lastKnownMinuteOffset);

    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    this.timeBinding.set(timeStr);
  }
}

Component.register(DigitalClock);