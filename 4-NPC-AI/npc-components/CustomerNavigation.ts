import { BaseNavigationComponent, NavigationSpecs } from 'BaseNavigationComponent';
import { Events } from 'Events';
import * as GC from 'GameConsts';
import * as hz from 'horizon/core';

const INTERVAL_NAVIGATION_TIME: number = 0.5;

/**
 * CustomerNavigation class extends BaseNavigationComponent to provide navigation functionality
 * for a customer entity, including properties and methods for navigation speed and event handling.
 */
export class CustomerNavigation extends BaseNavigationComponent<typeof CustomerNavigation> {
  static propsDefinition = {
    ...BaseNavigationComponent.propsDefinition,
    navigationSpeed: { type: hz.PropTypes.Number, default: 1 }
  };

  /**
   * Initializes the CustomerNavigation component and sets up event listeners.
   */
  start() {
    super.start();

    this.connectLocalEvent(this.entity, Events.navigateToTarget, (data) => {
      this.navigateToPlayer(data.target as hz.Player);
    });
  }

  /**
   * Navigates the entity to the specified player.
   *
   * @param player - The player to navigate to.
   */
  navigateToPlayer(player: hz.Player) {
    this.stopNavigation();
    let specs = customerNavigationSpecs(this.props.navigationSpeed);
    specs.target = player;
    specs.timeout = GC.DEFAULT_NAV_TIME;
    specs.lockOnTargetTimeout = GC.DEFAULT_NAV_TIME;
    specs.speed = this.props.navigationSpeed;
    specs.callback = () => { this.startNavigation() };
    this.log(`CustomerNavigation: navigating to player ${player.name.get()}`, GC.CONSOLE_LOG_NAVIGATION);
    this.navigateToTarget(specs);
  }

  /**
   * Resumes navigation from the current position.
   */
  resumeNavigation(): void {
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
    specs.callback = () => { this.startNavigation() };
    this.navigateToTarget(specs);
  }

  /**
   * Calculates and returns the next waypoint for navigation.
   *
   * @returns A new Vec3 object representing the next waypoint.
   */
  private getNextWayPoint() {
    let range = 15;
    let xPos = Math.random() * range - range / 2;
    let zPos = Math.random() * range - range / 2;
    return new hz.Vec3(xPos, 0, zPos);
  }
}
hz.Component.register(CustomerNavigation);

/**
 * Generates navigation specifications based on the given speed.
 *
 * @param navigationSpeed - The speed for navigation.
 * @returns An object containing navigation specifications.
 */
function customerNavigationSpecs(navigationSpeed: number = 1) {
  let specs: NavigationSpecs = {
    intervalTime: INTERVAL_NAVIGATION_TIME,
    timeout: 9999,
    target: hz.Vec3.zero,
    speed: navigationSpeed,
    stoppingDistance: 0,
    lockOnTargetTimeout: 0,
    callback: () => { }
  }
  return specs;
}
