# Gizmo Best Practices for Horizon Worlds

## Table of Contents

1. [Audio Gizmos](#audio-gizmos)
2. [Particle and Trail Gizmos](#particle-and-trail-gizmos)
3. [Text and UI Gizmos](#text-and-ui-gizmos)
4. [Spawn and Trigger Gizmos](#spawn-and-trigger-gizmos)
5. [Projectile and AI Gizmos](#projectile-and-ai-gizmos)
6. [Light and Visual Effects](#light-and-visual-effects)
7. [Performance Optimization](#performance-optimization)

## Audio Gizmos

### AudioGizmo Best Practices

```typescript
class AudioManager extends Component<typeof AudioManager> {
  static propsDefinition = {
    audioGizmo: { type: PropTypes.Entity },
    maxConcurrentSounds: { type: PropTypes.Number, default: 5 },
    defaultVolume: { type: PropTypes.Number, default: 0.8 },
  };

  private audioGizmo?: AudioGizmo;
  private playingSounds = new Set<string>();
  private soundQueue: Array<{ asset: Asset; options: AudioOptions }> = [];

  start() {
    this.audioGizmo = this.props.audioGizmo as AudioGizmo;
    if (!this.audioGizmo) {
      console.error("AudioGizmo not found");
      return;
    }
  }

  // Play sound with validation and limits
  public playSound(
    audioAsset: Asset,
    options?: Partial<AudioOptions>
  ): boolean {
    if (!this.audioGizmo || !audioAsset) return false;

    // Check concurrent sound limit
    if (this.playingSounds.size >= this.props.maxConcurrentSounds!) {
      this.queueSound(audioAsset, options);
      return false;
    }

    const audioOptions: AudioOptions = {
      volume: options?.volume ?? this.props.defaultVolume!,
      pitch: options?.pitch ?? 1.0,
      audibilityMode: options?.audibilityMode ?? AudibilityMode.AudioFull,
      audibilityDistance: options?.audibilityDistance ?? 50,
      loop: options?.loop ?? false,
      players: options?.players ?? [],
      ...options,
    };

    try {
      const soundId = this.generateSoundId();
      this.audioGizmo.play(audioAsset, audioOptions);
      this.playingSounds.add(soundId);

      // Remove from playing list after estimated duration
      this.scheduleSoundCleanup(soundId, audioOptions);

      return true;
    } catch (error) {
      console.error("Failed to play sound:", error);
      return false;
    }
  }

  private queueSound(audioAsset: Asset, options?: Partial<AudioOptions>) {
    this.soundQueue.push({ asset: audioAsset, options: options || {} });
  }

  private processQueuedSounds() {
    while (
      this.soundQueue.length > 0 &&
      this.playingSounds.size < this.props.maxConcurrentSounds!
    ) {
      const queuedSound = this.soundQueue.shift()!;
      this.playSound(queuedSound.asset, queuedSound.options);
    }
  }

  private generateSoundId(): string {
    return `sound_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private scheduleSoundCleanup(soundId: string, options: AudioOptions) {
    // Estimate sound duration (you might want to store actual durations)
    const estimatedDuration = options.loop ? 0 : 5000; // 5 seconds default

    if (estimatedDuration > 0) {
      this.async.setTimeout(() => {
        this.playingSounds.delete(soundId);
        this.processQueuedSounds();
      }, estimatedDuration);
    }
  }

  // Stop all sounds
  public stopAllSounds() {
    if (this.audioGizmo) {
      this.audioGizmo.stop();
      this.playingSounds.clear();
      this.soundQueue.length = 0;
    }
  }

  // Play spatial 3D audio
  public play3DAudio(
    audioAsset: Asset,
    position: Vec3,
    maxDistance: number = 50
  ) {
    const options: AudioOptions = {
      volume: this.props.defaultVolume!,
      audibilityMode: AudibilityMode.Audio3D,
      audibilityDistance: maxDistance,
      loop: false,
    };

    // Position the audio gizmo at the desired location
    if (this.audioGizmo) {
      this.audioGizmo.transform.position.set(position);
      return this.playSound(audioAsset, options);
    }

    return false;
  }

  // Play audio only for specific players
  public playForPlayers(
    audioAsset: Asset,
    players: Player[],
    options?: Partial<AudioOptions>
  ) {
    const audioOptions: AudioOptions = {
      ...options,
      players,
      audibilityMode: AudibilityMode.AudioFull,
    };

    return this.playSound(audioAsset, audioOptions);
  }
}
```

### Advanced Audio Techniques

```typescript
class AdvancedAudio extends Component<typeof AdvancedAudio> {
  private audioGizmos: AudioGizmo[] = [];
  private audioZones = new Map<string, { gizmo: AudioGizmo; bounds: Bounds }>();

  // Create multiple audio gizmos for layered audio
  public setupAudioLayers() {
    // Background music layer
    const musicGizmo = this.createAudioGizmo("BackgroundMusic");

    // Ambient sounds layer
    const ambientGizmo = this.createAudioGizmo("AmbientSounds");

    // Effect sounds layer
    const effectsGizmo = this.createAudioGizmo("SoundEffects");

    this.audioGizmos.push(musicGizmo, ambientGizmo, effectsGizmo);
  }

  private createAudioGizmo(name: string): AudioGizmo {
    const entity = this.world.createEntity() as AudioGizmo;
    entity.name.set(name);
    return entity;
  }

  // Zone-based audio system
  public createAudioZone(
    name: string,
    center: Vec3,
    size: Vec3,
    audioAsset: Asset
  ) {
    const audioGizmo = this.createAudioGizmo(`Zone_${name}`);
    audioGizmo.transform.position.set(center);

    const bounds = new Bounds();
    bounds.center.set(center);
    bounds.size.set(size);

    this.audioZones.set(name, { gizmo: audioGizmo, bounds });

    // Start playing ambient audio for this zone
    const options: AudioOptions = {
      volume: 0.5,
      loop: true,
      audibilityMode: AudibilityMode.Audio3D,
      audibilityDistance: Math.max(size.x, size.y, size.z),
    };

    audioGizmo.play(audioAsset, options);
  }

  // Check if player is in audio zone
  public checkPlayerInZone(player: Player, zoneName: string): boolean {
    const zone = this.audioZones.get(zoneName);
    if (!zone) return false;

    const playerPos = player.transform.position.get();
    return zone.bounds.contains(playerPos);
  }

  // Dynamic audio mixing
  public adjustAudioMix(
    musicVolume: number,
    effectsVolume: number,
    ambientVolume: number
  ) {
    // This would require custom audio management since AudioGizmo doesn't support runtime volume changes
    // You would need to stop and restart with new volumes
    console.log(
      `Audio mix: Music ${musicVolume}, Effects ${effectsVolume}, Ambient ${ambientVolume}`
    );
  }
}
```

## Particle and Trail Gizmos

### ParticleGizmo Management

```typescript
class ParticleManager extends Component<typeof ParticleManager> {
  static propsDefinition = {
    particleGizmo: { type: PropTypes.Entity },
    maxActiveParticles: { type: PropTypes.Number, default: 10 },
  };

  private particleGizmo?: ParticleGizmo;
  private activeEffects = new Set<string>();
  private effectQueue: Array<{
    options: ParticleFXPlayOptions;
    duration: number;
  }> = [];

  start() {
    this.particleGizmo = this.props.particleGizmo as ParticleGizmo;
    if (!this.particleGizmo) {
      console.error("ParticleGizmo not found");
    }
  }

  // Play particle effect with management
  public playEffect(
    duration: number = 3000,
    options?: Partial<ParticleFXPlayOptions>
  ): string | null {
    if (!this.particleGizmo) return null;

    // Check active effect limit
    if (this.activeEffects.size >= this.props.maxActiveParticles!) {
      this.queueEffect(options || {}, duration);
      return null;
    }

    const effectId = this.generateEffectId();

    try {
      const playOptions: ParticleFXPlayOptions = {
        players: options?.players ?? [],
        ...options,
      };

      this.particleGizmo.play(playOptions);
      this.activeEffects.add(effectId);

      // Schedule cleanup
      this.async.setTimeout(() => {
        this.stopEffect(effectId);
      }, duration);

      return effectId;
    } catch (error) {
      console.error("Failed to play particle effect:", error);
      return null;
    }
  }

  private queueEffect(options: ParticleFXPlayOptions, duration: number) {
    this.effectQueue.push({ options, duration });
  }

  private processQueuedEffects() {
    while (
      this.effectQueue.length > 0 &&
      this.activeEffects.size < this.props.maxActiveParticles!
    ) {
      const queuedEffect = this.effectQueue.shift()!;
      this.playEffect(queuedEffect.duration, queuedEffect.options);
    }
  }

  public stopEffect(effectId: string) {
    if (!this.particleGizmo || !this.activeEffects.has(effectId)) return;

    try {
      const stopOptions: ParticleFXStopOptions = {
        // Configure stop options as needed
      };

      this.particleGizmo.stop(stopOptions);
      this.activeEffects.delete(effectId);
      this.processQueuedEffects();
    } catch (error) {
      console.error("Failed to stop particle effect:", error);
    }
  }

  // Dynamic particle parameters
  public setEffectParameter<T extends VFXParameterType>(
    parameterName: string,
    value: T,
    players?: Player[]
  ) {
    if (!this.particleGizmo) return;

    const parameter: VFXParameter<T> = {
      name: parameterName,
      value: value,
    };

    const options: ParticleFXSetParameterOptions = {
      parameter,
      players: players ?? [],
    };

    try {
      this.particleGizmo.setParameter(options);
    } catch (error) {
      console.error("Failed to set particle parameter:", error);
    }
  }

  private generateEffectId(): string {
    return `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Play effect at specific position
  public playEffectAtPosition(
    position: Vec3,
    duration: number = 3000
  ): string | null {
    if (!this.particleGizmo) return null;

    // Move particle gizmo to position
    this.particleGizmo.transform.position.set(position);

    return this.playEffect(duration);
  }

  // Stop all effects
  public stopAllEffects() {
    if (this.particleGizmo) {
      this.particleGizmo.stop();
      this.activeEffects.clear();
      this.effectQueue.length = 0;
    }
  }
}
```

### TrailGizmo Best Practices

```typescript
class TrailManager extends Component<typeof TrailManager> {
  static propsDefinition = {
    trailGizmo: { type: PropTypes.Entity },
    followTarget: { type: PropTypes.Entity },
    trailDuration: { type: PropTypes.Number, default: 2.0 },
  };

  private trailGizmo?: TrailGizmo;
  private isTrailActive = false;
  private followTarget?: Entity;

  start() {
    this.trailGizmo = this.props.trailGizmo as TrailGizmo;
    this.followTarget = this.props.followTarget;

    if (!this.trailGizmo) {
      console.error("TrailGizmo not found");
    }
  }

  // Start trail following an entity
  public startTrail(target?: Entity) {
    if (!this.trailGizmo) return;

    this.followTarget = target || this.followTarget;
    if (!this.followTarget) {
      console.warn("No target entity for trail");
      return;
    }

    try {
      this.trailGizmo.start();
      this.isTrailActive = true;
      console.log("Trail started");
    } catch (error) {
      console.error("Failed to start trail:", error);
    }
  }

  public stopTrail() {
    if (!this.trailGizmo || !this.isTrailActive) return;

    try {
      this.trailGizmo.stop();
      this.isTrailActive = false;
      console.log("Trail stopped");
    } catch (error) {
      console.error("Failed to stop trail:", error);
    }
  }

  // Update trail position to follow target
  tick() {
    if (this.isTrailActive && this.trailGizmo && this.followTarget) {
      const targetPosition = this.followTarget.transform.position.get();
      this.trailGizmo.transform.position.set(targetPosition);
    }
  }

  // Create trail with custom duration
  public createTimedTrail(duration: number) {
    this.startTrail();

    this.async.setTimeout(() => {
      this.stopTrail();
    }, duration);
  }

  // Trail with conditional activation
  public conditionalTrail(condition: () => boolean) {
    if (condition() && !this.isTrailActive) {
      this.startTrail();
    } else if (!condition() && this.isTrailActive) {
      this.stopTrail();
    }
  }
}
```

## Text and UI Gizmos

### TextGizmo Management

```typescript
class TextDisplayManager extends Component<typeof TextDisplayManager> {
  static propsDefinition = {
    textGizmo: { type: PropTypes.Entity },
    defaultText: { type: PropTypes.String, default: "Default Text" },
    updateInterval: { type: PropTypes.Number, default: 1000 },
  };

  private textGizmo?: TextGizmo;
  private textHistory: string[] = [];
  private updateTimer?: any;

  start() {
    this.textGizmo = this.props.textGizmo as TextGizmo;
    if (!this.textGizmo) {
      console.error("TextGizmo not found");
      return;
    }

    this.setupTextDisplay();
  }

  private setupTextDisplay() {
    if (!this.textGizmo) return;

    // Set initial text
    try {
      this.textGizmo.text.set(this.props.defaultText!);
    } catch (error) {
      console.error("Failed to set initial text:", error);
    }
  }

  // Update text with validation
  public setText(newText: string, addToHistory: boolean = true): boolean {
    if (!this.textGizmo || !newText) return false;

    try {
      this.textGizmo.text.set(newText);

      if (addToHistory) {
        this.addToHistory(newText);
      }

      return true;
    } catch (error) {
      console.error("Failed to set text:", error);
      return false;
    }
  }

  private addToHistory(text: string) {
    this.textHistory.push(text);

    // Keep only last 10 texts
    if (this.textHistory.length > 10) {
      this.textHistory.shift();
    }
  }

  // Animated text changes
  public animateTextChange(newText: string, animationDuration: number = 1000) {
    if (!this.textGizmo) return;

    const steps = 10;
    const stepDuration = animationDuration / steps;
    let currentStep = 0;

    const animateStep = () => {
      if (currentStep >= steps) {
        this.setText(newText);
        return;
      }

      // Create transition effect (you can customize this)
      const transitionText = this.createTransitionText(
        newText,
        currentStep / steps
      );
      this.setText(transitionText, false);

      currentStep++;
      this.async.setTimeout(animateStep, stepDuration);
    };

    animateStep();
  }

  private createTransitionText(targetText: string, progress: number): string {
    const visibleChars = Math.floor(targetText.length * progress);
    return (
      targetText.substring(0, visibleChars) +
      "_".repeat(targetText.length - visibleChars)
    );
  }

  // Timed text display
  public showTextForDuration(text: string, duration: number) {
    const originalText = this.textGizmo?.text.get() || this.props.defaultText!;

    this.setText(text);

    this.async.setTimeout(() => {
      this.setText(originalText);
    }, duration);
  }

  // Scrolling text for long messages
  public showScrollingText(
    longText: string,
    maxLength: number = 50,
    scrollSpeed: number = 100
  ) {
    if (longText.length <= maxLength) {
      this.setText(longText);
      return;
    }

    let startIndex = 0;

    const scrollStep = () => {
      const visibleText = longText.substring(
        startIndex,
        startIndex + maxLength
      );
      this.setText(visibleText, false);

      startIndex++;
      if (startIndex + maxLength <= longText.length) {
        this.async.setTimeout(scrollStep, scrollSpeed);
      } else {
        // Reset to beginning or stop
        startIndex = 0;
        this.async.setTimeout(scrollStep, scrollSpeed * 3); // Pause before restart
      }
    };

    scrollStep();
  }

  // Dynamic text updates
  public startDynamicUpdates(updateFunction: () => string) {
    this.stopDynamicUpdates();

    const update = () => {
      const newText = updateFunction();
      this.setText(newText, false);

      this.updateTimer = this.async.setTimeout(
        update,
        this.props.updateInterval!
      );
    };

    update();
  }

  public stopDynamicUpdates() {
    if (this.updateTimer) {
      this.async.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }
  }

  dispose() {
    this.stopDynamicUpdates();
  }
}
```

## Spawn and Trigger Gizmos

### SpawnPointGizmo Management

```typescript
class SpawnManager extends Component<typeof SpawnManager> {
  static propsDefinition = {
    spawnPoints: { type: PropTypes.EntityArray, default: [] },
    spawnCooldown: { type: PropTypes.Number, default: 1000 },
    maxConcurrentSpawns: { type: PropTypes.Number, default: 5 },
  };

  private spawnPoints: SpawnPointGizmo[] = [];
  private lastSpawnTimes = new Map<string, number>();
  private activeSpawns = new Set<string>();
  private spawnQueue: Array<{ pointId: string; callback: () => void }> = [];

  start() {
    this.initializeSpawnPoints();
  }

  private initializeSpawnPoints() {
    this.props.spawnPoints!.forEach((entity, index) => {
      if (entity instanceof SpawnPointGizmo) {
        this.spawnPoints.push(entity);
        entity.name.set(`SpawnPoint_${index}`);
      }
    });

    console.log(`Initialized ${this.spawnPoints.length} spawn points`);
  }

  // Spawn at specific point with cooldown
  public spawnAtPoint(
    pointIndex: number,
    spawnCallback: () => Entity | null
  ): boolean {
    if (pointIndex < 0 || pointIndex >= this.spawnPoints.length) {
      console.error(`Invalid spawn point index: ${pointIndex}`);
      return false;
    }

    const spawnPoint = this.spawnPoints[pointIndex];
    const pointId = spawnPoint.id.toString();

    // Check cooldown
    if (!this.canSpawnAtPoint(pointId)) {
      this.queueSpawn(pointId, () =>
        this.executeSpawn(spawnPoint, spawnCallback)
      );
      return false;
    }

    return this.executeSpawn(spawnPoint, spawnCallback);
  }

  private canSpawnAtPoint(pointId: string): boolean {
    const now = Date.now();
    const lastSpawn = this.lastSpawnTimes.get(pointId) || 0;
    return now - lastSpawn >= this.props.spawnCooldown!;
  }

  private queueSpawn(pointId: string, callback: () => void) {
    this.spawnQueue.push({ pointId, callback });
  }

  private executeSpawn(
    spawnPoint: SpawnPointGizmo,
    spawnCallback: () => Entity | null
  ): boolean {
    if (this.activeSpawns.size >= this.props.maxConcurrentSpawns!) {
      console.warn("Maximum concurrent spawns reached");
      return false;
    }

    try {
      const spawnedEntity = spawnCallback();

      if (spawnedEntity) {
        // Position spawned entity at spawn point
        const spawnPosition = spawnPoint.transform.position.get();
        spawnedEntity.transform.position.set(spawnPosition);

        const pointId = spawnPoint.id.toString();
        this.lastSpawnTimes.set(pointId, Date.now());
        this.activeSpawns.add(spawnedEntity.id.toString());

        // Remove from active spawns when entity is destroyed
        this.trackSpawnedEntity(spawnedEntity);

        return true;
      }
    } catch (error) {
      console.error("Spawn failed:", error);
    }

    return false;
  }

  private trackSpawnedEntity(entity: Entity) {
    // This is a simplified tracking - in practice you might want more robust entity lifecycle tracking
    this.async.setTimeout(() => {
      this.activeSpawns.delete(entity.id.toString());
      this.processSpawnQueue();
    }, 10000); // Remove from tracking after 10 seconds
  }

  private processSpawnQueue() {
    while (
      this.spawnQueue.length > 0 &&
      this.activeSpawns.size < this.props.maxConcurrentSpawns!
    ) {
      const queuedSpawn = this.spawnQueue.shift()!;

      if (this.canSpawnAtPoint(queuedSpawn.pointId)) {
        queuedSpawn.callback();
      } else {
        // Put back in queue if still on cooldown
        this.spawnQueue.unshift(queuedSpawn);
        break;
      }
    }
  }

  // Find best spawn point (least recently used)
  public findBestSpawnPoint(): SpawnPointGizmo | null {
    if (this.spawnPoints.length === 0) return null;

    let bestPoint = this.spawnPoints[0];
    let oldestSpawnTime = this.lastSpawnTimes.get(bestPoint.id.toString()) || 0;

    this.spawnPoints.forEach((point) => {
      const pointId = point.id.toString();
      const lastSpawn = this.lastSpawnTimes.get(pointId) || 0;

      if (lastSpawn < oldestSpawnTime) {
        oldestSpawnTime = lastSpawn;
        bestPoint = point;
      }
    });

    return bestPoint;
  }

  // Spawn at random point
  public spawnAtRandomPoint(spawnCallback: () => Entity | null): boolean {
    const randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
    return this.spawnAtPoint(randomIndex, spawnCallback);
  }

  tick() {
    // Process queued spawns
    this.processSpawnQueue();
  }
}
```

### TriggerGizmo Management

```typescript
class TriggerManager extends Component<typeof TriggerManager> {
  static propsDefinition = {
    triggerGizmo: { type: PropTypes.Entity },
    triggerCooldown: { type: PropTypes.Number, default: 500 },
    allowMultipleTriggers: { type: PropTypes.Boolean, default: true },
  };

  private triggerGizmo?: TriggerGizmo;
  private lastTriggerTime = 0;
  private entitiesInTrigger = new Set<string>();
  private triggerCallbacks = new Map<string, (entity: Entity) => void>();

  start() {
    this.triggerGizmo = this.props.triggerGizmo as TriggerGizmo;
    if (!this.triggerGizmo) {
      console.error("TriggerGizmo not found");
      return;
    }

    this.setupTriggerEvents();
  }

  private setupTriggerEvents() {
    if (!this.triggerGizmo) return;

    // Connect to trigger events
    this.connectCodeBlockEvent(
      this.triggerGizmo,
      CodeBlockEvents.OnTriggerEnter,
      this.handleTriggerEnter.bind(this)
    );

    this.connectCodeBlockEvent(
      this.triggerGizmo,
      CodeBlockEvents.OnTriggerExit,
      this.handleTriggerExit.bind(this)
    );
  }

  private handleTriggerEnter(entity: Entity) {
    const entityId = entity.id.toString();

    // Check cooldown
    if (!this.canTrigger()) return;

    // Check if already in trigger (for multiple trigger prevention)
    if (
      !this.props.allowMultipleTriggers! &&
      this.entitiesInTrigger.has(entityId)
    ) {
      return;
    }

    this.entitiesInTrigger.add(entityId);
    this.lastTriggerTime = Date.now();

    // Execute callbacks
    this.executeTriggerCallbacks("enter", entity);

    console.log(`Entity ${entity.name.get()} entered trigger`);
  }

  private handleTriggerExit(entity: Entity) {
    const entityId = entity.id.toString();
    this.entitiesInTrigger.delete(entityId);

    // Execute callbacks
    this.executeTriggerCallbacks("exit", entity);

    console.log(`Entity ${entity.name.get()} exited trigger`);
  }

  private canTrigger(): boolean {
    const now = Date.now();
    return now - this.lastTriggerTime >= this.props.triggerCooldown!;
  }

  private executeTriggerCallbacks(eventType: string, entity: Entity) {
    const callback = this.triggerCallbacks.get(eventType);
    if (callback) {
      try {
        callback(entity);
      } catch (error) {
        console.error(`Trigger callback error for ${eventType}:`, error);
      }
    }
  }

  // Register callbacks for trigger events
  public onTriggerEnter(callback: (entity: Entity) => void) {
    this.triggerCallbacks.set("enter", callback);
  }

  public onTriggerExit(callback: (entity: Entity) => void) {
    this.triggerCallbacks.set("exit", callback);
  }

  // Check if specific entity is in trigger
  public isEntityInTrigger(entity: Entity): boolean {
    return this.entitiesInTrigger.has(entity.id.toString());
  }

  // Get all entities currently in trigger
  public getEntitiesInTrigger(): string[] {
    return Array.from(this.entitiesInTrigger);
  }

  // Reset trigger state
  public resetTrigger() {
    this.entitiesInTrigger.clear();
    this.lastTriggerTime = 0;
  }
}
```

## Projectile and AI Gizmos

### ProjectileLauncherGizmo Management

```typescript
class ProjectileManager extends Component<typeof ProjectileManager> {
  static propsDefinition = {
    launcherGizmo: { type: PropTypes.Entity },
    projectileAsset: { type: PropTypes.Asset },
    defaultSpeed: { type: PropTypes.Number, default: 20 },
    maxConcurrentProjectiles: { type: PropTypes.Number, default: 10 },
  };

  private launcherGizmo?: ProjectileLauncherGizmo;
  private activeProjectiles = new Set<string>();
  private projectileQueue: Array<LaunchProjectileOptions> = [];

  start() {
    this.launcherGizmo = this.props.launcherGizmo as ProjectileLauncherGizmo;
    if (!this.launcherGizmo) {
      console.error("ProjectileLauncherGizmo not found");
    }
  }

  // Launch projectile with management
  public launchProjectile(
    direction: Vec3,
    options?: Partial<LaunchProjectileOptions>
  ): boolean {
    if (!this.launcherGizmo || !this.props.projectileAsset) return false;

    // Check concurrent projectile limit
    if (this.activeProjectiles.size >= this.props.maxConcurrentProjectiles!) {
      this.queueProjectile(direction, options);
      return false;
    }

    const launchOptions: LaunchProjectileOptions = {
      asset: this.props.projectileAsset!,
      speed: options?.speed ?? this.props.defaultSpeed!,
      direction: direction.normalize(),
      players: options?.players ?? [],
      ...options,
    };

    try {
      this.launcherGizmo.launch(launchOptions);

      const projectileId = this.generateProjectileId();
      this.activeProjectiles.add(projectileId);

      // Remove from active list after estimated flight time
      this.scheduleProjectileCleanup(projectileId, launchOptions);

      return true;
    } catch (error) {
      console.error("Failed to launch projectile:", error);
      return false;
    }
  }

  private queueProjectile(
    direction: Vec3,
    options?: Partial<LaunchProjectileOptions>
  ) {
    const launchOptions: LaunchProjectileOptions = {
      asset: this.props.projectileAsset!,
      speed: options?.speed ?? this.props.defaultSpeed!,
      direction: direction.normalize(),
      players: options?.players ?? [],
      ...options,
    };

    this.projectileQueue.push(launchOptions);
  }

  private processProjectileQueue() {
    while (
      this.projectileQueue.length > 0 &&
      this.activeProjectiles.size < this.props.maxConcurrentProjectiles!
    ) {
      const queuedProjectile = this.projectileQueue.shift()!;
      this.launchProjectile(queuedProjectile.direction, queuedProjectile);
    }
  }

  private scheduleProjectileCleanup(
    projectileId: string,
    options: LaunchProjectileOptions
  ) {
    // Estimate flight time based on speed and typical range
    const estimatedFlightTime = (100 / options.speed) * 1000; // Simple estimation

    this.async.setTimeout(() => {
      this.activeProjectiles.delete(projectileId);
      this.processProjectileQueue();
    }, estimatedFlightTime);
  }

  private generateProjectileId(): string {
    return `projectile_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  // Launch at specific target
  public launchAtTarget(target: Vec3, speed?: number): boolean {
    if (!this.launcherGizmo) return false;

    const launcherPos = this.launcherGizmo.transform.position.get();
    const direction = target.subtract(launcherPos).normalize();

    return this.launchProjectile(direction, { speed });
  }

  // Launch with arc (for gravity simulation)
  public launchWithArc(target: Vec3, arcHeight: number = 5): boolean {
    if (!this.launcherGizmo) return false;

    const launcherPos = this.launcherGizmo.transform.position.get();
    const displacement = target.subtract(launcherPos);
    const distance = new Vec3(displacement.x, 0, displacement.z).magnitude();

    // Calculate launch angle for desired arc
    const gravity = 9.81;
    const angle = Math.atan2(displacement.y + arcHeight, distance);
    const speed = Math.sqrt((distance * gravity) / Math.sin(2 * angle));

    const launchDirection = new Vec3(
      displacement.x / distance,
      Math.tan(angle),
      displacement.z / distance
    ).normalize();

    return this.launchProjectile(launchDirection, { speed });
  }

  // Rapid fire mode
  public startRapidFire(
    direction: Vec3,
    interval: number = 200,
    duration: number = 2000
  ) {
    const startTime = Date.now();

    const fireProjectile = () => {
      if (Date.now() - startTime >= duration) return;

      this.launchProjectile(direction);
      this.async.setTimeout(fireProjectile, interval);
    };

    fireProjectile();
  }
}
```

### AIAgentGizmo Management

```typescript
class AIAgentManager extends Component<typeof AIAgentManager> {
  static propsDefinition = {
    aiGizmo: { type: PropTypes.Entity },
    patrolPoints: { type: PropTypes.Vec3Array, default: [] },
    detectionRange: { type: PropTypes.Number, default: 10 },
  };

  private aiGizmo?: AIAgentGizmo;
  private currentTarget?: Entity;
  private patrolIndex = 0;
  private currentState: "patrol" | "chase" | "idle" = "idle";
  private lastStateChange = 0;

  start() {
    this.aiGizmo = this.props.aiGizmo as AIAgentGizmo;
    if (!this.aiGizmo) {
      console.error("AIAgentGizmo not found");
      return;
    }

    this.initializeAI();
  }

  private initializeAI() {
    if (this.props.patrolPoints!.length > 0) {
      this.startPatrol();
    } else {
      this.currentState = "idle";
    }
  }

  // Start patrol behavior
  public startPatrol() {
    if (this.props.patrolPoints!.length === 0) return;

    this.currentState = "patrol";
    this.patrolIndex = 0;
    this.moveToNextPatrolPoint();
  }

  private moveToNextPatrolPoint() {
    if (!this.aiGizmo || this.props.patrolPoints!.length === 0) return;

    const targetPoint = this.props.patrolPoints![this.patrolIndex];
    this.moveToPosition(targetPoint);

    // Move to next patrol point
    this.patrolIndex = (this.patrolIndex + 1) % this.props.patrolPoints!.length;
  }

  private moveToPosition(position: Vec3) {
    if (!this.aiGizmo) return;

    try {
      this.aiGizmo.moveToPosition(position);
    } catch (error) {
      console.error("AI movement failed:", error);
    }
  }

  // Target tracking
  public setTarget(target: Entity) {
    this.currentTarget = target;
    this.currentState = "chase";
    this.lastStateChange = Date.now();
  }

  public clearTarget() {
    this.currentTarget = undefined;
    this.currentState = "idle";
    this.lastStateChange = Date.now();
  }

  // Update AI behavior
  tick() {
    this.updateAIBehavior();
  }

  private updateAIBehavior() {
    switch (this.currentState) {
      case "patrol":
        this.handlePatrolState();
        break;
      case "chase":
        this.handleChaseState();
        break;
      case "idle":
        this.handleIdleState();
        break;
    }
  }

  private handlePatrolState() {
    // Check for nearby targets
    const nearbyTarget = this.findNearbyTarget();
    if (nearbyTarget) {
      this.setTarget(nearbyTarget);
      return;
    }

    // Continue patrol if reached current point
    if (this.hasReachedDestination()) {
      this.async.setTimeout(() => {
        this.moveToNextPatrolPoint();
      }, 1000); // Wait 1 second at each patrol point
    }
  }

  private handleChaseState() {
    if (!this.currentTarget) {
      this.clearTarget();
      return;
    }

    // Check if target is still in range
    const targetPosition = this.currentTarget.transform.position.get();
    const aiPosition = this.aiGizmo!.transform.position.get();
    const distance = aiPosition.distanceTo(targetPosition);

    if (distance > this.props.detectionRange! * 2) {
      // Lost target, return to patrol
      this.clearTarget();
      this.startPatrol();
    } else {
      // Continue chasing
      this.moveToPosition(targetPosition);
    }
  }

  private handleIdleState() {
    // Look for targets or return to patrol after timeout
    const nearbyTarget = this.findNearbyTarget();
    if (nearbyTarget) {
      this.setTarget(nearbyTarget);
    } else if (Date.now() - this.lastStateChange > 5000) {
      // Return to patrol after 5 seconds of idle
      this.startPatrol();
    }
  }

  private findNearbyTarget(): Entity | null {
    if (!this.aiGizmo) return null;

    const aiPosition = this.aiGizmo.transform.position.get();
    const players = this.world.getEntitiesByTag("player");

    for (const player of players) {
      const distance = aiPosition.distanceTo(player.transform.position.get());
      if (distance <= this.props.detectionRange!) {
        return player;
      }
    }

    return null;
  }

  private hasReachedDestination(): boolean {
    if (!this.aiGizmo) return false;

    // This would depend on the AI implementation
    // You might need to track movement completion differently
    return true; // Simplified
  }

  // Stop all AI movement
  public stopAI() {
    if (this.aiGizmo) {
      try {
        this.aiGizmo.stop();
        this.currentState = "idle";
      } catch (error) {
        console.error("Failed to stop AI:", error);
      }
    }
  }
}
```

## Light and Visual Effects

### DynamicLightGizmo Management

```typescript
class LightManager extends Component<typeof LightManager> {
  static propsDefinition = {
    lightGizmo: { type: PropTypes.Entity },
    defaultIntensity: { type: PropTypes.Number, default: 1.0 },
    defaultColor: { type: PropTypes.Color, default: Color.white() },
  };

  private lightGizmo?: DynamicLightGizmo;
  private originalIntensity: number = 1.0;
  private originalColor: Color = Color.white();
  private animationTimers: any[] = [];

  start() {
    this.lightGizmo = this.props.lightGizmo as DynamicLightGizmo;
    if (!this.lightGizmo) {
      console.error("DynamicLightGizmo not found");
      return;
    }

    this.initializeLight();
  }

  private initializeLight() {
    if (!this.lightGizmo) return;

    try {
      this.lightGizmo.intensity.set(this.props.defaultIntensity!);
      this.lightGizmo.color.set(this.props.defaultColor!);

      this.originalIntensity = this.props.defaultIntensity!;
      this.originalColor = this.props.defaultColor!.clone();
    } catch (error) {
      console.error("Failed to initialize light:", error);
    }
  }

  // Animate light intensity
  public animateIntensity(targetIntensity: number, duration: number = 1000) {
    if (!this.lightGizmo) return;

    const startIntensity = this.lightGizmo.intensity.get();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentIntensity =
        startIntensity + (targetIntensity - startIntensity) * progress;
      this.lightGizmo!.intensity.set(currentIntensity);

      if (progress < 1) {
        const timer = this.async.setTimeout(animate, 16);
        this.animationTimers.push(timer);
      }
    };

    animate();
  }

  // Animate light color
  public animateColor(targetColor: Color, duration: number = 1000) {
    if (!this.lightGizmo) return;

    const startColor = this.lightGizmo.color.get();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentColor = startColor.lerp(targetColor, progress);
      this.lightGizmo!.color.set(currentColor);

      if (progress < 1) {
        const timer = this.async.setTimeout(animate, 16);
        this.animationTimers.push(timer);
      }
    };

    animate();
  }

  // Flickering light effect
  public startFlicker(intensity: number = 0.5, speed: number = 100) {
    const flicker = () => {
      if (!this.lightGizmo) return;

      const randomIntensity =
        this.originalIntensity * (0.5 + Math.random() * intensity);
      this.lightGizmo.intensity.set(randomIntensity);

      const timer = this.async.setTimeout(
        flicker,
        speed + Math.random() * speed
      );
      this.animationTimers.push(timer);
    };

    flicker();
  }

  // Pulsing light effect
  public startPulse(
    minIntensity: number = 0.2,
    maxIntensity: number = 1.0,
    speed: number = 1000
  ) {
    const startTime = Date.now();

    const pulse = () => {
      if (!this.lightGizmo) return;

      const elapsed = Date.now() - startTime;
      const cycle = (elapsed % speed) / speed; // 0 to 1
      const intensity =
        minIntensity +
        (maxIntensity - minIntensity) *
          (Math.sin(cycle * Math.PI * 2) * 0.5 + 0.5);

      this.lightGizmo.intensity.set(intensity);

      const timer = this.async.setTimeout(pulse, 16);
      this.animationTimers.push(timer);
    };

    pulse();
  }

  // Rainbow color cycling
  public startRainbowCycle(speed: number = 2000) {
    const startTime = Date.now();

    const cycle = () => {
      if (!this.lightGizmo) return;

      const elapsed = Date.now() - startTime;
      const hue = (elapsed % speed) / speed; // 0 to 1

      // Convert HSV to RGB for rainbow effect
      const color = this.hsvToColor(hue, 1.0, 1.0);
      this.lightGizmo.color.set(color);

      const timer = this.async.setTimeout(cycle, 16);
      this.animationTimers.push(timer);
    };

    cycle();
  }

  private hsvToColor(h: number, s: number, v: number): Color {
    const c = v * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return new Color(r + m, g + m, b + m, 1);
  }

  // Stop all animations and reset to original state
  public stopAllAnimations() {
    this.animationTimers.forEach((timer) => this.async.clearTimeout(timer));
    this.animationTimers.length = 0;

    if (this.lightGizmo) {
      this.lightGizmo.intensity.set(this.originalIntensity);
      this.lightGizmo.color.set(this.originalColor);
    }
  }

  dispose() {
    this.stopAllAnimations();
  }
}
```

## Performance Optimization

### Gizmo Performance Best Practices

```typescript
class GizmoOptimization extends Component<typeof GizmoOptimization> {
  private gizmoPool = new Map<string, Entity[]>();
  private activeGizmos = new Set<string>();
  private readonly MAX_POOL_SIZE = 20;

  // Gizmo pooling system
  public borrowGizmo(gizmoType: string): Entity | null {
    const pool = this.gizmoPool.get(gizmoType) || [];

    if (pool.length > 0) {
      const gizmo = pool.pop()!;
      this.activeGizmos.add(gizmo.id.toString());
      return gizmo;
    }

    // Pool empty, create new gizmo
    return this.createGizmo(gizmoType);
  }

  public returnGizmo(gizmo: Entity, gizmoType: string) {
    const pool = this.gizmoPool.get(gizmoType) || [];

    if (pool.length < this.MAX_POOL_SIZE) {
      // Reset gizmo state
      this.resetGizmoState(gizmo, gizmoType);
      pool.push(gizmo);
      this.gizmoPool.set(gizmoType, pool);
    } else {
      // Pool full, dispose gizmo
      gizmo.dispose();
    }

    this.activeGizmos.delete(gizmo.id.toString());
  }

  private createGizmo(gizmoType: string): Entity | null {
    // Factory method for creating gizmos
    switch (gizmoType) {
      case "particle":
        return this.world.createEntity(); // Would be actual ParticleGizmo creation
      case "audio":
        return this.world.createEntity(); // Would be actual AudioGizmo creation
      case "text":
        return this.world.createEntity(); // Would be actual TextGizmo creation
      default:
        console.error(`Unknown gizmo type: ${gizmoType}`);
        return null;
    }
  }

  private resetGizmoState(gizmo: Entity, gizmoType: string) {
    // Reset gizmo to default state for reuse
    gizmo.setVisibility(false);
    gizmo.transform.position.set(Vec3.zero());
    gizmo.transform.rotation.set(Quaternion.identity());
    gizmo.transform.scale.set(Vec3.one());

    // Type-specific resets
    switch (gizmoType) {
      case "particle":
        const particleGizmo = gizmo as ParticleGizmo;
        particleGizmo.stop();
        break;
      case "audio":
        const audioGizmo = gizmo as AudioGizmo;
        audioGizmo.stop();
        break;
      case "text":
        const textGizmo = gizmo as TextGizmo;
        textGizmo.text.set("");
        break;
    }
  }

  // Distance-based LOD for gizmos
  public updateGizmoLOD(playerPosition: Vec3) {
    this.activeGizmos.forEach((gizmoId) => {
      const gizmo = this.world.getEntityById(gizmoId);
      if (!gizmo) return;

      const distance = gizmo.transform.position
        .get()
        .distanceTo(playerPosition);

      if (distance > 100) {
        // Very far: disable gizmo
        gizmo.setVisibility(false);
      } else if (distance > 50) {
        // Far: reduce gizmo quality/frequency
        this.reducedQualityUpdate(gizmo);
      } else {
        // Near: full quality
        gizmo.setVisibility(true);
        this.fullQualityUpdate(gizmo);
      }
    });
  }

  private reducedQualityUpdate(gizmo: Entity) {
    // Implement reduced quality updates for distant gizmos
    gizmo.setVisibility(true);

    // Example: Update particle systems less frequently
    if (gizmo instanceof ParticleGizmo) {
      // Reduce particle count or update frequency
    }
  }

  private fullQualityUpdate(gizmo: Entity) {
    // Implement full quality updates for nearby gizmos
    gizmo.setVisibility(true);
  }

  // Batch gizmo operations
  public batchUpdateGizmos(
    gizmos: Entity[],
    updateFunction: (gizmo: Entity) => void
  ) {
    const BATCH_SIZE = 10;
    let index = 0;

    const processBatch = () => {
      const endIndex = Math.min(index + BATCH_SIZE, gizmos.length);

      for (let i = index; i < endIndex; i++) {
        try {
          updateFunction(gizmos[i]);
        } catch (error) {
          console.error(`Error updating gizmo ${i}:`, error);
        }
      }

      index = endIndex;

      if (index < gizmos.length) {
        this.async.setTimeout(processBatch, 0);
      }
    };

    processBatch();
  }

  // Memory-efficient gizmo tracking
  private readonly MAX_TRACKING_HISTORY = 100;
  private gizmoHistory: Array<{ id: string; type: string; timestamp: number }> =
    [];

  public trackGizmoUsage(gizmo: Entity, type: string) {
    this.gizmoHistory.push({
      id: gizmo.id.toString(),
      type,
      timestamp: Date.now(),
    });

    // Keep only recent history
    if (this.gizmoHistory.length > this.MAX_TRACKING_HISTORY) {
      this.gizmoHistory.shift();
    }
  }

  dispose() {
    // Clean up all pooled gizmos
    this.gizmoPool.forEach((pool) => {
      pool.forEach((gizmo) => gizmo.dispose());
    });
    this.gizmoPool.clear();
    this.activeGizmos.clear();
  }
}
```

## Summary

1. **Use gizmo pooling** for frequently created/destroyed gizmos
2. **Implement proper resource management** with cleanup in dispose()
3. **Validate gizmo references** before performing operations
4. **Use distance-based LOD** for performance optimization
5. **Batch gizmo operations** when updating multiple gizmos
6. **Handle gizmo failures gracefully** with try-catch blocks
7. **Implement cooldowns and limits** for resource-intensive gizmos
8. **Cache gizmo references** to avoid repeated lookups
9. **Use appropriate gizmo types** for each use case
10. **Monitor gizmo performance** and adjust based on player proximity
