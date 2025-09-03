"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyWaveManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
const Events_1 = require("Events");
const PlayerManager_1 = require("PlayerManager");
const Events_2 = require("Events");
class EnemyWaveManager extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.currentWave = 0;
        this.waveSpawns = [];
        this.updateInterval = 0;
        this.isActive = false;
        this.waveConfigs = [];
        this.waveCompleteNotified = [];
        this.name = "";
    }
    Start() {
        this.name = this.props.waveGroupName;
        this.connectNetworkEvent(this.entity, Events_2.WaveManagerNetworkEvents.StartWaveGroup, this.activateWaveGroup.bind(this));
        this.connectNetworkEvent(this.entity, Events_2.WaveManagerNetworkEvents.StopWaveGroup, this.deactivateWaveGroup.bind(this));
        this.connectNetworkBroadcastEvent(Events_1.Events.monstersInRange, this.findMonstersInRange.bind(this));
        this.connectNetworkBroadcastEvent(Events_1.Events.gameReset, this.resetWaveManager.bind(this));
        if (this.props.wave1Config != null) {
            this.waveConfigs.push({ config: this.props.wave1Config, timeDelay: this.props.wave2TimeDelay });
        }
        if (this.props.wave2Config != null) {
            this.waveConfigs.push({ config: this.props.wave2Config, timeDelay: this.props.wave3TimeDelay });
        }
        if (this.props.wave3Config != null) {
            this.waveConfigs.push({ config: this.props.wave3Config, timeDelay: -1 });
        }
        // SCRIPTING TIP: If you want to add more waves, you can add more wave configs to the array here
        if (this.props.activeFromStart) {
            this.activateWaveGroup({ waveGroupName: this.name });
        }
    }
    findMonstersInRange(data) {
        var entitiesInRange = [];
        for (let i = 0; i < this.waveSpawns.length; i++) {
            this.waveSpawns[i].forEach(enemy => {
                var enemyBehaviour = Behaviour_1.BehaviourFinder.GetBehaviour(enemy);
                if (enemyBehaviour == null || enemyBehaviour.isDead)
                    return;
                if (data.entity.position.get().distance(enemy.position.get()) <= data.range) {
                    entitiesInRange.push(enemy);
                }
            });
        }
        this.sendNetworkEvent(data.entity, Events_1.Events.monstersInRangeResponse, { monsters: entitiesInRange });
    }
    resetWaveManager() {
        this.deactivateWaveGroup({ waveGroupName: this.props.waveGroupName });
        this.waveSpawns = [];
        this.waveCompleteNotified = [];
        this.currentWave = 0;
    }
    updateState() {
        if (!this.isActive)
            return;
        // Check each active wave to see if it's complete
        for (let i = 0; i < this.waveSpawns.length; i++) {
            // Edge case where a wave has just started and is still empty. Skip it.
            if (this.waveSpawns[i].size == 0)
                continue;
            // A wave is complete if all the enemies in it are dead
            var waveComplete = true;
            this.waveSpawns[i].forEach(enemy => {
                var enemyBehaviour = Behaviour_1.BehaviourFinder.GetBehaviour(enemy);
                if (enemyBehaviour) {
                    if (enemyBehaviour.isDead) {
                        this.waveSpawns[i].delete(enemy);
                    }
                    else {
                        waveComplete = false;
                    }
                }
            });
            // If the wave is complete, and we haven't done anything about it yet, start the next wave
            if (waveComplete && !this.waveCompleteNotified[i]) {
                this.waveCompleteNotified[i] = true;
                this.sendNetworkEvent(this.entity, Events_2.WaveManagerNetworkEvents.WaveComplete, { waveGroupName: this.props.waveGroupName, waveNumber: this.currentWave });
                // Start the next wave after a delay if there is one
                if (this.currentWave < this.waveConfigs.length) {
                    var nextWaveDelay = this.waveConfigs[this.currentWave - 1].timeDelay * 1000; // Convert to milliseconds from seconds
                    this.async.setTimeout(() => this.nextWave(), nextWaveDelay > 0 ? nextWaveDelay : 1);
                }
                else {
                    this.deactivateWaveGroup({ waveGroupName: this.props.waveGroupName });
                }
                return;
            }
        }
    }
    activateWaveGroup(data) {
        if (this.isActive || data.waveGroupName != this.props.waveGroupName)
            return;
        console.log("Activating Wave Group: ", this.props.waveGroupName);
        this.updateInterval = this.async.setInterval(this.updateState.bind(this), 1000);
        this.isActive = true;
        this.sendNetworkBroadcastEvent(Events_2.WaveManagerNetworkEvents.FightStarted, { waveGroupName: this.props.waveGroupName });
        this.nextWave();
    }
    deactivateWaveGroup(data) {
        if (!this.isActive || data.waveGroupName != this.props.waveGroupName)
            return;
        console.log("Deactivating Wave Group: ", this.props.waveGroupName);
        this.async.clearInterval(this.updateInterval);
        this.isActive = false;
        // Despawn everything
        this.waveSpawns.forEach((waveSpawn) => {
            waveSpawn.forEach((spawn) => {
                this.world.deleteAsset(spawn);
            });
        });
        this.sendNetworkBroadcastEvent(Events_2.WaveManagerNetworkEvents.FightEnded, { waveGroupName: this.props.waveGroupName });
    }
    nextWave() {
        if (!this.isActive || this.currentWave >= this.waveConfigs.length)
            return;
        // Get the wave config, and stop if it's invalid
        var waveConfig = Behaviour_1.BehaviourFinder.GetBehaviour(this.waveConfigs[this.currentWave].config);
        if (waveConfig == null) {
            console.error("Invalid wave config, next wave will not spawn");
            return;
        }
        // Housekeeping for the new wave
        var playerCount = PlayerManager_1.PlayerManager.instance.gamePlayers.getPlayersInMatch().length;
        var waveMultiplier = Math.pow(this.props.wavePlayerMultiplier, playerCount - 1);
        this.waveSpawns.push(waveConfig.spawnEnemyWave(waveMultiplier));
        this.waveCompleteNotified.push(false);
        // Notify that we're starting the wave
        this.currentWave++;
        this.sendNetworkBroadcastEvent(Events_2.WaveManagerNetworkEvents.StartingWave, { waveGroupName: this.props.waveGroupName, waveNumber: this.currentWave });
    }
}
exports.EnemyWaveManager = EnemyWaveManager;
EnemyWaveManager.propsDefinition = {
    activeFromStart: { type: core_1.PropTypes.Boolean, default: false },
    waveGroupName: { type: core_1.PropTypes.String },
    initialWaveTimeDelay: { type: core_1.PropTypes.Number, default: 0 }, // Time in seconds before the first wave starts.
    wavePlayerMultiplier: { type: core_1.PropTypes.Number, default: 1 }, // Wave size multiplier for the number players in the game
    wave1Config: { type: core_1.PropTypes.Entity },
    wave2TimeDelay: { type: core_1.PropTypes.Number, default: -1 }, // Time in seconds before the next wave starts, -1 means wait for all enemies to die
    wave2Config: { type: core_1.PropTypes.Entity },
    wave3TimeDelay: { type: core_1.PropTypes.Number, default: -1 },
    wave3Config: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(EnemyWaveManager);
