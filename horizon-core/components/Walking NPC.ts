import * as hz from "horizon/core";
import * as npc from "horizon/npc";
import * as aiAgent from "horizon/avatar_ai_agent";

class raycastAttachable extends hz.Component<typeof raycastAttachable> {
  static propsDefinition = {
    // Wandering behavior settings
    wanderRadius: { type: hz.PropTypes.Number, default: 10 },
    wanderSpeed: { type: hz.PropTypes.Number, default: 2 },
    wanderInterval: { type: hz.PropTypes.Number, default: 3 },
    rotationSpeed: { type: hz.PropTypes.Number, default: 180 },

    // Respawn settings
    respawnDelay: { type: hz.PropTypes.Number, default: 2 },
    respawnHeight: { type: hz.PropTypes.Number, default: 2 },

    // Health settings
    maxHealth: { type: hz.PropTypes.Number, default: 1 },
  };

  private npcGizmo!: npc.Npc;
  private aiAgent!: aiAgent.AvatarAIAgent;
  private raycastGizmo!: hz.RaycastGizmo;
  private spawnPoint!: hz.Vec3;
  private currentHealth: number = 1;
  private isWandering: boolean = false;
  private wanderTimer: number | null = null;

  start() {
    // Get required gizmos
    this.npcGizmo = this.entity.as(npc.Npc)!;
    this.aiAgent = this.entity.as(aiAgent.AvatarAIAgent)!;
    this.raycastGizmo = this.entity.as(hz.RaycastGizmo)!;

    if (!this.npcGizmo || !this.aiAgent || !this.raycastGizmo) {
      console.error(
        "raycastAttachable: Missing required gizmos (NPC, AvatarAIAgent, or Raycast)"
      );
      return;
    }

    // Store initial spawn point
    this.spawnPoint = this.entity.transform.position.get();
    this.currentHealth = this.props.maxHealth;

    // Set up raycast hit detection using polling approach
    // We'll check for hits periodically since there's no direct onRaycastHit event
    this.startHitDetection();

    // Start wandering behavior
    this.startWandering();
  }

  private startHitDetection() {
    // This method would be implemented based on specific game logic
    // For now, we'll assume the component can be hit by external raycast calls
    console.log("Hit detection system initialized");
  }

  private onRaycastHit(hitInfo: hz.RaycastHit) {
    console.log("NPC hit by raycast!");

    // Take damage
    this.currentHealth--;

    if (this.currentHealth <= 0) {
      this.respawnNPC();
    } else {
      // React to being hit (optional: play hit animation, sound, etc.)
      this.reactToHit();
    }
  }

  private respawnNPC() {
    console.log("NPC respawning...");

    // Stop wandering temporarily
    this.stopWandering();

    // Hide NPC temporarily (optional visual effect)
    this.entity.visible.set(false);

    // Wait for respawn delay
    this.async.setTimeout(() => {
      // Reset position to spawn point
      this.entity.transform.position.set(
        this.spawnPoint.add(new hz.Vec3(0, this.props.respawnHeight, 0))
      );

      // Reset health
      this.currentHealth = this.props.maxHealth;

      // Show NPC again
      this.entity.visible.set(true);

      // Resume wandering
      this.startWandering();

      console.log("NPC respawned!");
    }, this.props.respawnDelay * 1000);
  }

  private reactToHit() {
    // Optional: Add hit reaction behavior here
    // For example: play hit sound, animation, or temporary speed boost
    console.log(`NPC hit! Health remaining: ${this.currentHealth}`);
  }

  private startWandering() {
    if (this.isWandering) return;

    this.isWandering = true;
    this.scheduleNextWander();
  }

  private stopWandering() {
    this.isWandering = false;
    if (this.wanderTimer) {
      this.async.clearTimeout(this.wanderTimer);
      this.wanderTimer = null;
    }
  }

  private scheduleNextWander() {
    if (!this.isWandering) return;

    this.wanderTimer = this.async.setTimeout(() => {
      this.wander();
      this.scheduleNextWander();
    }, this.props.wanderInterval * 1000);
  }

  private async wander() {
    if (!this.isWandering || !this.aiAgent) return;

    // Generate random position within wander radius
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * this.props.wanderRadius;

    const wanderTarget = new hz.Vec3(
      this.spawnPoint.x + Math.cos(randomAngle) * randomDistance,
      this.spawnPoint.y,
      this.spawnPoint.z + Math.sin(randomAngle) * randomDistance
    );

    console.log(
      `NPC wandering to: ${wanderTarget.x.toFixed(2)}, ${wanderTarget.z.toFixed(
        2
      )}`
    );

    // Calculate direction from current position to target
    const currentPosition = this.entity.transform.position.get();
    const direction = wanderTarget.sub(currentPosition).normalize();

    // Make sure we only rotate on the Y axis (horizontal plane)
    const faceDirection = new hz.Vec3(direction.x, 0, direction.z).normalize();

    try {
      // First rotate to face the direction we're about to move
      await this.aiAgent.locomotion.rotateTo(faceDirection, {
        rotationSpeed: this.props.rotationSpeed, // degrees per second
      });

      // Then move to the target position
      await this.aiAgent.locomotion.moveToPosition(wanderTarget, {
        movementSpeed: this.props.wanderSpeed,
      });
    } catch (error) {
      console.warn("NPC wander action was interrupted:", error);
    }
  }

  // Public method to manually trigger respawn (useful for testing)
  public triggerRespawn() {
    this.currentHealth = 0;
    this.respawnNPC();
  }

  // Public method to trigger hit detection (called by external raycast systems)
  public onHit() {
    const mockHitInfo: hz.EntityRaycastHit = {
      distance: 0,
      hitPoint: new hz.Vec3(0, 0, 0),
      normal: new hz.Vec3(0, 1, 0),
      targetType: hz.RaycastTargetType.Entity,
      target: this.entity,
    };
    this.onRaycastHit(mockHitInfo);
  }

  // Public method to get current health
  public getCurrentHealth(): number {
    return this.currentHealth;
  }

  dispose() {
    this.stopWandering();
  }
}

hz.Component.register(raycastAttachable);
