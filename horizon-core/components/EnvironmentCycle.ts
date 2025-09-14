import { Component, PropTypes, Entity, Asset, SpawnController, PhysicalEntity, TriggerGizmo, TextGizmo, AudioGizmo, Quaternion, Vec3, CodeBlockEvents } from 'horizon/core';

class EnvironmentCycle extends Component<typeof EnvironmentCycle> {
  static propsDefinition = {
    spinner: { type: PropTypes.Entity },
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
  private envAssets!: (Asset | undefined)[];
  private iterator!: number;
  private currentAsset: SpawnController | null = null;

  start() {
    this.times = [
      "Nyxara", "Drelthune", "Umbros", "Vaelgorath", "Zirnexus",
      "Charnyx", "Molkrid", "Threxil", "Erothus Prime",
    ];

    this.envAssets = [
      this.props.twilight,
      this.props.sunrise,
      this.props.morning,
      this.props.overcast,
      this.props.daytime,
      this.props.sunset,
      this.props.evening,
      this.props.night,
      this.props.midnight,
    ];

    this.iterator = 4; // Start at "Daytime"
    this.spawnEnvironment(this.iterator);

    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, () => {
        this.cycleEnvironment();
      });
    }
  }

  private async cycleEnvironment() {
    const spinner = this.props.spinner?.as(PhysicalEntity);
    if (spinner) {
      spinner.applyLocalTorque(new Vec3(0, 0, 60));
    }

    const sfx = this.props.sfx?.as(AudioGizmo);
    if (sfx) {
      sfx.play();
    }

    if (this.currentAsset) {
      await this.currentAsset.unload();
      this.currentAsset = null;
    }

    const trigger = this.props.trigger?.as(TriggerGizmo);
    if (trigger) {
      trigger.enabled.set(false);
    }

    await new Promise(resolve => this.async.setTimeout(resolve, 1000));

    this.iterator = (this.iterator + 1) % this.envAssets.length;
    await this.spawnEnvironment(this.iterator);

    if (trigger) {
      trigger.enabled.set(true);
    }
  }

  private async spawnEnvironment(index: number) {
    const asset = this.envAssets[index];
    if (!asset) return;

    this.currentAsset = new SpawnController(asset, this.entity.position.get(), Quaternion.one, Vec3.one);
    await this.currentAsset.load();
    await this.currentAsset.spawn();

    const textObj = this.props.textObj?.as(TextGizmo);
    if (textObj) {
      textObj.text.set(this.times[index]);
    }
  }
}

Component.register(EnvironmentCycle);