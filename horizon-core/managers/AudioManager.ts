// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Component, PropTypes, AudioGizmo, Vec3, Player, NetworkEvent } from "horizon/core";
import { debugLog, getEntityListByTag, ManagerType } from "sysHelper";

//region Audio Events
export const PlayAudioAtPosition = new NetworkEvent<{
  audioLabel: AudioLabel;
  audibleFor: Player[];
  position?: Vec3;
}>("PlayAudioAtPosition");
export const StopAudio = new NetworkEvent<{ audioLabel: AudioLabel }>("StopAudio");

export enum AudioLabel {
  soundtrack,
  button,
  success,
  failure,
  open,
  close,
  break, 
}

class AudioManager extends Component<typeof AudioManager> {
  //region Props Definition
  static propsDefinition = {
    enabled: { type: PropTypes.Boolean, default: true },
    gameMusicEnabled: { type: PropTypes.Boolean, defaultValue: true },

    soundTrack: { type: PropTypes.Asset },
    button: { type: PropTypes.Entity },
    success: { type: PropTypes.Entity },
    failure: { type: PropTypes.Entity },
    open: { type: PropTypes.Entity },
    close: { type: PropTypes.Entity },
    break: { type: PropTypes.Entity }, // Placeholder, replace with actual break sound asset

    // Add any other audio assets you need here
  };
  private showDebugs: boolean = true; // Set to true to enable debug logs

  //region Get Audio Asset
  private getAudioAsset(label: AudioLabel): any | null {
    const audioMap: Record<AudioLabel, any> = {
      [AudioLabel.soundtrack]: this.props.soundTrack,
      [AudioLabel.button]: this.props.button,
      [AudioLabel.success]: this.props.success,
      [AudioLabel.failure]: this.props.failure,
      [AudioLabel.open]: this.props.open,
      [AudioLabel.close]: this.props.close,
      [AudioLabel.break]: this.props.break, // Placeholder, replace with actual break sound asset
    };

    return audioMap[label] || null;
  }

  preStart() {
    if (!this.props.enabled) return;

    this.connectNetworkEvent(this.entity, PlayAudioAtPosition, (data) => {
      this.PlayAudioAtPosition(data);
    });

    this.connectNetworkEvent(this.entity, StopAudio, (data) => this.onStopAudio(data));
  }

  start(): void {
    if (!this.props.enabled) return;
  }

  private onStopAudio(data: { audioLabel: AudioLabel }) {
    const audioAsset = this.getAudioAsset(data.audioLabel);
    debugLog(this.showDebugs, `Stopping audio ${AudioLabel[data.audioLabel].toString()}`);

    if (audioAsset) {
      const audio = audioAsset.as(AudioGizmo);
      audio.stop();
    } else {
      console.error(`AudioManager: No audio asset found for label ${AudioLabel[data.audioLabel]}`);
    }
  }

  private PlayAudioAtPosition(data: { audioLabel: AudioLabel; audibleFor: Player[]; position?: Vec3 }) {
    const audioAsset = this.getAudioAsset(data.audioLabel);
    debugLog(this.showDebugs, `Playing audio at position ${AudioLabel[data.audioLabel].toString()}`);
    if (audioAsset) {
      const audio = audioAsset.as(AudioGizmo);
      if (data.position) {
        audio.position.set(data.position);
      }
      if (data.audibleFor.length > 0) {
        audio.play({
          fade: 0,
          players: data.audibleFor,
        });
      } else {
        audio.play(); // Play for all players if no specific audibleFor is provided
      }
      // Optionally, handle audibleFor if needed
    } else {
      console.error(`AudioManager: No audio asset found for label ${AudioLabel[data.audioLabel]}`);
    }
  }
}
Component.register(AudioManager);

/**
 * @param component - Just put 'this'
 * @param AudioLabel - Use AudioLabel. For example: AudioLabel.tap
 * @param audibleFor - Optional. Plays the sound for specific players. blank of [] plays for all players.
 * @param position - Optional. Plays the sound at a specific position. If not provided, plays at current position.
 */
export function playAudio(component: Component, audioLabel: AudioLabel, audibleFor?: Player[], position?: Vec3): void {
  const emptyAudibleFor: Player[] = [];
  if (audibleFor === undefined || audibleFor.length === 0 || audibleFor === null) {
    audibleFor = emptyAudibleFor;
  }
  const audibleForPlayers = audibleFor || emptyAudibleFor;
  const audioManager = getEntityListByTag(ManagerType.AudioManager, component.world)[0];
  if (audioManager) {
    component.sendNetworkEvent(audioManager, PlayAudioAtPosition, {
      audioLabel: audioLabel,
      audibleFor: audibleForPlayers,
      position: position,
    });
  }
}
