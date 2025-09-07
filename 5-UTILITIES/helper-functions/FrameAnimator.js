"use strict";
// Spawnable Asset Animation Sequencer by Craigusprime
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class FrameAnimator extends core_1.Component {
    constructor() {
        super(...arguments);
        this.sourceAssets = [];
        this.spawnedFrames = [];
        this.currentFrameIndex = 0;
        this.isPlaying = false;
        this.isReady = false;
        this.intervalId = null;
    }
    preStart() {
        for (let i = 0; i < 20; i++) {
            const asset = this.props[`asset${i}`];
            if (asset) {
                this.sourceAssets.push(asset);
            }
        }
        this.connectTriggers();
    }
    start() {
        if (this.props.playOnStart) {
            this.play();
        }
    }
    async play() {
        if (this.isPlaying)
            return;
        this.isPlaying = true;
        if (!this.isReady) {
            await this.spawnAllFrames();
        }
        if (this.isReady) {
            this.setFrameVisibility(0);
            this.startAnimationLoop();
        }
    }
    stopAndReset() {
        this.isPlaying = false;
        this.stopAnimationLoop();
        this.currentFrameIndex = 0;
        if (this.props.despawnOnReset) {
            this.despawnAllFrames();
        }
        else if (this.isReady) {
            this.setFrameVisibility(0);
        }
    }
    async spawnAllFrames() {
        if (this.isReady || this.sourceAssets.length === 0)
            return;
        console.log(`Spawning ${this.sourceAssets.length} frames...`);
        // Get the position and rotation of the controller entity ONCE.
        const spawnPosition = this.entity.position.get();
        const spawnRotation = this.entity.rotation.get();
        try {
            // Pass the required position and rotation arguments to spawnAsset.
            const spawnPromises = this.sourceAssets.map(asset => this.world.spawnAsset(asset, spawnPosition, spawnRotation));
            const spawnedEntityArrays = await Promise.all(spawnPromises);
            this.spawnedFrames = spawnedEntityArrays.map(entityArray => entityArray[0]);
            this.spawnedFrames.forEach(frame => frame.visible.set(false));
            this.isReady = true;
            console.log("All frames spawned and ready.");
        }
        catch (error) {
            console.log(`Error spawning frames: ${error}`);
            this.isPlaying = false;
        }
    }
    despawnAllFrames() {
        if (!this.isReady)
            return;
        console.log(`Despawning ${this.spawnedFrames.length} frames.`);
        this.spawnedFrames.forEach(frame => this.world.deleteAsset(frame));
        this.spawnedFrames = [];
        this.isReady = false;
    }
    startAnimationLoop() {
        if (this.intervalId !== null)
            return;
        const frameDuration = this.props.fps > 0 ? 1000 / this.props.fps : 0;
        if (frameDuration <= 0)
            return;
        this.intervalId = this.async.setInterval(() => this.nextFrame(), frameDuration);
    }
    stopAnimationLoop() {
        if (this.intervalId !== null) {
            this.async.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    connectTriggers() {
        if (this.props.startTrigger) {
            this.connectCodeBlockEvent(this.props.startTrigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, () => { this.play(); });
        }
        if (this.props.resetTrigger) {
            this.connectCodeBlockEvent(this.props.resetTrigger, core_1.CodeBlockEvents.OnPlayerExitTrigger, () => { this.stopAndReset(); });
        }
    }
    setFrameVisibility(visibleIndex) {
        if (!this.isReady || this.spawnedFrames.length === 0)
            return;
        this.spawnedFrames.forEach((frame, index) => {
            frame.visible.set(index === visibleIndex);
        });
    }
    nextFrame() {
        if (!this.isPlaying || !this.isReady) {
            this.stopAnimationLoop();
            return;
        }
        const oldIndex = this.currentFrameIndex;
        let nextIndex = oldIndex + 1;
        if (nextIndex >= this.spawnedFrames.length) {
            if (this.props.loop) {
                nextIndex = 0;
            }
            else {
                this.isPlaying = false;
                return;
            }
        }
        this.currentFrameIndex = nextIndex;
        this.spawnedFrames[oldIndex].visible.set(false);
        this.spawnedFrames[nextIndex].visible.set(true);
    }
}
FrameAnimator.propsDefinition = {
    startTrigger: { type: core_1.PropTypes.Entity, default: null },
    resetTrigger: { type: core_1.PropTypes.Entity, default: null },
    fps: { type: core_1.PropTypes.Number, default: 8 },
    loop: { type: core_1.PropTypes.Boolean, default: true },
    playOnStart: { type: core_1.PropTypes.Boolean, default: false },
    despawnOnReset: { type: core_1.PropTypes.Boolean, default: true },
    asset0: { type: core_1.PropTypes.Asset, default: null },
    asset1: { type: core_1.PropTypes.Asset, default: null },
    asset2: { type: core_1.PropTypes.Asset, default: null },
    asset3: { type: core_1.PropTypes.Asset, default: null },
    asset4: { type: core_1.PropTypes.Asset, default: null },
    asset5: { type: core_1.PropTypes.Asset, default: null },
    asset6: { type: core_1.PropTypes.Asset, default: null },
    asset7: { type: core_1.PropTypes.Asset, default: null },
    asset8: { type: core_1.PropTypes.Asset, default: null },
    asset9: { type: core_1.PropTypes.Asset, default: null },
    // ... Add up to asset19 if you need more
};
core_1.Component.register(FrameAnimator);
