"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const PlayPauseMusicTrack_Data_1 = require("PlayPauseMusicTrack_Data");
class PlayPauseTrigger_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isPlaying = false;
        this.lastClick = 0;
        this.curTrack = 0;
        this.playPauseTriggerPos = core_1.Vec3.zero;
        this.nextTrackTriggerPos = core_1.Vec3.zero;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.playPauseTrigger.bind(this));
        if (this.props.skipTrackTrigger) {
            this.connectCodeBlockEvent(this.props.skipTrackTrigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.nextTrackTrigger.bind(this));
        }
    }
    start() {
        this.updateTextDisplay();
        this.playPauseTriggerPos = this.entity.position.get();
        this.nextTrackTriggerPos = this.props.skipTrackTrigger?.position.get() ?? core_1.Vec3.zero;
    }
    playPauseTrigger(player) {
        const curTime = Date.now();
        if (curTime - this.lastClick > 750) {
            this.playTapFX(player, this.playPauseTriggerPos);
            this.toggleMusic();
            this.lastClick = curTime;
        }
    }
    nextTrackTrigger(player) {
        this.playTapFX(player, this.nextTrackTriggerPos);
        const nextTrack = (this.curTrack + 1) % PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks.length;
        if (this.isPlaying) {
            PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.stop();
            PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks[nextTrack].audioGizmo.play();
        }
        this.curTrack = nextTrack;
        this.updateTextDisplay();
    }
    toggleMusic() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.play();
        }
        else {
            PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.pause();
        }
    }
    updateTextDisplay() {
        this.props.textDisplay?.as(core_1.TextGizmo).text.set('<font=bangers sdf>' + PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks[this.curTrack].trackName);
    }
    playTapFX(player, pos) {
        this.props.tapSFX?.as(core_1.AudioGizmo).play();
        if (pos.distance(player.rightHand.position.get()) < pos.distance(player.leftHand.position.get())) {
            player.rightHand.playHaptics(350, core_1.HapticStrength.Medium, core_1.HapticSharpness.Soft);
        }
        else {
            player.leftHand.playHaptics(350, core_1.HapticStrength.Medium, core_1.HapticSharpness.Soft);
        }
    }
}
PlayPauseTrigger_Entity.propsDefinition = {
    skipTrackTrigger: { type: core_1.PropTypes.Entity },
    textDisplay: { type: core_1.PropTypes.Entity },
    tapSFX: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(PlayPauseTrigger_Entity);
