/*  __                                          __
   |  |      ________    _______      ______   |  |
   |  |     |   __   |  |   ____|   / ___'  |  |  |
   |  |     |  |  |  |  |  |       | |   |  |  |  |
   |  |___  |  |__|  |  |  |____   | |__/|  |  |  |
   |______| |________|  |_______|   \___/|__|  |__|

   Double Jump
   Made by Proto_XR, 2024
*/

import { AudibilityMode, AudioGizmo, ButtonIcon, ButtonPlacement, clamp, Component, Player, PlayerControls, PlayerDeviceType, PlayerInput, PlayerInputAction, PropTypes, TextureAsset, Vec3 } from 'horizon/core';
import { Binding, Image, ImageSource, Pressable, UIComponent, UINode, View } from 'horizon/ui';

export type AllActions = {
  control: PlayerInputAction,
  icon: ButtonIcon,
}

const jumpIcon = new TextureAsset(BigInt('1007560121555666'));

const button = {
  up: '#ffffffcc',
  down: '#ffffff88',
};

class PlayerLocalInput extends UIComponent<typeof PlayerLocalInput> {
  static propsDefinition = {
    JumpSound: { type: PropTypes.Entity },
    ShowAlternateJumpButton: { type: PropTypes.Boolean, default: false },
  };

  panelHeight = 180;
  panelWidth = 180;

  private Player: Player | undefined = undefined;
  private inAir: number = 0;
  private JumpCount: number = 0;
  private input: PlayerInput | undefined = undefined;

  initializeUI(): UINode {
    const jumpColor = new Binding<string>(button.up);
    return View({
      children: [
        Pressable({
          children: [
            Image({
              source: ImageSource.fromTextureAsset(jumpIcon),
              style: {
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              },
            }),
          ],
          onPress: (player: Player) => {this.multipleJumps(true);
            jumpColor.set(button.down);
          },
          onRelease: (player: Player) => {
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
      if (this.Player.deviceType.get() === PlayerDeviceType.Mobile) {
        this.Player.jumpSpeed.set(0.5);
        this.entity.visible.set(this.props.ShowAlternateJumpButton);
      }
      else this.entity.visible.set(false);
      this.input = PlayerControls.connectLocalInput(PlayerInputAction.Jump, ButtonIcon.Jump, this, {preferredButtonPlacement: ButtonPlacement.Default});
      this.input.registerCallback((action: PlayerInputAction, pressed: boolean) => {
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
  multipleJumps(pressed: boolean) {
    if (pressed && this.Player) {
      if (this.JumpCount === 0) {
        this.inAir = this.async.setInterval(() => this.resetJumpCount(), 100);
      }
      let pv = this.Player.velocity.get();
      this.JumpCount += 1;
      if (this.JumpCount <= 2) {
        if (this.Player.deviceType.get() === PlayerDeviceType.Mobile && this.JumpCount === 1) {
          this.Player.playAvatarGripPoseAnimationByName('Hero');
          this.Player.velocity.set(new Vec3(pv.x, clamp(pv.y + 4.3, 0, 20), pv.z));
        }
        else {
          this.Player?.velocity.set(new Vec3(pv.x, clamp(pv.y + this.Player.deviceType.get() === PlayerDeviceType.VR ? 15 : 5, 0, 20), pv.z));
          this.props.JumpSound?.position.set(this.Player!.position.get());
          this.props.JumpSound?.as(AudioGizmo).play({fade: 0, players: [this.Player], audibilityMode: AudibilityMode.AudibleTo});
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
Component.register(PlayerLocalInput);