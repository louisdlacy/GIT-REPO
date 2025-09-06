import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";
import { playerDataMap } from "PlayerData_Data";
import { playerData_Func } from "PlayerData_Func";
import { playerStats_Func } from "PlayerStats_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


class PlayerData_Entity extends Component<typeof PlayerData_Entity> {
  static propsDefinition = {
    variableGroupName: { type: PropTypes.String, default: 'PlayerDataClass' },
    playerStatsPPVVariableName: { type: PropTypes.String, default: 'PlayerStats' },
    positionUpdateFrequencyMs: { type: PropTypes.Number, default: 100 },
  };


  preStart() {
    worldVariableNames.jsonPPVs.playerStats = this.props.variableGroupName + ':' + this.props.playerStatsPPVVariableName;

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
  
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterAFK, (player) => { this.playerEnterAFK(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitAFK, (player) => { this.playerExitAFK(player); });
  }

  start() {
    this.async.setInterval(() => { playerData_Func.updateTimeSpent(); }, 60_000);

    this.async.setInterval(() => {
      playerData_Func.updatePlayerPositions();

      //#EXAMPLE USE
      //update Player Statuses
      //Check & Update Game State
    }, this.props.positionUpdateFrequencyMs);
  }

  playerEnterWorld(player: Player) {
    const playerData = playerData_Func.createEmptyPlayerData(player);

    playerDataMap.set(player, playerData);

    playerStats_Func.updatePPVAndLeaderboards(player);
  }

  playerExitWorld(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      this.world.persistentStorage.setPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats, playerData.stats);
    }

    playerDataMap.delete(player);
  }

  playerEnterAFK(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      playerData.isAFK = true;
      playerData.enteredAFKAt = Date.now();
    }
  }

  playerExitAFK(player: Player) {
    const playerData = playerDataMap.get(player);

    if (playerData) {
      playerData.isAFK = false;
      playerData.enteredAFKAt = 0;
    }
  }
}
Component.register(PlayerData_Entity);