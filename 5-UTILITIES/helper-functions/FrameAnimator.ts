// Spawnable Asset Animation Sequencer by Craigusprime

import { Component, Entity, PropTypes, Asset, CodeBlockEvents, Vec3, Quaternion } from "horizon/core";

class FrameAnimator extends Component {
  static propsDefinition = {
    startTrigger: { type: PropTypes.Entity, default: null },
    resetTrigger: { type: PropTypes.Entity, default: null },
    fps: { type: PropTypes.Number, default: 8 },
    loop: { type: PropTypes.Boolean, default: true },
    playOnStart: { type: PropTypes.Boolean, default: false },
    despawnOnReset: { type: PropTypes.Boolean, default: true },
    asset0:  { type: PropTypes.Asset, default: null },
    asset1:  { type: PropTypes.Asset, default: null },
    asset2:  { type: PropTypes.Asset, default: null },
    asset3:  { type: PropTypes.Asset, default: null },
    asset4:  { type: PropTypes.Asset, default: null },
    asset5:  { type: PropTypes.Asset, default: null },
    asset6:  { type: PropTypes.Asset, default: null },
    asset7:  { type: PropTypes.Asset, default: null },
    asset8:  { type: PropTypes.Asset, default: null },
    asset9:  { type: PropTypes.Asset, default: null },
    // ... Add up to asset19 if you need more
  };

  private sourceAssets: Asset[] = [];
  private spawnedFrames: Entity[] = [];
  private currentFrameIndex = 0;
  private isPlaying = false;
  private isReady = false;
  private intervalId: number | null = null;

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

  public async play(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (!this.isReady) {
      await this.spawnAllFrames();
    }
    
    if(this.isReady) {
      this.setFrameVisibility(0);
      this.startAnimationLoop();
    }
  }

  public stopAndReset(): void {
    this.isPlaying = false;
    this.stopAnimationLoop();
    this.currentFrameIndex = 0;

    if (this.props.despawnOnReset) {
      this.despawnAllFrames();
    } else if (this.isReady) {
      this.setFrameVisibility(0);
    }
  }

  private async spawnAllFrames(): Promise<void> {
    if (this.isReady || this.sourceAssets.length === 0) return;
    console.log(`Spawning ${this.sourceAssets.length} frames...`);
    
    // Get the position and rotation of the controller entity ONCE.
    const spawnPosition = this.entity.position.get();
    const spawnRotation = this.entity.rotation.get();
    
    try {
      // Pass the required position and rotation arguments to spawnAsset.
      const spawnPromises = this.sourceAssets.map(asset => 
        this.world.spawnAsset(asset, spawnPosition, spawnRotation)
      );
      
      const spawnedEntityArrays = await Promise.all(spawnPromises);
      this.spawnedFrames = spawnedEntityArrays.map(entityArray => entityArray[0]);
      this.spawnedFrames.forEach(frame => frame.visible.set(false));
      
      this.isReady = true;
      console.log("All frames spawned and ready.");

    } catch (error) {
      console.log(`Error spawning frames: ${error}`);
      this.isPlaying = false;
    }
  }

  private despawnAllFrames(): void {
    if (!this.isReady) return;
    console.log(`Despawning ${this.spawnedFrames.length} frames.`);
    this.spawnedFrames.forEach(frame => this.world.deleteAsset(frame));
    this.spawnedFrames = [];
    this.isReady = false;
  }

  private startAnimationLoop(): void {
    if (this.intervalId !== null) return;
    const frameDuration = this.props.fps > 0 ? 1000 / this.props.fps : 0;
    if (frameDuration <= 0) return;
    this.intervalId = this.async.setInterval(() => this.nextFrame(), frameDuration);
  }

  private stopAnimationLoop(): void {
    if (this.intervalId !== null) {
      this.async.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private connectTriggers(): void {
    if (this.props.startTrigger) {
      this.connectCodeBlockEvent(
        this.props.startTrigger,
        CodeBlockEvents.OnPlayerEnterTrigger,
        () => { this.play(); }
      );
    }
    if (this.props.resetTrigger) {
      this.connectCodeBlockEvent(
        this.props.resetTrigger,
        CodeBlockEvents.OnPlayerExitTrigger,
        () => { this.stopAndReset(); }
      );
    }
  }
  
  private setFrameVisibility(visibleIndex: number): void {
    if (!this.isReady || this.spawnedFrames.length === 0) return;
    this.spawnedFrames.forEach((frame, index) => {
      frame.visible.set(index === visibleIndex);
    });
  }

  private nextFrame(): void {
    if (!this.isPlaying || !this.isReady) {
      this.stopAnimationLoop();
      return;
    }
    const oldIndex = this.currentFrameIndex;
    let nextIndex = oldIndex + 1;
    if (nextIndex >= this.spawnedFrames.length) {
      if (this.props.loop) {
        nextIndex = 0;
      } else {
        this.isPlaying = false;
        return;
      }
    }
    this.currentFrameIndex = nextIndex;
    this.spawnedFrames[oldIndex].visible.set(false);
    this.spawnedFrames[nextIndex].visible.set(true);
  }
}

Component.register(FrameAnimator);