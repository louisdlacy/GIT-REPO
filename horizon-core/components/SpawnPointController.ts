import { Component, PropTypes } from 'horizon/core';

/**
 * SpawnPointController
 * A data component attached to spawn point entities to associate them with a team.
 * This script holds the teamId, which is read by a central SpawnManager.
 */
class SpawnPointController extends Component<typeof SpawnPointController> {
  static propsDefinition = {
    // The ID of the team this spawn point belongs to.
    // Can be "Red", "Blue", or empty/ "all" for free-for-all.
    teamId: { type: PropTypes.String, default: 'all' },
  };

  /**
   * The start method is not needed for this component's logic as it only holds data.
   * A log is included for debugging to confirm the script has initialized.
   */
  override start() {
    console.log(`SpawnPointController initialized for team: '${this.props.teamId}' on entity ${this.entity.name.get()}`);
  }
}

Component.register(SpawnPointController);