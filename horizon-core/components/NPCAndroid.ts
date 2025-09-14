import { NPCAgent } from 'NPCAgent';
import { RegisterWaypoint } from 'NPCAndroidWaypoint';
import * as hz from 'horizon/core';
import { Quaternion } from 'horizon/core';
import { NavMeshAgent } from "horizon/navmesh";


class NPCAndroid extends NPCAgent<typeof NPCAndroid> {
  static propsDefinition = {
    ...NPCAgent.propsDefinition,
    routeIndex: {type: hz.PropTypes.Number, default: 0},
    minIdleTime: {type: hz.PropTypes.Number, default: 1},
    maxIdleTime: {type: hz.PropTypes.Number, default: 3},
    startingIndex: {type: hz.PropTypes.Number, default: 0},
    viewTrigger: {type: hz.PropTypes.Entity},
  }
  static dummy: number = 0;

  private waypoints: hz.Vec3[] = [];
  private targetWaypoint: number = 0;
  private pathUpdate: (deltaTime: number)=>void = ()=>{};
  private idleTimer: number = 0;
  private lookAtPlayer: hz.Player | undefined = undefined;

  preStart(): void {
    this.targetWaypoint = this.props.startingIndex;
    this.connectLocalBroadcastEvent(RegisterWaypoint, ({waypoint, routeIndex, index}) => {
      if (routeIndex === this.props.routeIndex) {
        this.waypoints[index] = waypoint.position.get();
      }
    });
    if (this.props.viewTrigger !== undefined && this.props.viewTrigger !== null) {
      this.connectCodeBlockEvent(this.props.viewTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
        this.lookAtPlayer = player;
      });
      this.connectCodeBlockEvent(this.props.viewTrigger, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
        this.lookAtPlayer = undefined;
      });
    }

  }


  start() {
    super.start();
    this.async.setTimeout(() => {
      if (this.waypoints.length === 1) {
        console.warn("No waypoints found for NPCAndroid: " + this.entity.name.get());
      } else {
        this.idleTimer = this.getIdleTime();
        this.pathUpdate = this.checkWaypointArrival;
      }
    }, 1000);
  }

  update(deltaTime: number) {

    if (this.waypoints.length > 0 && this.waypoints[1] !== undefined) {
      this.pathUpdate(deltaTime);
    }
    if (this.lookAtPlayer !== undefined) {
      this.lookAt = this.lookAtPlayer.head.position.get();
    }
    super.update(deltaTime);
  }

  checkWaypointArrival(deltaTime: number){
    const navMeshAgent = this.entity.as(NavMeshAgent);
    if (navMeshAgent !== undefined && navMeshAgent !== null) {
      if (navMeshAgent.remainingDistance.get() < 0.1 && navMeshAgent.currentVelocity.get().magnitude() < 0.1) {
        this.lookAt = undefined;
        navMeshAgent.destination.set(null);
        this.pathUpdate = this.idleAtWaypoint;
      }
    }
  }

  idleAtWaypoint(deltaTime: number){
    this.idleTimer -= deltaTime;
    if (this.idleTimer <= 0) {
      this.idleTimer = this.getIdleTime();
      this.pathUpdate = this.lookAtNextWaypoint
      this.setNextWaypoint();
      this.async.setTimeout(()=> {
        this.pathUpdate = this.checkWaypointArrival;
      }, 600);
    }
  }

  lookAtNextWaypoint(deltaTime: number) {

  }

  setNextWaypoint() {
    this.targetWaypoint = (this.targetWaypoint + 1) % this.waypoints.length;
    if (this.waypoints[this.targetWaypoint] !== undefined) {

      const navMeshAgent = this.entity.as(NavMeshAgent);
      if (navMeshAgent !== undefined && navMeshAgent !== null) {
        navMeshAgent.destination.set(this.waypoints[this.targetWaypoint]);
      }
    } else {
      console.warn("Could not find waypoint for NPCAndroid: " + this.entity.name.get() + " at index: " + this.targetWaypoint);
    }
  }

  getIdleTime(){
    return this.props.minIdleTime + Math.random()*(this.props.maxIdleTime - this.props.minIdleTime);
  }

}
hz.Component.register(NPCAndroid);
