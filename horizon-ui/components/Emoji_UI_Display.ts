//--- SCRIPT: Emoji_UI_Display.ts ---//
// SERVER UI SCRIPT
// REVISED (v0.28): Accelerated the initial fade-in to make the emoji visible earlier.
// REVISED (v0.27): Changed end animation to a simple fade-out while moving upwards.
// REVISED (v0.26): Adjusted animation to have an upward "lift" and a vertical hop.
// REVISED (v0.25): Changed animation easing to Easing.back for a more energetic "pop" effect.
// REVISED (v0.24): Fixed a TypeScript error by restructuring the UI to use a separate View for the background animation.
// REVISED (v0.23): Added delayed fade-in for the background panel.
// REVISED (v0.22): Fixed TypeScript errors related to transform bindings.

import { UIComponent, View, UINode, Binding, AnimatedBinding, Image, ImageSource, Animation, Easing, AnimatedInterpolation } from 'horizon/ui';
import * as hz from 'horizon/core';
import { Color } from 'horizon/core';
import { EmojiAssetInfo, RelayInitializePopupEvent } from './Emoji_Globals';

export class Emoji_UI_Display extends UIComponent<typeof Emoji_UI_Display> {
    static propsDefinition = {};

    panelHeight = 250;
    panelWidth = 250;

    // --- PRIVATE STATE --- //
    private _sourceBinding = new Binding<ImageSource | null>(null);
    private _scaleAnimBinding = new AnimatedBinding(0);
    private _rotationAnimBinding = new AnimatedBinding(0);
    private _backgroundColorBinding = new Binding<Color>(new hz.Color(0, 0, 0));
    private _backgroundAnimOpacityBinding = new AnimatedBinding(0);
    // NEW (v0.27): Dedicated binding for overall component opacity for fade-in/out.
    private _overallOpacityBinding = new AnimatedBinding(0);
    private _hideTimer: number | null = null;

    // --- ANIMATION STATE --- //
    private _isAnimatingPosition = false;
    private _animStartTime = 0;
    private _animDuration = 0;
    private _animStartPosition = hz.Vec3.zero;
    private _animTargetPosition = hz.Vec3.zero;
    private _isAnimatingHop = false;
    private _hopPeakHeight = 0;

    start() {
        this.entity.visible.set(false);

        const parent = this.entity.parent.get();
        if (parent) {
            this.connectNetworkEvent(parent, RelayInitializePopupEvent, (data) => {
                if (!data) return;

                const asset = new hz.Asset(data.emojiAssetInfo.assetId, data.emojiAssetInfo.versionId);
                try {
                    const imageSource = ImageSource.fromTextureAsset(asset.as(hz.TextureAsset));
                    this.showEmoji(imageSource, data, data.startPosition, data.restingPosition, data.exitPosition);
                } catch (e) {
                    console.error(`Emoji_UI_Display: Failed to create ImageSource from asset. Error: ${e}`);
                }
            });
        }

        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data: { deltaTime: number }) => {
            if (this._isAnimatingPosition) {
                const elapsedTime = Date.now() - this._animStartTime;
                const animProgress = Math.min(elapsedTime / this._animDuration, 1.0);

                const newPos = hz.Vec3.lerp(this._animStartPosition, this._animTargetPosition, animProgress);
                if (this._isAnimatingHop) {
                    const hopOffset = this._hopPeakHeight * Math.sin(animProgress * Math.PI);
                    newPos.y += hopOffset;
                }
                
                this.entity.transform.localPosition.set(newPos);

                if (animProgress >= 1.0) {
                    this._isAnimatingPosition = false;
                    this._isAnimatingHop = false;
                }
            }
        });
    }

    initializeUI(): UINode {
        const rotationString: AnimatedInterpolation<string> = this._rotationAnimBinding.interpolate(
            [-5, 0, 25], 
            ['-5deg', '0deg', '25deg']
        );

        return View({
            style: {
                width: '100%',
                height: '100%',
                opacity: this._overallOpacityBinding,
                transform: [
                    { scale: this._scaleAnimBinding },
                    { rotate: rotationString }
                ],
                justifyContent: 'center',
                alignItems: 'center',
            },
            children: [
                View({
                    style: {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: this._backgroundColorBinding,
                        borderRadius: this.panelWidth / 2,
                        opacity: this._backgroundAnimOpacityBinding,
                    }
                }),
                UINode.if(
                    this._sourceBinding.derive(source => source !== null),
                    Image({
                        source: this._sourceBinding,
                        style: { width: '100%', height: '100%' }
                    })
                )
            ]
        });
    }

    private showEmoji(
        imageSource: ImageSource,
        data: {
            popupFadeInMilliseconds: number,
            popupFadeOutMilliseconds: number,
            popupDurationMilliseconds: number,
            emojiPanelColor: Color,
            popupShowBackground: boolean,
            popupBackgroundOpacity: number
        },
        startPos: hz.Vec3,
        restingPos: hz.Vec3,
        exitPos: hz.Vec3
    ) {
        if (this._hideTimer !== null) {
            this.async.clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }

        this._backgroundColorBinding.set(data.emojiPanelColor);
        this.entity.visible.set(true);
        this._sourceBinding.set(imageSource);
        
        // --- START ANIMATION ---
        this._scaleAnimBinding.set(0);
        this._rotationAnimBinding.set(25);
        this._backgroundAnimOpacityBinding.set(0);
        this._overallOpacityBinding.set(0);

        const popInDuration = data.popupFadeInMilliseconds;
        
        // REVISED (v0.28): Make the fade-in twice as fast as the rest of the pop-in animation.
        this._overallOpacityBinding.set(Animation.timing(1, { duration: popInDuration * 0.5 }));
        
        const popInAnimation = Animation.sequence(
            Animation.timing(1.5, { duration: popInDuration * 0.7, easing: Easing.out(Easing.cubic) }),
            Animation.timing(1.0, { duration: popInDuration * 0.3, easing: Easing.in(Easing.ease) })
        );

        this._scaleAnimBinding.set(popInAnimation);
        this._rotationAnimBinding.set(Animation.timing(0, { duration: popInDuration, easing: Easing.out(Easing.back) }));
        
        this.startPositionAnimation(startPos, restingPos, popInDuration, true, 0.75);

        this.async.setTimeout(() => {
            if (this.entity.exists() && data.popupShowBackground) {
                this._backgroundAnimOpacityBinding.set(Animation.timing(data.popupBackgroundOpacity, { duration: 500 }));
            }
        }, popInDuration);


        // --- HIDE TIMER ---
        this._hideTimer = this.async.setTimeout(() => {
            // --- REVISED END ANIMATION (v0.27) ---
            const fadeOutDuration = data.popupFadeOutMilliseconds;
            
            // Fade out the main element and background. Opacity hits 0 at 75% of the animation duration.
            const fadeAnimationDuration = fadeOutDuration * 0.75;
            this._overallOpacityBinding.set(Animation.timing(0, { duration: fadeAnimationDuration }));
            this._backgroundAnimOpacityBinding.set(Animation.timing(0, { duration: fadeAnimationDuration }));
            
            // No scaling or rotation changes.

            // The upward movement animation takes the full duration.
            this.startPositionAnimation(restingPos, exitPos, fadeOutDuration, false, 0);

            // Cleanup after the full movement duration is complete.
            this.async.setTimeout(() => {
                if (this.entity.exists() && this.entity.visible.get()) {
                    this.entity.visible.set(false);
                    this._sourceBinding.set(null);
                    this._hideTimer = null;
                    // Reset all animation bindings for the next run.
                    this._scaleAnimBinding.set(0);
                    this._rotationAnimBinding.set(0);
                    this._backgroundAnimOpacityBinding.set(0);
                    this._overallOpacityBinding.set(0);
                }
            }, fadeOutDuration);
        }, data.popupDurationMilliseconds);
    }

    private startPositionAnimation(startPos: hz.Vec3, endPos: hz.Vec3, duration: number, withHop: boolean, hopHeight: number) {
        this._animStartPosition = startPos;
        this._animTargetPosition = endPos;
        this._animDuration = duration;
        this._animStartTime = Date.now();
        this._isAnimatingPosition = true;
        
        this._isAnimatingHop = withHop;
        this._hopPeakHeight = hopHeight;
    }
}

hz.Component.register(Emoji_UI_Display);

