import { Component, NetworkEvent, Player, World } from "horizon/core";
import { AnimatedBinding, Animation, Bindable, Binding, Easing, Text, TextStyle, UIComponent, UINode, View, ViewProps, ViewStyle } from "horizon/ui";

export const BigBox_ToastEvents = {
  /**
   * Event that's broadcast on the server and the client. Send it like this:
   * this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
   *   player: owner,
   *   text: "Text message"
   * });
   */
  textToast: new NetworkEvent<{ player: Player, text: string }>('textToast'),
};

export class BigBox_Toast_UI_Utils {
  // Create text with an outline - The nastiest h4XX0r the world has ever known
  static outlineText(text: Bindable<string>, outlineSize: number, textStyle: TextStyle) {
    return View({
      children: [
        Text({ text, style: { textShadowOffset: [-outlineSize, -outlineSize], ...textStyle } }),
        // Absolute position so this will stack directly over the main text object
        Text({ text, style: { textShadowOffset: [outlineSize, -outlineSize], position: "absolute", ...textStyle } }),
        Text({ text, style: { textShadowOffset: [-outlineSize, outlineSize], position: "absolute", ...textStyle } }),
        Text({ text, style: { textShadowOffset: [outlineSize, outlineSize], position: "absolute", ...textStyle } }),
      ],
      style: {
        flexDirection: "row",
        justifyContent: "center",
      },
    });
  }
}

class BigBox_UI_ToastHud extends UIComponent<typeof BigBox_UI_ToastHud> {
  static propsDefinition = {};

  // Config
  private readonly defaultTextSize = 24;
  private readonly outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size
  private readonly outlineSize = this.defaultTextSize * this.outlineSizeMult;
  private readonly toastHeight = 32;
  private readonly moveTime = 300;
  private readonly fadeOutTime = 300;
  private readonly showTime = 2500; // How long the toast is shown
  private readonly maxToasts = 5;

  // Debugging
  private readonly runTestToast: boolean = false; // If true, will output test toasts on start

  // Define bindings for the custom UI
  private toastPanelHeightOffset = new AnimatedBinding(0);

  private toastTextBindingArray: Binding<string>[] = Array.from({ length: this.maxToasts }, () => new Binding(""));
  private toastOpacityBindingArray: AnimatedBinding[] = Array.from({ length: this.maxToasts }, () => new AnimatedBinding(0));
  private toastTextArray: string[] = new Array(this.maxToasts).fill("");

  private toastPopping: boolean = false; // True if the UI is currently moving up to "pop" the toast
  private toastQueue: string[] = [];
  private toastCleanupQueue: string[] = [];
  private toastFadingOutQueue: string[] = [];
  private toastsActive: number = 0;
  private serverPlayer: Player | null = null;

  start() {
    // Check if this is running on the Server or Client
    this.serverPlayer = World.prototype.getServerPlayer();
    let owner = this.entity.owner.get();
    let localPlayer = owner === null || owner === this.serverPlayer ? null : owner;

    // Only attach listeners if this is running on the local player
    if (localPlayer) {
      this.connectNetworkBroadcastEvent(BigBox_ToastEvents.textToast, this.onLocalTextToast.bind(this));

      // Debugging feature for sending fake test toast events
      if (this.runTestToast) {
        this.testToast();
      }
    }
  }

  private onLocalTextToast(payload: { player: Player, text: string }) {
    // Only listen to client side broadcasts that reference our player
    let owner = this.entity.owner.get();
    let localPlayer = owner === null || owner === this.serverPlayer ? null : owner;

    if (localPlayer && localPlayer == payload.player) {
      // Recieved toast event, add it to the queue
      console.log(`BigBox_UI_ToastHud: Toasty text ${payload.text}`);

      this.toastQueue.push(payload.text);
      this.popNextToast();
    }
  }

  private popNextToast() {
    if (this.toastQueue.length == 0 || this.toastsActive >= this.maxToasts) {
      // Out of messages or too many toasts already active
      return;
    }

    if (this.toastPopping || this.toastFadingOutQueue.length > 0) {
      // Don't activate again if this is already moving or fading out to avoid interruption
      return;
    }

    this.toastPopping = true;
    this.toastsActive++;
    let currentText = this.toastQueue.shift()!;
    this.toastCleanupQueue.push(currentText);

    let owner = this.entity.owner.get();

    // Shift all existing text to the next slot
    for (let i = this.toastTextArray.length - 1; i > 0; --i) {
      this.toastTextArray[i] = this.toastTextArray[i - 1];
      this.toastTextBindingArray[i].set(this.toastTextArray[i]);

      if (this.toastTextArray[i].length > 0) {
        // Make sure it's visible if it has text
        this.toastOpacityBindingArray[i].set(1, () => { }, [owner]);
      }
    }

    // Set the new text
    this.toastTextArray[0] = currentText;
    this.toastTextBindingArray[0].set(this.toastTextArray[0]);

    // Fade in the new toast
    this.toastOpacityBindingArray[0].set(0, () => { }, [owner]);
    this.toastOpacityBindingArray[0].set(
      Animation.timing(
        1,
        { duration: this.moveTime, easing: Easing.in(Easing.quad) }
      ),
      (finished: boolean, player: Player) => { },
      [owner]
    );

    // Force the height down
    this.toastPanelHeightOffset.set(-this.toastHeight, () => { }, [owner]);

    // Rise up the toast to pop it from the toaster
    this.toastPanelHeightOffset.set(
      Animation.timing(
        0,
        { duration: this.moveTime, easing: Easing.in(Easing.quad) }
      ),
      (finished: boolean, player: Player) => {
        if (finished) {
          // Done popping up, allow new toasts to pop
          console.log(`BigBox_UI_ToastHud: Done popping toast ${currentText}`);

          this.toastPopping = false;

          // Try to pop any new toasts that have shown up
          this.popNextToast();

          // Clean up this toast after show time
          this.async.setTimeout(() => {
            // Block other toasts from popping while this fades out to avoid interruption
            this.toastFadingOutQueue.push(this.toastCleanupQueue.shift()!);
            let currentIndex = this.toastCleanupQueue.length;

            // Fade it out
            this.toastOpacityBindingArray[currentIndex].set(
              Animation.timing(
                0,
                { duration: this.fadeOutTime, easing: Easing.in(Easing.quad) }
              ),
              (finished: boolean, player: Player) => {
                if (finished) {
                  this.toastsActive--;
                  this.toastFadingOutQueue.shift();

                  // Clear out the text
                  this.toastTextArray[currentIndex] = "";
                  this.toastTextBindingArray[currentIndex].set(this.toastTextArray[currentIndex]);

                  // Try to pop any new toasts that have shown up
                  this.popNextToast();
                }
              },
              [owner]
            );
          }, this.showTime);
        }
      },
      [owner]
    );
  }

  // Creates the toast UI element which will be a constant height
  private CreateToastView(text: Bindable<string>, opacity: AnimatedBinding): UINode<ViewProps> {
    const textStyle: TextStyle = {
      fontFamily: "Roboto",
      color: "white",
      opacity: opacity,
      fontWeight: "700",
      fontSize: this.defaultTextSize,
      alignItems: "center",
      textAlign: "center",
    }

    return View({
      children: [
        BigBox_Toast_UI_Utils.outlineText(text, this.outlineSize, textStyle),
      ],
      style: {
        height: this.toastHeight,
      }
    });
  }

  // Returns an array of UI toasts
  private createToastViewArray(): UINode[] {
    let array: UINode[] = new Array();

    for (let i = 0; i < this.maxToasts; ++i) {
      array.push(this.CreateToastView(this.toastTextBindingArray[i], this.toastOpacityBindingArray[i]))
    }

    return array;
  }

  initializeUI() {
    // Panel that contains all toast elements
    const toastPanelView = View({
      children: this.createToastViewArray(),
      style: {
        flexDirection: "column-reverse", // Ensure children are laid out top to bottom, with the 1st at the bottom
        alignItems: "center", // Center align vertically
        bottom: this.toastPanelHeightOffset, // Offset from the bottom of the parent view
      },
    });

    const rootPanelStyle: ViewStyle = {
      width: "50%",
      height: "70%",
      position: "absolute",
      justifyContent: "flex-end", // Align vertical to the bottom
      alignContent: "center",
      alignSelf: "center",
      alignItems: "center", // Align horizontal to the middle
    }

    return View({//Root Panel + Panel Background Image
      children: [
        toastPanelView,
      ],
      style: rootPanelStyle,
    });
  }

  //#region testToast
  private testToast(): void {
    let owner = this.entity.owner.get();
    this.async.setTimeout(() => {
      this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
        player: owner,
        text: "You're not standing on diggable terrain."
      });

      // SPAMMMMMMMMMMMMMMMMMMMMMMMM
      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You've dug here recently.0"
        });
      }, 50);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You failed to dig up this pile.1"
        });
      }, 150);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You've dug here recently.2"
        });
      }, 250);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You failed to dig up this pile.3"
        });
      }, 1500);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You've dug here recently.4"
        });
      }, 1500);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You failed to dig up this pile.5"
        });
      }, 2500);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You've dug here recently.6"
        });
      }, 4500);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You failed to dig up this pile.7"
        });
      }, 10000);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You've dug here recently.8"
        });
      }, 12500);

      this.async.setTimeout(() => {
        this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
          player: owner,
          text: "You failed to dig up this pile.9"
        });
      }, 12700);

    }, 1000);
  }
  //#endregion testToast
}
Component.register(BigBox_UI_ToastHud);
