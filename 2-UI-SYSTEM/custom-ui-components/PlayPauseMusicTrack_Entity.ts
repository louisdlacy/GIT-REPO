import { AudioGizmo, Component, PropTypes } from "horizon/core";
import { playPauseMusicTrack_Data } from "PlayPauseMusicTrack_Data";


class PlayPauseMusicTrack_Entity extends Component<typeof PlayPauseMusicTrack_Entity> {
  static propsDefinition = {
    name: { type: PropTypes.String, default: '' },
  };

  preStart() {
    playPauseMusicTrack_Data.tracks.push({ trackName: this.props.name, audioGizmo: this.entity.as(AudioGizmo) });
  }

  start() {
  
  }
}
Component.register(PlayPauseMusicTrack_Entity);