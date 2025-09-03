"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class EnvironmentCycle extends core_1.Component {
    constructor() {
        super(...arguments);
        this.currentAsset = null;
    }
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
            this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, () => {
                this.cycleEnvironment();
            });
        }
    }
    async cycleEnvironment() {
        const spinner = this.props.spinner?.as(core_1.PhysicalEntity);
        if (spinner) {
            spinner.applyLocalTorque(new core_1.Vec3(0, 0, 60));
        }
        const sfx = this.props.sfx?.as(core_1.AudioGizmo);
        if (sfx) {
            sfx.play();
        }
        if (this.currentAsset) {
            await this.currentAsset.unload();
            this.currentAsset = null;
        }
        const trigger = this.props.trigger?.as(core_1.TriggerGizmo);
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
    async spawnEnvironment(index) {
        const asset = this.envAssets[index];
        if (!asset)
            return;
        this.currentAsset = new core_1.SpawnController(asset, this.entity.position.get(), core_1.Quaternion.one, core_1.Vec3.one);
        await this.currentAsset.load();
        await this.currentAsset.spawn();
        const textObj = this.props.textObj?.as(core_1.TextGizmo);
        if (textObj) {
            textObj.text.set(this.times[index]);
        }
    }
}
EnvironmentCycle.propsDefinition = {
    spinner: { type: core_1.PropTypes.Entity },
    textObj: { type: core_1.PropTypes.Entity },
    trigger: { type: core_1.PropTypes.Entity },
    sfx: { type: core_1.PropTypes.Entity },
    twilight: { type: core_1.PropTypes.Asset },
    sunrise: { type: core_1.PropTypes.Asset },
    morning: { type: core_1.PropTypes.Asset },
    overcast: { type: core_1.PropTypes.Asset },
    daytime: { type: core_1.PropTypes.Asset },
    sunset: { type: core_1.PropTypes.Asset },
    evening: { type: core_1.PropTypes.Asset },
    night: { type: core_1.PropTypes.Asset },
    midnight: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(EnvironmentCycle);
