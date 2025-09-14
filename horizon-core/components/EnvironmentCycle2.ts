import { PhysicalEntity, TriggerGizmo, TextGizmo, SpawnController, Quaternion, Vec3, CodeBlockEvents, AudioGizmo } from 'horizon/core';
import * as hz from 'horizon/core';
import { Component, PropTypes, Entity, Asset } from 'horizon/core';
// Edited:WhiteSwordvr

class EnvironmentCycle extends Component<typeof EnvironmentCycle> {
  static propsDefinition = {
    textObj: { type: PropTypes.Entity },
    trigger: { type: PropTypes.Entity },
    sfx: { type: PropTypes.Entity },
    twilight: { type: PropTypes.Asset },
    sunrise: { type: PropTypes.Asset },
    morning: { type: PropTypes.Asset },
    overcast: { type: PropTypes.Asset },
    daytime: { type: PropTypes.Asset },
    sunset: { type: PropTypes.Asset },
    evening: { type: PropTypes.Asset },
    night: { type: PropTypes.Asset },
    midnight: { type: PropTypes.Asset },
  };

  private times!: string[];
  private envAssets!: Asset[];
  private iterator!: number;
  private currentAsset!: hz.SpawnController | null;
  
// to change the text that appears edited it down here
  start() {
    this.times = [
      "Twilight", "Sunrise", "Morning", "Overcast", "Daytime",
      "Sunset", "Evening", "Night ", "Midnight",
    ];

    this.envAssets = [
      this.props.twilight!,
      this.props.sunrise!,
      this.props.morning!,
      this.props.overcast!,
      this.props.daytime!,
      this.props.sunset!,
      this.props.evening!,
      this.props.night!,
      this.props.midnight!,
    ];

    this.iterator = 4; // Start at "Daytime"
    this.currentAsset = null;

    this.spawnEnvironment(this.iterator);

    this.connectCodeBlockEvent(this.props.trigger!, CodeBlockEvents.OnPlayerEnterTrigger, () => {
      this.cycleEnvironment();
    });
  }

  private async cycleEnvironment() {
    // Play feedback effects
    const sfx = this.props.sfx!.as(AudioGizmo)!;
    if (sfx) {
      sfx.play();
    }

    // Despawn current environment
    if (this.currentAsset) {
      await this.currentAsset.unload();
      this.currentAsset = null;
    }

    // Temporarily disable trigger
    const trigger = this.props.trigger!.as(TriggerGizmo)!;
    if (trigger) {
      trigger.enabled.set(false);
    }
    await new Promise(resolve => this.async.setTimeout(resolve, 1000));

    // Advance index
    this.iterator = (this.iterator + 1) % this.envAssets.length;

    // Spawn next environment
    await this.spawnEnvironment(this.iterator);

    // Re-enable trigger
    if (trigger) {
      trigger.enabled.set(true);
    }
  }

  private async spawnEnvironment(index: number) {
    const asset = this.envAssets[index];
    this.currentAsset = new hz.SpawnController(asset, this.entity.position.get(), hz.Quaternion.one, hz.Vec3.one);
    await this.currentAsset.spawn();

    // Update display text
    const textObj = this.props.textObj!.as(TextGizmo)!;
    if (textObj) {
      textObj.text.set(this.times[index]);
    }
  }
}

Component.register(EnvironmentCycle);