import { finalCallouts, statusColors, UIImages } from 'GnomePOD_Library';
import { AudioGizmo, clamp, Color, Entity, MeshEntity, Player, PropTypes, World } from 'horizon/core';
import { Npc, NpcEngagementPhase, NpcEvents } from 'horizon/npc';
import { Image, ImageSource, Pressable, Text, UIComponent, UINode, View } from 'horizon/ui';

class GnomePod_UI extends UIComponent<typeof GnomePod_UI> {
  protected panelWidth: number = 1920;
  protected panelHeight: number = 540;

  static propsDefinition = {
    voice: {
      type: PropTypes.Entity
    },
    transmitter: {
      type: PropTypes.Entity
    },
    responseSFX: {
      type: PropTypes.Entity
    },
    waitingSFX: {
      type: PropTypes.Entity
    },
    resetSFX: {
      type: PropTypes.Entity
    }
  };

  private frameTick: number = 0;
  private bulb: Entity | undefined;
  private tintStrength: number = 0;
  private voiceState: string = '';
  private lastPlayer: Player | undefined;
  private gnomePodStatus: string = 'idle';
  private pulseLoop: number | undefined;
  private pulseTimeout: number | undefined;

  preStart() {
    this.connectLocalBroadcastEvent(
      World.onUpdate,
      ({ deltaTime }) => this.updateHandler(deltaTime)
    );
  }

  start() {
    if (!this.props.voice) {
      console.error('Missing voice prop on GnomePod');
    } else {
      this.connectNetworkEvent(
        this.props.voice,
        NpcEvents.OnNpcEngagementChanged,
        ({ phase }) => this.updateEngagementPhase(phase)
      );
    };

    if (!this.props.transmitter) {
      console.error('Missing transmitter prop on GnomePod');
    } else {
      this.bulb = this.props.transmitter;
    };

    this.resetGnomePod();

  }

  initializeUI(): UINode {
    return View({
      style: {
        width: this.panelWidth,
        height: this.panelHeight,
        // backgroundColor: '#384e0e',
        borderRadius: 45,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      children: this.makeButtons(),
    });
  }

  makeButtons(): UINode[] {
    const buttons: UINode[] = [];
    Object.entries(UIImages).forEach(([key, image]) => {
      buttons.push(Pressable({
        style: {
          width: '25%',
          aspectRatio: 1,
          borderRadius: 45,
          overflow: 'hidden'
        },
        children: [
          Image({
            source: ImageSource.fromTextureAsset(image),
            style: {
              height: '100%',
              aspectRatio: 1,
            }
          })
        ],
        onClick: (player) => {
          if (this.voiceState === 'Responding') {
            // console.error('IN USE');
            return;
          };
          player.unfocusUI();
          this.generateResponse(key, player);
        }
      }))
    });

    return buttons;
  }

  generateResponse(category: string, player: Player) {
    if (this.props.voice) {
      this.endLoop();

      this.lastPlayer = player;
      const voice = this.props.voice.as(Npc).conversation;
      const playerName = this.lastPlayer.name.get();
      let prompt = '';

      this.gnomePodStatus = 'responding';
      this.startPulse(statusColors.responding);

      if (this.props.responseSFX) {
        this.props.responseSFX.as(AudioGizmo).play();
      }

      switch (category) {
        case 'fact':
          // console.log(`${player.name.get()} selected fact`);
          prompt = `A random real or fantastical fact for ${playerName}, the more random the better`;
          break;
        case 'weather':
          // console.log(`${player.name.get()} selected weather`);
          prompt = `A random real or fantastical weather report for ${playerName}, the more absurd the better`;
          break;
        case 'joke':
          // console.log(`${player.name.get()} selected joke`);
          prompt = `A joke for ${playerName}, the more dry the humor the better`;
          break;
        default:
          console.error('Something went wrong. Please try again');
      };

      //Example of the NPC having freedom to generate its' own response based on the given prompt
      voice?.elicitResponse(prompt).then(() => {
        this.endLoop();

        this.async.setTimeout(() => {
          this.waiting();
        }, 250);
      });
    } else {
      this.world.ui.showPopupForPlayer(player, 'Missing NPC voice. Cannot respond', 3);
    };
  }

  waiting() {
    if (this.props.waitingSFX) {
      this.props.waitingSFX.as(AudioGizmo).play();
    }

    this.gnomePodStatus = 'waiting';
    this.startPulse(statusColors.waiting);

    this.pulseTimeout = this.async.setTimeout(() => {
      if (this.pulseLoop !== undefined) {
        this.async.clearInterval(this.pulseLoop);
      }

      //Example of the .speak() method feeding the NPC an exact script
      this.props.voice?.as(Npc).conversation?.speak(finalCallouts[Math.floor(Math.random() * finalCallouts.length)]).then(() => this.resetGnomePod());
    }, 5_000);
  }

  updateEngagementPhase(phase: NpcEngagementPhase) {
    this.voiceState = NpcEngagementPhase[phase];

    if (this.voiceState == 'Responding') {
      this.startPulse(statusColors.responding);
    }

    if (this.voiceState == 'Idle' && this.gnomePodStatus !== 'waiting') {
      this.endLoop();
    }
  }

  updateHandler(deltaTime: number) {
    if (!this.bulb) return;

    this.frameTick = (this.frameTick + 1) % 4;
    if (this.frameTick !== 0) return;

    if (this.tintStrength > 0) {
      this.tintStrength = clamp(this.tintStrength - (deltaTime * 2), 0, 1);
      this.bulb.as(MeshEntity).style.tintStrength.set(this.tintStrength);
    };
  }

  startPulse(newColor: Color) {
    if (this.bulb) {
      this.bulb.as(MeshEntity).style.tintColor.set(newColor);
      this.tintStrength = 1;

      this.pulseLoop = this.async.setInterval(() => {
        this.pulseIndicator();
      }, 750);
    }
  }

  pulseIndicator() {
    this.tintStrength = 1;
  }

  endLoop() {
    if (this.pulseLoop !== undefined) {
      this.async.clearInterval(this.pulseLoop);
    }

    if (this.pulseTimeout !== undefined) {
      this.async.clearTimeout(this.pulseTimeout);
    }
  }

  resetGnomePod() {
    this.gnomePodStatus = 'idle';

    if (this.bulb) {
      this.bulb.as(MeshEntity).style.tintColor.set(statusColors.idle);
      this.tintStrength = 0;
    };

    if (this.props.resetSFX) {
      this.props.resetSFX.as(AudioGizmo).play();
    }

    // if (this.props.voice) {
    //   this.props.voice.as(Npc).conversation?.speak('Your GnomePod device has reset');
    // };

    this.endLoop();
  }
}
UIComponent.register(GnomePod_UI);
