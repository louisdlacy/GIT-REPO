// Import the necessary core modules from the Horizon Worlds API.
import * as hz from 'horizon/core';
import { WaypointNode } from './WaypointNode';

/**
 * ADVANCED ASSET V2.2
 * Moves an entity along a path of WaypointNode objects, now with
 * a simple toggle for smooth, curved motion and node-based rotation.
 */
class AdvancedPathMover extends hz.Component<typeof AdvancedPathMover> {
  // -- PROPERTIES --
  static propsDefinition = {
    // --- Path & Activation ---
    firstWaypoint: { type: hz.PropTypes.Entity },
    activationMode: { type: hz.PropTypes.String, default: "Start on Load" },
    triggerEntity: { type: hz.PropTypes.Entity },
    
    // --- Path Behavior ---
    endBehavior: { type: hz.PropTypes.String, default: "Stop" }, // Stop, Reset, Loop, Ping-Pong
    
    // --- Smoothing & Rotation ---
    useSmoothPath: { type: hz.PropTypes.Boolean, default: true },
    curveFactor: { type: hz.PropTypes.Number, default: 1.0 },
    // NEW: If true, the object will inherit the full rotation of the waypoints, allowing for banking turns.
    useNodeRotation: { type: hz.PropTypes.Boolean, default: true },
    usePathDirection: { type: hz.PropTypes.Boolean, default: true },
    lookAtTarget: { type: hz.PropTypes.Entity },
  };

  // -- STATE VARIABLES --
  private waypointNodes: WaypointNode[] = [];
  private originalStartPosition!: hz.Vec3;
  private originalStartRotation!: hz.Quaternion;
  
  private currentWaypointIndex: number = 0;
  private elapsedTime: number = 0;
  private isPaused: boolean = false;
  private pauseTimer: number = 0;
  private isReversing: boolean = false;
  private isPlaying: boolean = false;

  // Control points for the current curve segment
  private p0!: hz.Vec3; private p1!: hz.Vec3;
  private p2!: hz.Vec3; private p3!: hz.Vec3;
  // NEW: State variables to store the start and end rotation for the current segment
  private startSegmentRotation!: hz.Quaternion;
  private targetSegmentRotation!: hz.Quaternion;


  start() {
    if (!this.buildPath()) {
        console.error("[AdvancedPathMover] HALTED: Path could not be built. Check that firstWaypoint is linked and nodes are chained correctly.");
        return;
    }
    this.originalStartPosition = this.entity.position.get();
    this.originalStartRotation = this.entity.rotation.get();
    this.setupActivation();
    this.connectLocalBroadcastEvent(hz.World.onUpdate, this.onUpdate.bind(this));
  }

  private buildPath(): boolean {
      if (!this.props.firstWaypoint) return false;

      let currentNodeEntity: hz.Entity | undefined = this.props.firstWaypoint;
      while (currentNodeEntity) {
          const nodeComponent: WaypointNode | undefined = currentNodeEntity.getComponents(WaypointNode)[0];
          if (nodeComponent) {
              this.waypointNodes.push(nodeComponent);
              if (nodeComponent.props.isEndPoint) break;
              currentNodeEntity = nodeComponent.props.nextWaypoint;
          } else {
              console.error(`[AdvancedPathMover] Path broken at entity: ${currentNodeEntity.name.get()}. It's missing the WaypointNode script.`);
              break; 
          }
      }
      return this.waypointNodes.length > 1;
  }

  private setupActivation() {
    switch (this.props.activationMode) {
      case "On Player Enter Trigger":
        if (this.props.triggerEntity) {
          const trigger = this.props.triggerEntity.as(hz.TriggerGizmo);
          this.connectCodeBlockEvent(trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => this.triggerAnimation());
        } break;
      case "On Grab":
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, () => this.triggerAnimation());
        break;
      default: // "Start on Load"
        this.triggerAnimation();
        break;
    }
  }

  public triggerAnimation() {
    if (this.isPlaying) return;
    this.entity.position.set(this.originalStartPosition);
    this.entity.rotation.set(this.originalStartRotation);
    
    this.currentWaypointIndex = 0;
    this.isReversing = false;
    this.moveToNextSegment();
    this.isPlaying = true;
  }

  private onUpdate(data: { deltaTime: number }) {
    if (!this.isPlaying) return;

    if (this.isPaused) {
      this.pauseTimer += data.deltaTime;
      // Note: pause is taken from the START node of the segment
      const currentPauseDuration = this.waypointNodes[this.currentWaypointIndex].props.pauseHere;
      if (this.pauseTimer >= currentPauseDuration) {
        this.isPaused = false;
        this.moveToNextSegment();
      }
      return;
    }

    this.elapsedTime += data.deltaTime;
    // Note: duration and easing are taken from the END node of the segment
    const currentSegmentDuration = this.waypointNodes[this.currentWaypointIndex + 1].props.durationToHere;
    let progress = currentSegmentDuration > 0 ? this.elapsedTime / currentSegmentDuration : 1.0;

    if (progress >= 1.0) {
      progress = 1.0;
      this.isPaused = true;
      this.pauseTimer = 0;
    }

    const easingType = this.waypointNodes[this.currentWaypointIndex + 1].props.easingType;
    const easedProgress = this.getEasedProgress(progress, easingType);

    const currentPosition = this.getPointOnCurve(easedProgress);
    this.entity.position.set(currentPosition);
    
    // --- UPDATED ROTATION LOGIC ---
    if (this.props.lookAtTarget) {
        // Highest priority: Always face the target if one is provided.
        this.entity.lookAt(this.props.lookAtTarget.position.get());
    } else if (this.props.useNodeRotation) {
        // Second priority: Smoothly interpolate between the full rotations of the waypoints.
        const currentRotation = hz.Quaternion.slerp(this.startSegmentRotation, this.targetSegmentRotation, easedProgress);
        this.entity.rotation.set(currentRotation);
    } else if (this.props.usePathDirection) {
        // Lowest priority: Automatically face the direction of travel along the curve.
        const lookAheadPosition = this.getPointOnCurve(easedProgress + 0.01);
        const direction = hz.Vec3.sub(lookAheadPosition, currentPosition).normalize();
        if (direction.magnitudeSquared() > 0.001) {
            const targetRotation = hz.Quaternion.lookRotation(direction);
            const smoothedRotation = hz.Quaternion.slerp(this.entity.rotation.get(), targetRotation, data.deltaTime * 10);
            this.entity.rotation.set(smoothedRotation);
        }
    }
  }

  private moveToNextSegment() {
    if (this.isReversing) { this.currentWaypointIndex--; } 
    else { this.currentWaypointIndex++; }

    if (this.currentWaypointIndex >= this.waypointNodes.length - 1) {
        switch (this.props.endBehavior) {
            case "Reset":
                this.entity.position.set(this.originalStartPosition);
                this.entity.rotation.set(this.originalStartRotation);
                this.isPlaying = false; return;
            case "Loop":
                this.currentWaypointIndex = 0; break;
            case "Ping-Pong":
                this.isReversing = true;
                this.currentWaypointIndex = this.waypointNodes.length - 2; break;
            default: // "Stop"
                this.isPlaying = false; return;
        }
    } 
    else if (this.isReversing && this.currentWaypointIndex < 0) {
        this.isReversing = false; this.currentWaypointIndex = 1;
    }

    const i = this.currentWaypointIndex;
    const p0_idx = Math.max(0, i - 1);
    const p1_idx = i;
    const p2_idx = i + 1;
    const p3_idx = Math.min(this.waypointNodes.length - 1, i + 2);

    this.p0 = this.waypointNodes[p0_idx].entity.position.get();
    this.p1 = this.waypointNodes[p1_idx].entity.position.get();
    this.p2 = this.waypointNodes[p2_idx].entity.position.get();
    this.p3 = this.waypointNodes[p3_idx].entity.position.get();
    
    // NEW: Set the start and target rotations for this segment
    this.startSegmentRotation = this.waypointNodes[p1_idx].entity.rotation.get();
    this.targetSegmentRotation = this.waypointNodes[p2_idx].entity.rotation.get();

    this.elapsedTime = 0;
  }

  private getPointOnCurve(t: number): hz.Vec3 {
      const linearPoint = hz.Vec3.lerp(this.p1, this.p2, t);
      if (!this.props.useSmoothPath || this.props.curveFactor <= 0) {
          return linearPoint;
      }

      const curvedPoint = this.getCatmullRomPoint(t, this.p0, this.p1, this.p2, this.p3);
      if (this.props.curveFactor >= 1) return curvedPoint;

      return hz.Vec3.lerp(linearPoint, curvedPoint, this.props.curveFactor);
  }

  private getCatmullRomPoint(t: number, p0: hz.Vec3, p1: hz.Vec3, p2: hz.Vec3, p3: hz.Vec3): hz.Vec3 {
    const t2 = t * t; const t3 = t2 * t;
    const c1 = p1.clone().mulInPlace(2);
    const c2 = p2.clone().subInPlace(p0).mulInPlace(t);
    const c3 = p0.clone().mulInPlace(2).subInPlace(p1.clone().mulInPlace(5)).addInPlace(p2.clone().mulInPlace(4)).subInPlace(p3).mulInPlace(t2);
    const c4 = p0.clone().mulInPlace(-1).addInPlace(p1.clone().mulInPlace(3)).subInPlace(p2.clone().mulInPlace(3)).addInPlace(p3).mulInPlace(t3);
    return c1.addInPlace(c2).addInPlace(c3).addInPlace(c4).mulInPlace(0.5);
  }

  private getEasedProgress(progress: number, type: string): number {
    switch (type) { 
        case "Bounce": return this.easeOutBounce(progress); 
        case "Linear": return this.linear(progress); 
        case "Ease":
        default: return this.easeInOut(progress); 
    }
  }
  private easeInOut(t: number): number { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  private linear(t: number): number { return t; }
  private easeOutBounce(t: number): number {
    const n1 = 7.5625; const d1 = 2.75;
    if (t < 1 / d1) { return n1 * t * t; } else if (t < 2 / d1) { return n1 * (t -= 1.5 / d1) * t + 0.75; } else if (t < 2.5 / d1) { return n1 * (t -= 2.25 / d1) * t + 0.9375; } else { return n1 * (t -= 2.625 / d1) * t + 0.984375; }
  }
}
hz.Component.register(AdvancedPathMover);
