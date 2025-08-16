import { AudioGizmo, CodeBlockEvents, Component, HapticSharpness, HapticStrength, Player, PropTypes, TextGizmo, Vec3 } from 'horizon/core';
import { playPauseMusicTrack_Data } from 'PlayPauseMusicTrack_Data';


class PlayPauseTrigger_Entity extends Component<typeof PlayPauseTrigger_Entity>{
  static propsDefinition = {
    skipTrackTrigger: { type: PropTypes.Entity },
    textDisplay: { type: PropTypes.Entity },
    tapSFX: { type: PropTypes.Entity },
  };

  isPlaying = false;
  lastClick = 0;

  curTrack = 0;

  playPauseTriggerPos = Vec3.zero;
  nextTrackTriggerPos = Vec3.zero;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.playPauseTrigger.bind(this));

    if (this.props.skipTrackTrigger) {
      this.connectCodeBlockEvent(this.props.skipTrackTrigger, CodeBlockEvents.OnPlayerEnterTrigger, this.nextTrackTrigger.bind(this));
    }
  }

  start() {
    this.updateTextDisplay();

    this.playPauseTriggerPos = this.entity.position.get();
    this.nextTrackTriggerPos = this.props.skipTrackTrigger?.position.get() ?? Vec3.zero;
  }

  playPauseTrigger(player: Player) {
    const curTime = Date.now();

    if (curTime - this.lastClick > 750) {
      this.playTapFX(player, this.playPauseTriggerPos);
      
      
      this.toggleMusic();
      this.lastClick = curTime;
    }
  }
  
  nextTrackTrigger(player: Player) {
    this.playTapFX(player, this.nextTrackTriggerPos);

    const nextTrack = (this.curTrack + 1) % playPauseMusicTrack_Data.tracks.length;

    if (this.isPlaying) {
      playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.stop();
      playPauseMusicTrack_Data.tracks[nextTrack].audioGizmo.play();
    }

    this.curTrack = nextTrack;

    this.updateTextDisplay();
  }

  toggleMusic() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.play();
    }
    else {
      playPauseMusicTrack_Data.tracks[this.curTrack].audioGizmo.pause();
    }
  }

  updateTextDisplay() {
    this.props.textDisplay?.as(TextGizmo).text.set('<font=bangers sdf>' + playPauseMusicTrack_Data.tracks[this.curTrack].trackName);
  }

  playTapFX(player: Player, pos: Vec3) {
    this.props.tapSFX?.as(AudioGizmo).play();

    if (pos.distance(player.rightHand.position.get()) < pos.distance(player.leftHand.position.get())) {
      player.rightHand.playHaptics(350, HapticStrength.Medium, HapticSharpness.Soft);
    }
    else {
      player.leftHand.playHaptics(350, HapticStrength.Medium, HapticSharpness.Soft);
    }
  }
}
Component.register(PlayPauseTrigger_Entity);