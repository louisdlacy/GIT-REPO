"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const PlayPauseMusicTrack_Data_1 = require("PlayPauseMusicTrack_Data");
class PlayPauseMusicTrack_Entity extends core_1.Component {
    preStart() {
        PlayPauseMusicTrack_Data_1.playPauseMusicTrack_Data.tracks.push({ trackName: this.props.name, audioGizmo: this.entity.as(core_1.AudioGizmo) });
    }
    start() {
    }
}
PlayPauseMusicTrack_Entity.propsDefinition = {
    name: { type: core_1.PropTypes.String, default: '' },
};
core_1.Component.register(PlayPauseMusicTrack_Entity);
