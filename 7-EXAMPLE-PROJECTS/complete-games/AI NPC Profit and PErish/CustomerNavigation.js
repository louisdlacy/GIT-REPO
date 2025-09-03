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
exports.CustomerNavigation = void 0;
const BaseNavigationComponent_1 = require("BaseNavigationComponent");
const Events_1 = require("Events");
const GC = __importStar(require("GameConsts"));
const hz = __importStar(require("horizon/core"));
const INTERVAL_NAVIGATION_TIME = 0.5;
/**
 * CustomerNavigation class extends BaseNavigationComponent to provide navigation functionality
 * for a customer entity, including properties and methods for navigation speed and event handling.
 */
class CustomerNavigation extends BaseNavigationComponent_1.BaseNavigationComponent {
    /**
     * Initializes the CustomerNavigation component and sets up event listeners.
     */
    start() {
        super.start();
        this.connectLocalEvent(this.entity, Events_1.Events.navigateToTarget, (data) => {
            this.navigateToPlayer(data.target);
        });
    }
    /**
     * Navigates the entity to the specified player.
     *
     * @param player - The player to navigate to.
     */
    navigateToPlayer(player) {
        this.stopNavigation();
        let specs = customerNavigationSpecs(this.props.navigationSpeed);
        specs.target = player;
        specs.timeout = GC.DEFAULT_NAV_TIME;
        specs.lockOnTargetTimeout = GC.DEFAULT_NAV_TIME;
        specs.speed = this.props.navigationSpeed;
        specs.callback = () => { this.startNavigation(); };
        this.log(`CustomerNavigation: navigating to player ${player.name.get()}`, GC.CONSOLE_LOG_NAVIGATION);
        this.navigateToTarget(specs);
    }
    /**
     * Resumes navigation from the current position.
     */
    resumeNavigation() {
        this.startNavigation();
    }
    /**
     * Starts navigation towards the next waypoint.
     */
    startNavigation() {
        let nextWaypoint = this.getNextWayPoint();
        let specs = customerNavigationSpecs(this.props.navigationSpeed);
        specs.target = nextWaypoint;
        specs.lockOnTargetTimeout = 3;
        specs.callback = () => { this.startNavigation(); };
        this.navigateToTarget(specs);
    }
    /**
     * Calculates and returns the next waypoint for navigation.
     *
     * @returns A new Vec3 object representing the next waypoint.
     */
    getNextWayPoint() {
        let range = 15;
        let xPos = Math.random() * range - range / 2;
        let zPos = Math.random() * range - range / 2;
        return new hz.Vec3(xPos, 0, zPos);
    }
}
exports.CustomerNavigation = CustomerNavigation;
CustomerNavigation.propsDefinition = {
    ...BaseNavigationComponent_1.BaseNavigationComponent.propsDefinition,
    navigationSpeed: { type: hz.PropTypes.Number, default: 1 }
};
hz.Component.register(CustomerNavigation);
/**
 * Generates navigation specifications based on the given speed.
 *
 * @param navigationSpeed - The speed for navigation.
 * @returns An object containing navigation specifications.
 */
function customerNavigationSpecs(navigationSpeed = 1) {
    let specs = {
        intervalTime: INTERVAL_NAVIGATION_TIME,
        timeout: 9999,
        target: hz.Vec3.zero,
        speed: navigationSpeed,
        stoppingDistance: 0,
        lockOnTargetTimeout: 0,
        callback: () => { }
    };
    return specs;
}
