"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GnomePOD_Library_1 = require("GnomePOD_Library");
const core_1 = require("horizon/core");
const npc_1 = require("horizon/npc");
const ui_1 = require("horizon/ui");
class GnomePod_UI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelWidth = 1920;
        this.panelHeight = 540;
        this.frameTick = 0;
        this.tintStrength = 0;
        this.voiceState = '';
        this.gnomePodStatus = 'idle';
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, ({ deltaTime }) => this.updateHandler(deltaTime));
    }
    start() {
        if (!this.props.voice) {
            console.error('Missing voice prop on GnomePod');
        }
        else {
            this.connectNetworkEvent(this.props.voice, npc_1.NpcEvents.OnNpcEngagementChanged, ({ phase }) => this.updateEngagementPhase(phase));
        }
        ;
        if (!this.props.transmitter) {
            console.error('Missing transmitter prop on GnomePod');
        }
        else {
            this.bulb = this.props.transmitter;
        }
        ;
        this.resetGnomePod();
    }
    initializeUI() {
        return (0, ui_1.View)({
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
    makeButtons() {
        const buttons = [];
        Object.entries(GnomePOD_Library_1.UIImages).forEach(([key, image]) => {
            buttons.push((0, ui_1.Pressable)({
                style: {
                    width: '25%',
                    aspectRatio: 1,
                    borderRadius: 45,
                    overflow: 'hidden'
                },
                children: [
                    (0, ui_1.Image)({
                        source: ui_1.ImageSource.fromTextureAsset(image),
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
                    }
                    ;
                    player.unfocusUI();
                    this.generateResponse(key, player);
                }
            }));
        });
        return buttons;
    }
    generateResponse(category, player) {
        if (this.props.voice) {
            this.endLoop();
            this.lastPlayer = player;
            const voice = this.props.voice.as(npc_1.Npc).conversation;
            const playerName = this.lastPlayer.name.get();
            let prompt = '';
            this.gnomePodStatus = 'responding';
            this.startPulse(GnomePOD_Library_1.statusColors.responding);
            if (this.props.responseSFX) {
                this.props.responseSFX.as(core_1.AudioGizmo).play();
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
            }
            ;
            //Example of the NPC having freedom to generate its' own response based on the given prompt
            voice?.elicitResponse(prompt).then(() => {
                this.endLoop();
                this.async.setTimeout(() => {
                    this.waiting();
                }, 250);
            });
        }
        else {
            this.world.ui.showPopupForPlayer(player, 'Missing NPC voice. Cannot respond', 3);
        }
        ;
    }
    waiting() {
        if (this.props.waitingSFX) {
            this.props.waitingSFX.as(core_1.AudioGizmo).play();
        }
        this.gnomePodStatus = 'waiting';
        this.startPulse(GnomePOD_Library_1.statusColors.waiting);
        this.pulseTimeout = this.async.setTimeout(() => {
            if (this.pulseLoop !== undefined) {
                this.async.clearInterval(this.pulseLoop);
            }
            //Example of the .speak() method feeding the NPC an exact script
            this.props.voice?.as(npc_1.Npc).conversation?.speak(GnomePOD_Library_1.finalCallouts[Math.floor(Math.random() * GnomePOD_Library_1.finalCallouts.length)]).then(() => this.resetGnomePod());
        }, 5000);
    }
    updateEngagementPhase(phase) {
        this.voiceState = npc_1.NpcEngagementPhase[phase];
        if (this.voiceState == 'Responding') {
            this.startPulse(GnomePOD_Library_1.statusColors.responding);
        }
        if (this.voiceState == 'Idle' && this.gnomePodStatus !== 'waiting') {
            this.endLoop();
        }
    }
    updateHandler(deltaTime) {
        if (!this.bulb)
            return;
        this.frameTick = (this.frameTick + 1) % 4;
        if (this.frameTick !== 0)
            return;
        if (this.tintStrength > 0) {
            this.tintStrength = (0, core_1.clamp)(this.tintStrength - (deltaTime * 2), 0, 1);
            this.bulb.as(core_1.MeshEntity).style.tintStrength.set(this.tintStrength);
        }
        ;
    }
    startPulse(newColor) {
        if (this.bulb) {
            this.bulb.as(core_1.MeshEntity).style.tintColor.set(newColor);
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
            this.bulb.as(core_1.MeshEntity).style.tintColor.set(GnomePOD_Library_1.statusColors.idle);
            this.tintStrength = 0;
        }
        ;
        if (this.props.resetSFX) {
            this.props.resetSFX.as(core_1.AudioGizmo).play();
        }
        // if (this.props.voice) {
        //   this.props.voice.as(Npc).conversation?.speak('Your GnomePod device has reset');
        // };
        this.endLoop();
    }
}
GnomePod_UI.propsDefinition = {
    voice: {
        type: core_1.PropTypes.Entity
    },
    transmitter: {
        type: core_1.PropTypes.Entity
    },
    responseSFX: {
        type: core_1.PropTypes.Entity
    },
    waitingSFX: {
        type: core_1.PropTypes.Entity
    },
    resetSFX: {
        type: core_1.PropTypes.Entity
    }
};
ui_1.UIComponent.register(GnomePod_UI);
