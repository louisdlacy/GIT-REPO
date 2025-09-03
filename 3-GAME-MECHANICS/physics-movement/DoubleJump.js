"use strict";
/*  __                                          __
   |  |      ________    _______      ______   |  |
   |  |     |   __   |  |   ____|   / ___'  |  |  |
   |  |     |  |  |  |  |  |       | |   |  |  |  |
   |  |___  |  |__|  |  |  |____   | |__/|  |  |  |
   |______| |________|  |_______|   \___/|__|  |__|

   Double Jump
   Made by Proto_XR, 2024
*/
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const jumpIcon = new core_1.TextureAsset(BigInt('1007560121555666'));
const button = {
    up: '#ffffffcc',
    down: '#ffffff88',
};
class PlayerLocalInput extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 180;
        this.panelWidth = 180;
        this.Player = undefined;
        this.inAir = 0;
        this.JumpCount = 0;
        this.input = undefined;
    }
    initializeUI() {
        const jumpColor = new ui_1.Binding(button.up);
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Pressable)({
                    children: [
                        (0, ui_1.Image)({
                            source: ui_1.ImageSource.fromTextureAsset(jumpIcon),
                            style: {
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                            },
                        }),
                    ],
                    onPress: (player) => {
                        this.multipleJumps(true);
                        jumpColor.set(button.down);
                    },
                    onRelease: (player) => {
                        jumpColor.set(button.up);
                    },
                    style: {
                        height: '100%',
                        width: '100%',
                        backgroundColor: jumpColor,
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: 'black',
                    },
                }),
            ],
            style: {
                width: this.panelWidth,
                height: this.panelHeight,
                position: 'absolute',
                top: 360,
                left: 1050,
            },
        });
    }
    start() {
        if (this.entity.owner.get() !== this.world.getServerPlayer()) {
            this.Player = this.entity.owner.get();
            this.JumpCount = 0;
            if (this.Player.deviceType.get() === core_1.PlayerDeviceType.Mobile) {
                this.Player.jumpSpeed.set(0.5);
                this.entity.visible.set(this.props.ShowAlternateJumpButton);
            }
            else
                this.entity.visible.set(false);
            this.input = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.Jump, core_1.ButtonIcon.Jump, this, { preferredButtonPlacement: core_1.ButtonPlacement.Default });
            this.input.registerCallback((action, pressed) => {
                this.multipleJumps(pressed);
            });
        }
        else {
            this.entity.visible.set(false);
            this.input?.disconnect();
            this.input = undefined;
            this.JumpCount = 0;
            this.Player = undefined;
            this.dispose();
        }
    }
    multipleJumps(pressed) {
        if (pressed && this.Player) {
            if (this.JumpCount === 0) {
                this.inAir = this.async.setInterval(() => this.resetJumpCount(), 100);
            }
            let pv = this.Player.velocity.get();
            this.JumpCount += 1;
            if (this.JumpCount <= 2) {
                if (this.Player.deviceType.get() === core_1.PlayerDeviceType.Mobile && this.JumpCount === 1) {
                    this.Player.playAvatarGripPoseAnimationByName('Hero');
                    this.Player.velocity.set(new core_1.Vec3(pv.x, (0, core_1.clamp)(pv.y + 4.3, 0, 20), pv.z));
                }
                else {
                    this.Player?.velocity.set(new core_1.Vec3(pv.x, (0, core_1.clamp)(pv.y + this.Player.deviceType.get() === core_1.PlayerDeviceType.VR ? 15 : 5, 0, 20), pv.z));
                    this.props.JumpSound?.position.set(this.Player.position.get());
                    this.props.JumpSound?.as(core_1.AudioGizmo).play({ fade: 0, players: [this.Player], audibilityMode: core_1.AudibilityMode.AudibleTo });
                }
            }
            else {
                this.JumpCount = 2;
            }
        }
    }
    resetJumpCount() {
        if (this.Player?.isGrounded.get()) {
            this.JumpCount = 0;
            this.async.clearInterval(this.inAir);
        }
    }
}
PlayerLocalInput.propsDefinition = {
    JumpSound: { type: core_1.PropTypes.Entity },
    ShowAlternateJumpButton: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(PlayerLocalInput);
