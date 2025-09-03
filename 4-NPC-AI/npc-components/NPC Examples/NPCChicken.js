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
const navmesh_1 = require("horizon/navmesh");
const NPCAgent_1 = require("NPCAgent");
const ab = __importStar(require("horizon/unity_asset_bundles"));
class NPCChicken extends NPCAgent_1.NPCAgent {
    constructor() {
        super(...arguments);
        this.newDestinationTimer = 0;
        this.isIdling = false;
        this.destinationAttempts = 0;
    }
    start() {
        super.start();
        if (this.props.navMeshVolume !== undefined) {
            const navMeshVolume = this.props.navMeshVolume;
            const bbScale = navMeshVolume.scale.get().mul(0.5);
            const bbPosition = navMeshVolume.position.get();
            this.boundingBox = { min: bbPosition.add(new hz.Vec3(-bbScale.x, 0, -bbScale.z)), max: bbPosition.add(new hz.Vec3(bbScale.x, 0, bbScale.z)) };
        }
        this.newDestinationTimer = this.getNewDestinationDelay();
        this.findNewDestination();
    }
    update(deltaTime) {
        super.update(deltaTime);
        if (this.navMeshAgent !== undefined) {
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
    randomIdle() {
        this.isIdling = true;
        this.entity.as(ab.AssetBundleGizmo)?.getRoot().setAnimationParameterFloat("Random", Math.random());
    }
    setNewDestination(destination) {
        this.isIdling = false;
        this.lookAt = destination;
        this.async.setTimeout(() => {
            this.entity.as(navmesh_1.NavMeshAgent)?.destination.set(destination);
        }, 300);
    }
    findNewDestination() {
        this.destinationAttempts++;
        const rPosition = this.getRandomDestination();
        const delta = rPosition.sub(this.getHeadPosition());
        const dotFwd = hz.Vec3.dot(this.entity.forward.get(), delta);
        if (delta.magnitude() > 4 || (dotFwd < 0.1 && this.destinationAttempts < 5)) {
            this.async.setTimeout(() => {
                this.findNewDestination();
            }, 200);
        }
        else {
            this.destinationAttempts = 0;
            this.setNewDestination(rPosition);
        }
    }
    getRandomDestination() {
        const rx = Math.random() * (this.boundingBox.max.x - this.boundingBox.min.x) + this.boundingBox.min.x;
        const rz = Math.random() * (this.boundingBox.max.z - this.boundingBox.min.z) + this.boundingBox.min.z;
        return new hz.Vec3(rx, 0, rz);
    }
    getHeadPosition() {
        const headPosition = this.entity.position.get();
        headPosition.y += this.props.headHeight;
        return headPosition;
    }
    getNewDestinationDelay() {
        return Math.random() * (this.props.maxIdle - this.props.minIdle) + this.props.minIdle;
    }
}
NPCChicken.propsDefinition = {
    ...NPCAgent_1.NPCAgent.propsDefinition,
    navMeshVolume: { type: hz.PropTypes.Entity },
    minIdle: { type: hz.PropTypes.Number, default: 1 },
    maxIdle: { type: hz.PropTypes.Number, default: 2 },
};
NPCChicken.dummy = 0;
hz.Component.register(NPCChicken);
