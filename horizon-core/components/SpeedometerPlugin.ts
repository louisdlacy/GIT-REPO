
/**
 * Speedometer Plugin
 * Created by Chesstar Xiumo
 */

import * as hz from 'horizon/core';
import {
  UIComponent,
  View,
  Text,
  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
  Image,
  ImageSource,
  ImageStyle,
  DimensionValue,
  AvatarImageExpressions,
} from "horizon/ui";

class SpeedometerPlugin extends UIComponent<typeof SpeedometerPlugin> {

  static propsDefinition = {
    DashboardBg: { type: hz.PropTypes.Asset }, // Dashboard background image
    Needle: { type: hz.PropTypes.Asset }, // Dashboard needle image 
  };
  Options = {
    position: new hz.Vec3(0, 0, 0),
    fontSize: 3,
    fontColor: new hz.Color(0, 0, 0),
    backgroundColor: new hz.Color(1, 1, 1),
    playSound: true,
  };
  // Following are fixed values (no variables permitted) for the height and width of the custom UI panel.
  panelHeight = 400;
  panelWidth = 800;

  speedText = new Binding<string>('');  // Speed text
  speedValue = 0;
  speedTitleText = new Binding<string>('');  // Speed title text

  _Needle = new Binding<ImageSource>(''); // Dashboard needle binding
  _DashboardBg = new Binding<ImageSource>(''); // Dashboard background binding

  speedNeedleRotation = new Binding<string>('');

  initializeUI() {
    // Here, we set the values of the bindings using the set() method.
    this.speedText.set('0')
    this.speedValue = 0;
    this.speedTitleText.set('SPEED.')

    this._Needle.set(ImageSource.fromTextureAsset(this.props.Needle!)) // Initialize needle image
    this._DashboardBg.set(ImageSource.fromTextureAsset(this.props.DashboardBg!)) // Initialize dashboard background image


    return View({
      children: [

        // Flight UI
        View({
          children: [
            // Information text next to dashboard
            View({
              children: [
                Text({
                  text: "This is a speed meter 2D UI plugin.\nBuilt with custom UI. Run directly to see\nthe dashboard effect in the center of the screen.",
                  style: {
                    color: "white",
                    fontSize: 14,
                    fontWeight: "normal",
                    textAlign: 'left',
                    padding: 15,
                    lineHeight: 20,
                  }
                }),
              ],
              style: {
                backgroundColor: "black",
                borderRadius: 8,
                position: 'absolute',
                left: -200, // Position next to dashboard (dashboard width 280 + some margin)
                top: 50,
                width: 280,
                opacity: 0.9,
              }
            }),
            // Dashboard area - parent container for all dashboard related elements
            View({
              children: [
                // Speed dashboard
                View({
                  children: [
                    // Dashboard background image - replaces the original circular View
                    Image({
                      source: this._DashboardBg,
                      style: {
                        width: 280, // Doubled: 140 * 2
                        height: 160,  // Doubled: 80 * 2
                        position: 'absolute',
                        top: 0, // Repositioned
                        left: 0, // Positioned relative to parent container
                      }
                    }),
                    // Needle center point
                    View({
                      style: {
                        width: 16, // Doubled: 8 * 2
                        height: 16, // Doubled: 8 * 2
                        borderRadius: 8, // Doubled: 4 * 2
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: 122, // Moved down 50: 72 + 50
                        left: 132, // Centered: 280/2 - 16/2
                        zIndex: 10,
                      }
                    }),
                    // Needle - using dedicated needle image
                    Image({
                      source: this._Needle, // Using dedicated needle image
                      style: {
                        width: 89, // Actual size: 89
                        height: 256, // Actual size: 256
                        position: 'absolute',
                        top: 2, // Moved down 50: -48 + 50
                        left: 95, // Centered: 280/2 - 89/2 = 140 - 44.5 ≈ 95
                        transform: [{ rotate: this.speedNeedleRotation }],
                        zIndex: 5,
                      }
                    }),
                    // Speed value display
                    Text({
                      text: this.speedText,
                      style: {
                        color: "#00ff88",
                        fontSize: 32, // Doubled: 16 * 2
                        fontWeight: "bold",
                        textAlign: 'center',
                        position: 'absolute',
                        width: 160, // Doubled: 80 * 2
                        top: 140, // Improved position: moved up 30px
                        left: 60, // Centered: 280/2 - 160/2
                        fontFamily: "Anton",
                      }
                    }),
                    // Speed title
                    Text({
                      text: "SPEED",
                      style: {
                        color: "white",
                        fontSize: 24, // Doubled: 12 * 2
                        textAlign: 'center',
                        position: 'absolute',
                        width: 160, // Doubled: 80 * 2
                        top: 175, // Adjusted position: 140 + 35
                        left: 60, // Centered: 280/2 - 160/2
                        fontFamily: "Bangers",
                      }
                    }),
                  ],
                  style: {
                    width: 280, // Doubled: 140 * 2
                    height: 360, // Doubled: 180 * 2
                    position: 'absolute',
                    left: 0, // Positioned relative to parent container
                    top: 0,
                  }
                }),

              ],
              style: {
                width: 280,
                height: 360,
                position: 'relative', // Changed to relative positioning for natural flow in parent container
                alignItems: "center",
                justifyContent: "center",
              }
            }),
          ],
          style: {
            width: 500, // Total width including dashboard and distance display
            height: 360,
            position: 'relative', // Changed to relative positioning
            alignItems: "center",
            justifyContent: "center",
          }
        }),

      ],
      style: {
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center", // Vertical center
        alignItems: "center", // Horizontal center
        top: 0,
        left: 0,
      }
    });
  };

  ownerId: hz.Player | null = null;


  start() {

    // For use as character child object, please uncomment the code below to bind owner to this CustomUI component
    if (this.entity.owner.get() == null || this.entity.owner.get() == this.world.getServerPlayer()) {
      this.entity.visible.set(false);
      return;
    }
    console.log('start');
    this.entity.visible.set(true);

    this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => { this.updateVelHudDEMO(data.deltaTime) });


  }


  testVel = 0;
  /// Update HUD speed information
  updateVelHudDEMO(deltaTime: number) {
    this.testVel += deltaTime * 100;
    if (this.testVel > 250) this.testVel = 0;

    // Update speed value and display
    this.speedValue = this.testVel;
    this.speedText.set(Math.round(this.testVel).toString());

    // Update speed dashboard needle
    this.updateSpeedometer(this.testVel);

  }

  // Update speed dashboard needle
  updateSpeedometer(speed: number) {
    // Map speed to dashboard range (0-200 m/s corresponds to -90 degrees to 90 degrees)
    const maxSpeed = 200; // Maximum display speed 200 m/s
    const clampedSpeed = Math.min(speed, maxSpeed);

    // Calculate needle angle: -90 degrees (0 m/s) to 90 degrees (200 m/s)
    const angleRange = 180; // Total angle range
    const speedRatio = clampedSpeed / maxSpeed;
    const needleAngle = -90 + (speedRatio * angleRange);

    // Update needle angle and speed percentage (convert to string)
    this.speedNeedleRotation.set(needleAngle.toFixed(1) + "deg");
  }




};
UIComponent.register(SpeedometerPlugin);
