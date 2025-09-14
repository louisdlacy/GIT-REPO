import { Component, PropTypes, Player, NetworkEvent } from 'horizon/core';

/**
 * Defines the data structure for a team.
 */
export interface Team {
  id: string;
  name: string;
  score: number;
}

/**
 * Network event broadcasted when a team's score changes.
 */
export const OnTeamScoreChanged = new NetworkEvent<{ teamId: string, newScore: number }>('OnTeamScoreChanged');

/**
 * TeamManager
 * Manages team creation, player assignments, and scoring.
 */
class TeamManager extends Component<typeof TeamManager> {
  static propsDefinition = {
    /**
     * A comma-separated list of names for the teams to be initialized.
     * For example: "Red,Blue,Green"
     */
    teamNamesCSV: { type: PropTypes.String, default: 'Red,Blue' },
  };

  private teams: Map<string, Team> = new Map();
  private playerTeams: Map<number, string> = new Map(); // Map<PlayerID, TeamID>

  override start() {
    this.initializeTeams();
    console.log("TeamManager started and initialized teams.");
  }

  /**
   * Parses the teamNamesCSV prop and initializes the teams map.
   */
  private initializeTeams(): void {
    const teamNames = this.props.teamNamesCSV.split(',').map(name => name.trim()).filter(name => name);
    teamNames.forEach(name => {
      const teamId = name.toLowerCase(); // Use lowercase name as a simple ID
      if (!this.teams.has(teamId)) {
        this.teams.set(teamId, {
          id: teamId,
          name: name,
          score: 0,
        });
        console.log(`Initialized team: ${name} (ID: ${teamId})`);
      }
    });
  }

  /**
   * Assigns a player to a specific team.
   * @param player The player to assign.
   * @param teamId The ID of the team to join.
   */
  public addPlayerToTeam(player: Player, teamId: string): void {
    if (!this.teams.has(teamId)) {
      console.warn(`TeamManager: Attempted to add player ${player.name.get()} to non-existent team '${teamId}'.`);
      return;
    }
    this.playerTeams.set(player.id, teamId);
    console.log(`Player ${player.name.get()} has been added to team '${this.teams.get(teamId)?.name}'.`);
  }

  /**
   * Removes a player from their current team.
   * @param player The player to remove.
   */
  public removePlayerFromTeam(player: Player): void {
    if (this.playerTeams.has(player.id)) {
      const teamId = this.playerTeams.get(player.id)!;
      this.playerTeams.delete(player.id);
      console.log(`Player ${player.name.get()} has been removed from team '${this.teams.get(teamId)?.name}'.`);
    }
  }

  /**
   * Retrieves the team data for a given player.
   * @param player The player whose team to find.
   * @returns The Team object or undefined if the player is not on a team.
   */
  public getPlayerTeam(player: Player): Team | undefined {
    const teamId = this.playerTeams.get(player.id);
    return teamId ? this.teams.get(teamId) : undefined;
  }

  /**
   * Adds a specified amount to a team's score and broadcasts the change.
   * @param teamId The ID of the team to update.
   * @param amount The number of points to add.
   */
  public addScoreToTeam(teamId: string, amount: number): void {
    const team = this.teams.get(teamId);
    if (team) {
      team.score += amount;
      console.log(`Score added to team '${team.name}'. New score: ${team.score}`);
      this.sendNetworkBroadcastEvent(OnTeamScoreChanged, {
        teamId: team.id,
        newScore: team.score,
      });
    } else {
      console.warn(`TeamManager: Attempted to add score to non-existent team '${teamId}'.`);
    }
  }
}

Component.register(TeamManager);