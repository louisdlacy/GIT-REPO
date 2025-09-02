import * as hz from "horizon/core";
import { NavMeshAgent } from "horizon/navmesh";
import { NPCAgent } from "NPCAgent";
import * as ab from "horizon/unity_asset_bundles";

interface BoundingBox {
  min: hz.Vec3;
  max: hz.Vec3;
}

class NPCChicken extends NPCAgent<typeof NPCChicken> {
  static propsDefinition = {
    ...NPCAgent.propsDefinition,
    navMeshVolume: {type: hz.PropTypes.Entity},
    minIdle: {type: hz.PropTypes.Number, default: 1},
    maxIdle: {type: hz.PropTypes.Number, default: 2},
  };
  static dummy: number = 0;

  private boundingBox!: BoundingBox;
  private newDestinationTimer: number = 0;

  private isIdling: boolean = false;
  private destinationAttempts: number = 0;


  start() {
    super.start();

    if (this.props.navMeshVolume !== undefined) {
      const navMeshVolume = this.props.navMeshVolume;
      const bbScale = navMeshVolume.scale.get().mul(0.5);
      const bbPosition = navMeshVolume.position.get();
      this.boundingBox = {min: bbPosition.add(new hz.Vec3(-bbScale.x, 0, -bbScale.z)), max: bbPosition.add(new hz.Vec3(bbScale.x, 0, bbScale.z))};
    }

    this.newDestinationTimer = this.getNewDestinationDelay();
    this.findNewDestination();

  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.navMeshAgent !== undefined){
      const distanceToTarget = this.navMeshAgent.remainingDistance.get();
      if (distanceToTarget < 0.1) {
        if (!this.isIdling) {
          this.randomIdle();
        }
        this.newDestinationTimer -= deltaTime;
        if (this.newDestinationTimer <= 0) {
          this.newDestinationTimer = this.getNewDestinationDelay();
          this.findNewDestination();
        }
      }
    }
  }

  randomIdle(){
    this.isIdling = true;
    this.entity.as(ab.AssetBundleGizmo)?.getRoot().setAnimationParameterFloat("Random", Math.random());
  }

  setNewDestination(destination: hz.Vec3){
    this.isIdling = false;
    this.lookAt = destination;
    this.async.setTimeout(() => {
      this.entity.as(NavMeshAgent)?.destination.set(destination);
    }, 300);
  }

  findNewDestination(){
    this.destinationAttempts++;
    const rPosition = this.getRandomDestination();
    const delta = rPosition.sub(this.getHeadPosition());
    const dotFwd = hz.Vec3.dot(this.entity.forward.get(), delta);
    if (delta.magnitude() > 4 || (dotFwd < 0.1 && this.destinationAttempts < 5)) {
      this.async.setTimeout(() => {
        this.findNewDestination();
      }, 200);
    } else {
      this.destinationAttempts = 0;
      this.setNewDestination(rPosition);
    }
  }

  getRandomDestination(): hz.Vec3 {
    const rx = Math.random() * (this.boundingBox.max.x - this.boundingBox.min.x) + this.boundingBox.min.x;
    const rz = Math.random() * (this.boundingBox.max.z - this.boundingBox.min.z) + this.boundingBox.min.z;
    return new hz.Vec3(rx, 0, rz);
  }

  getHeadPosition(){
    const headPosition = this.entity.position.get();
    headPosition.y += this.props.headHeight;
    return headPosition;
  }

  getNewDestinationDelay(): number {
    return Math.random() * (this.props.maxIdle - this.props.minIdle) + this.props.minIdle;
  }
}
hz.Component.register(NPCChicken);
