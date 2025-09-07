"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBox_Toast_UI_Utils = exports.BigBox_ToastEvents = void 0;
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
exports.BigBox_ToastEvents = {
    /**
     * Event that's broadcast on the server and the client. Send it like this:
     * this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
     *   player: owner,
     *   text: "Text message"
     * });
     */
    textToast: new core_1.NetworkEvent('textToast'),
};
class BigBox_Toast_UI_Utils {
    // Create text with an outline - The nastiest h4XX0r the world has ever known
    static outlineText(text, outlineSize, textStyle) {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text, style: { textShadowOffset: [-outlineSize, -outlineSize], ...textStyle } }),
                // Absolute position so this will stack directly over the main text object
                (0, ui_1.Text)({ text, style: { textShadowOffset: [outlineSize, -outlineSize], position: "absolute", ...textStyle } }),
                (0, ui_1.Text)({ text, style: { textShadowOffset: [-outlineSize, outlineSize], position: "absolute", ...textStyle } }),
                (0, ui_1.Text)({ text, style: { textShadowOffset: [outlineSize, outlineSize], position: "absolute", ...textStyle } }),
            ],
            style: {
                flexDirection: "row",
                justifyContent: "center",
            },
        });
    }
}
exports.BigBox_Toast_UI_Utils = BigBox_Toast_UI_Utils;
class BigBox_UI_ToastHud extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // Config
        this.defaultTextSize = 24;
        this.outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size
        this.outlineSize = this.defaultTextSize * this.outlineSizeMult;
        this.toastHeight = 32;
        this.moveTime = 300;
        this.fadeOutTime = 300;
        this.showTime = 2500; // How long the toast is shown
        this.maxToasts = 5;
        // Debugging
        this.runTestToast = false; // If true, will output test toasts on start
        // Define bindings for the custom UI
        this.toastPanelHeightOffset = new ui_1.AnimatedBinding(0);
        this.toastTextBindingArray = Array.from({ length: this.maxToasts }, () => new ui_1.Binding(""));
        this.toastOpacityBindingArray = Array.from({ length: this.maxToasts }, () => new ui_1.AnimatedBinding(0));
        this.toastTextArray = new Array(this.maxToasts).fill("");
        this.toastPopping = false; // True if the UI is currently moving up to "pop" the toast
        this.toastQueue = [];
        this.toastCleanupQueue = [];
        this.toastFadingOutQueue = [];
        this.toastsActive = 0;
        this.serverPlayer = null;
        //#endregion testToast
    }
    start() {
        // Check if this is running on the Server or Client
        this.serverPlayer = core_1.World.prototype.getServerPlayer();
        let owner = this.entity.owner.get();
        let localPlayer = owner === null || owner === this.serverPlayer ? null : owner;
        // Only attach listeners if this is running on the local player
        if (localPlayer) {
            this.connectNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, this.onLocalTextToast.bind(this));
            // Debugging feature for sending fake test toast events
            if (this.runTestToast) {
                this.testToast();
            }
        }
    }
    onLocalTextToast(payload) {
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
    popNextToast() {
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
        let currentText = this.toastQueue.shift();
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
        this.toastOpacityBindingArray[0].set(ui_1.Animation.timing(1, { duration: this.moveTime, easing: ui_1.Easing.in(ui_1.Easing.quad) }), (finished, player) => { }, [owner]);
        // Force the height down
        this.toastPanelHeightOffset.set(-this.toastHeight, () => { }, [owner]);
        // Rise up the toast to pop it from the toaster
        this.toastPanelHeightOffset.set(ui_1.Animation.timing(0, { duration: this.moveTime, easing: ui_1.Easing.in(ui_1.Easing.quad) }), (finished, player) => {
            if (finished) {
                // Done popping up, allow new toasts to pop
                console.log(`BigBox_UI_ToastHud: Done popping toast ${currentText}`);
                this.toastPopping = false;
                // Try to pop any new toasts that have shown up
                this.popNextToast();
                // Clean up this toast after show time
                this.async.setTimeout(() => {
                    // Block other toasts from popping while this fades out to avoid interruption
                    this.toastFadingOutQueue.push(this.toastCleanupQueue.shift());
                    let currentIndex = this.toastCleanupQueue.length;
                    // Fade it out
                    this.toastOpacityBindingArray[currentIndex].set(ui_1.Animation.timing(0, { duration: this.fadeOutTime, easing: ui_1.Easing.in(ui_1.Easing.quad) }), (finished, player) => {
                        if (finished) {
                            this.toastsActive--;
                            this.toastFadingOutQueue.shift();
                            // Clear out the text
                            this.toastTextArray[currentIndex] = "";
                            this.toastTextBindingArray[currentIndex].set(this.toastTextArray[currentIndex]);
                            // Try to pop any new toasts that have shown up
                            this.popNextToast();
                        }
                    }, [owner]);
                }, this.showTime);
            }
        }, [owner]);
    }
    // Creates the toast UI element which will be a constant height
    CreateToastView(text, opacity) {
        const textStyle = {
            fontFamily: "Roboto",
            color: "white",
            opacity: opacity,
            fontWeight: "700",
            fontSize: this.defaultTextSize,
            alignItems: "center",
            textAlign: "center",
        };
        return (0, ui_1.View)({
            children: [
                BigBox_Toast_UI_Utils.outlineText(text, this.outlineSize, textStyle),
            ],
            style: {
                height: this.toastHeight,
            }
        });
    }
    // Returns an array of UI toasts
    createToastViewArray() {
        let array = new Array();
        for (let i = 0; i < this.maxToasts; ++i) {
            array.push(this.CreateToastView(this.toastTextBindingArray[i], this.toastOpacityBindingArray[i]));
        }
        return array;
    }
    initializeUI() {
        // Panel that contains all toast elements
        const toastPanelView = (0, ui_1.View)({
            children: this.createToastViewArray(),
            style: {
                flexDirection: "column-reverse", // Ensure children are laid out top to bottom, with the 1st at the bottom
                alignItems: "center", // Center align vertically
                bottom: this.toastPanelHeightOffset, // Offset from the bottom of the parent view
            },
        });
        const rootPanelStyle = {
            width: "50%",
            height: "70%",
            position: "absolute",
            justifyContent: "flex-end", // Align vertical to the bottom
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center", // Align horizontal to the middle
        };
        return (0, ui_1.View)({
            children: [
                toastPanelView,
            ],
            style: rootPanelStyle,
        });
    }
    //#region testToast
    testToast() {
        let owner = this.entity.owner.get();
        this.async.setTimeout(() => {
            this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                player: owner,
                text: "You're not standing on diggable terrain."
            });
            // SPAMMMMMMMMMMMMMMMMMMMMMMMM
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You've dug here recently.0"
                });
            }, 50);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You failed to dig up this pile.1"
                });
            }, 150);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You've dug here recently.2"
                });
            }, 250);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You failed to dig up this pile.3"
                });
            }, 1500);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You've dug here recently.4"
                });
            }, 1500);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You failed to dig up this pile.5"
                });
            }, 2500);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You've dug here recently.6"
                });
            }, 4500);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You failed to dig up this pile.7"
                });
            }, 10000);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You've dug here recently.8"
                });
            }, 12500);
            this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(exports.BigBox_ToastEvents.textToast, {
                    player: owner,
                    text: "You failed to dig up this pile.9"
                });
            }, 12700);
        }, 1000);
    }
}
BigBox_UI_ToastHud.propsDefinition = {};
core_1.Component.register(BigBox_UI_ToastHud);
