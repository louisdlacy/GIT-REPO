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
const NPCAgent_1 = require("NPCAgent");
const NPCAndroidWaypoint_1 = require("NPCAndroidWaypoint");
const hz = __importStar(require("horizon/core"));
const navmesh_1 = require("horizon/navmesh");
class NPCAndroid extends NPCAgent_1.NPCAgent {
    constructor() {
        super(...arguments);
        this.waypoints = [];
        this.targetWaypoint = 0;
        this.pathUpdate = () => { };
        this.idleTimer = 0;
        this.lookAtPlayer = undefined;
    }
    preStart() {
        this.targetWaypoint = this.props.startingIndex;
        this.connectLocalBroadcastEvent(NPCAndroidWaypoint_1.RegisterWaypoint, ({ waypoint, routeIndex, index }) => {
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
            }
            else {
                this.idleTimer = this.getIdleTime();
                this.pathUpdate = this.checkWaypointArrival;
            }
        }, 1000);
    }
    update(deltaTime) {
        if (this.waypoints.length > 0 && this.waypoints[1] !== undefined) {
            this.pathUpdate(deltaTime);
        }
        if (this.lookAtPlayer !== undefined) {
            this.lookAt = this.lookAtPlayer.head.position.get();
        }
        super.update(deltaTime);
    }
    checkWaypointArrival(deltaTime) {
        const navMeshAgent = this.entity.as(navmesh_1.NavMeshAgent);
        if (navMeshAgent !== undefined && navMeshAgent !== null) {
            if (navMeshAgent.remainingDistance.get() < 0.1 && navMeshAgent.currentVelocity.get().magnitude() < 0.1) {
                this.lookAt = undefined;
                navMeshAgent.destination.set(null);
                this.pathUpdate = this.idleAtWaypoint;
            }
        }
    }
    idleAtWaypoint(deltaTime) {
        this.idleTimer -= deltaTime;
        if (this.idleTimer <= 0) {
            this.idleTimer = this.getIdleTime();
            this.pathUpdate = this.lookAtNextWaypoint;
            this.setNextWaypoint();
            this.async.setTimeout(() => {
                this.pathUpdate = this.checkWaypointArrival;
            }, 600);
        }
    }
    lookAtNextWaypoint(deltaTime) {
    }
    setNextWaypoint() {
        this.targetWaypoint = (this.targetWaypoint + 1) % this.waypoints.length;
        if (this.waypoints[this.targetWaypoint] !== undefined) {
            const navMeshAgent = this.entity.as(navmesh_1.NavMeshAgent);
            if (navMeshAgent !== undefined && navMeshAgent !== null) {
                navMeshAgent.destination.set(this.waypoints[this.targetWaypoint]);
            }
        }
        else {
            console.warn("Could not find waypoint for NPCAndroid: " + this.entity.name.get() + " at index: " + this.targetWaypoint);
        }
    }
    getIdleTime() {
        return this.props.minIdleTime + Math.random() * (this.props.maxIdleTime - this.props.minIdleTime);
    }
}
NPCAndroid.propsDefinition = {
    ...NPCAgent_1.NPCAgent.propsDefinition,
    routeIndex: { type: hz.PropTypes.Number, default: 0 },
    minIdleTime: { type: hz.PropTypes.Number, default: 1 },
    maxIdleTime: { type: hz.PropTypes.Number, default: 3 },
    startingIndex: { type: hz.PropTypes.Number, default: 0 },
    viewTrigger: { type: hz.PropTypes.Entity },
};
NPCAndroid.dummy = 0;
hz.Component.register(NPCAndroid);
