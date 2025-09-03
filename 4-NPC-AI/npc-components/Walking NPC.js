"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hz = __importStar(require("horizon/core"));
const npc = __importStar(require("horizon/npc"));
const aiAgent = __importStar(require("horizon/avatar_ai_agent"));
class raycastAttachable extends hz.Component {
    constructor() {
        super(...arguments);
        this.currentHealth = 1;
        this.isWandering = false;
        this.wanderTimer = null;
    }
    start() {
        // Get required gizmos
        this.npcGizmo = this.entity.as(npc.Npc);
        this.aiAgent = this.entity.as(aiAgent.AvatarAIAgent);
        this.raycastGizmo = this.entity.as(hz.RaycastGizmo);
        if (!this.npcGizmo || !this.aiAgent || !this.raycastGizmo) {
            console.error("raycastAttachable: Missing required gizmos (NPC, AvatarAIAgent, or Raycast)");
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
    startHitDetection() {
        // This method would be implemented based on specific game logic
        // For now, we'll assume the component can be hit by external raycast calls
        console.log("Hit detection system initialized");
    }
    onRaycastHit(hitInfo) {
        console.log("NPC hit by raycast!");
        // Take damage
        this.currentHealth--;
        if (this.currentHealth <= 0) {
            this.respawnNPC();
        }
        else {
            // React to being hit (optional: play hit animation, sound, etc.)
            this.reactToHit();
        }
    }
    respawnNPC() {
        console.log("NPC respawning...");
        // Stop wandering temporarily
        this.stopWandering();
        // Hide NPC temporarily (optional visual effect)
        this.entity.visible.set(false);
        // Wait for respawn delay
        this.async.setTimeout(() => {
            // Reset position to spawn point
            this.entity.transform.position.set(this.spawnPoint.add(new hz.Vec3(0, this.props.respawnHeight, 0)));
            // Reset health
            this.currentHealth = this.props.maxHealth;
            // Show NPC again
            this.entity.visible.set(true);
            // Resume wandering
            this.startWandering();
            console.log("NPC respawned!");
        }, this.props.respawnDelay * 1000);
    }
    reactToHit() {
        // Optional: Add hit reaction behavior here
        // For example: play hit sound, animation, or temporary speed boost
        console.log(`NPC hit! Health remaining: ${this.currentHealth}`);
    }
    startWandering() {
        if (this.isWandering)
            return;
        this.isWandering = true;
        this.scheduleNextWander();
    }
    stopWandering() {
        this.isWandering = false;
        if (this.wanderTimer) {
            this.async.clearTimeout(this.wanderTimer);
            this.wanderTimer = null;
        }
    }
    scheduleNextWander() {
        if (!this.isWandering)
            return;
        this.wanderTimer = this.async.setTimeout(() => {
            this.wander();
            this.scheduleNextWander();
        }, this.props.wanderInterval * 1000);
    }
    async wander() {
        if (!this.isWandering || !this.aiAgent)
            return;
        // Generate random position within wander radius
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = Math.random() * this.props.wanderRadius;
        const wanderTarget = new hz.Vec3(this.spawnPoint.x + Math.cos(randomAngle) * randomDistance, this.spawnPoint.y, this.spawnPoint.z + Math.sin(randomAngle) * randomDistance);
        console.log(`NPC wandering to: ${wanderTarget.x.toFixed(2)}, ${wanderTarget.z.toFixed(2)}`);
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
        }
        catch (error) {
            console.warn("NPC wander action was interrupted:", error);
        }
    }
    // Public method to manually trigger respawn (useful for testing)
    triggerRespawn() {
        this.currentHealth = 0;
        this.respawnNPC();
    }
    // Public method to trigger hit detection (called by external raycast systems)
    onHit() {
        const mockHitInfo = {
            distance: 0,
            hitPoint: new hz.Vec3(0, 0, 0),
            normal: new hz.Vec3(0, 1, 0),
            targetType: hz.RaycastTargetType.Entity,
            target: this.entity,
        };
        this.onRaycastHit(mockHitInfo);
    }
    // Public method to get current health
    getCurrentHealth() {
        return this.currentHealth;
    }
    dispose() {
        this.stopWandering();
    }
}
raycastAttachable.propsDefinition = {
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
hz.Component.register(raycastAttachable);
