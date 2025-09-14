import * as hz from 'horizon/core';

class Teams extends hz.Component<typeof Teams> {
  static propsDefinition = {
    group1TeamATrigger: {
      type: hz.PropTypes.Entity
    },
    group1TeamAMemberlist: {
      type: hz.PropTypes.Entity
    },
    group1TeamBTrigger: {
      type: hz.PropTypes.Entity
    },
    group1TeamBMemberlist: {
      type: hz.PropTypes.Entity
    },
    group2TeamATrigger: {
      type: hz.PropTypes.Entity
    },
    group2TeamAMemberlist: {
      type: hz.PropTypes.Entity
    },
    group2TeamBTrigger: {
      type: hz.PropTypes.Entity
    },
    group2TeamBMemberlist: {
      type: hz.PropTypes.Entity
    }
  };

  preStart(): void {
    if (this.props.group1TeamATrigger) {
      this.connectCodeBlockEvent(this.props.group1TeamATrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => this.group1TeamATriggerEntered(enteredBy))
    } else {
      console.warn('group1TeamATrigger property is not set.');
    }

    if (this.props.group1TeamBTrigger) {
      this.connectCodeBlockEvent(this.props.group1TeamBTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => this.group1TeamBTriggerEntered(enteredBy))
    } else {
      console.warn('group1TeamBTrigger property is not set.');
    }

    if (this.props.group2TeamATrigger) {
      this.connectCodeBlockEvent(this.props.group2TeamATrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => this.group2TeamATriggerEntered(enteredBy))
    } else {
      console.warn('group2TeamATrigger property is not set.');
    }

    if (this.props.group2TeamBTrigger) {
      this.connectCodeBlockEvent(this.props.group2TeamBTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => this.group2TeamBTriggerEntered(enteredBy))
    } else {
      console.warn('group2TeamBTrigger property is not set.');
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerChangedTeam, (player: hz.Player, teamName: string, teamGroupName: string) => this.teamChanged(player, teamName, teamGroupName));
  }

  start() {
    this.world.team.createTeamGroup('Group 1');
    this.world.team.createTeamGroup('Group 2');
    this.world.team.createTeam('Team A', 'Group 1')
    this.world.team.createTeam('Team B', 'Group 1')
    this.world.team.createTeam('Team A', 'Group 2')
    this.world.team.createTeam('Team B', 'Group 2')
  }

  teamChanged(player: hz.Player, teamName: string, teamGroupName: string) {
    console.log(`Player ${player.name.get()} changed to team ${teamName} in group ${teamGroupName}`);
    this.displayMemberlist();
  }

  group1TeamATriggerEntered(enteredBy: hz.Player) {
    this.world.team.addPlayerToTeam(enteredBy, 'Team A', 'Group 1');
    console.log(`Player ${enteredBy.name.get()} was added to the group1TeamA team.`);
  }

  group1TeamBTriggerEntered(enteredBy: hz.Player) {
    this.world.team.addPlayerToTeam(enteredBy, 'Team B', 'Group 1');
    console.log(`Player ${enteredBy.name.get()} was added to the group1TeamB team.`);
  }

  group2TeamATriggerEntered(enteredBy: hz.Player) {
    this.world.team.addPlayerToTeam(enteredBy, 'Team A', 'Group 2');
    console.log(`Player ${enteredBy.name.get()} was added to the group2TeamA team.`);
  }

  group2TeamBTriggerEntered(enteredBy: hz.Player) {
    this.world.team.addPlayerToTeam(enteredBy, 'Team B', 'Group 2');
    console.log(`Player ${enteredBy.name.get()} was added to the group2TeamB team.`);
  }

  displayMemberlist() {
    const group1TeamBMemberlist = this.props.group1TeamBMemberlist;
    const group1TeamAMemberlist = this.props.group1TeamAMemberlist;
    const group2TeamAMemberlist = this.props.group2TeamAMemberlist;
    const group2TeamBMemberlist = this.props.group2TeamBMemberlist;

    if (group1TeamBMemberlist && group1TeamAMemberlist && group2TeamAMemberlist && group2TeamBMemberlist) {
      let group1TeamBPlayers: string = ''
      let group1TeamAPlayers: string = ''
      let group2TeamAPlayers: string = ''
      let group2TeamBPlayers: string = ''

      this.world.team.getTeamPlayers(this.world, 'Team B', 'Group 1').forEach(player => {
        group1TeamBPlayers += `${player.name.get()}<br> `;
      });
      this.world.team.getTeamPlayers(this.world, 'Team A', 'Group 1').forEach(player => {
        group1TeamAPlayers += `${player.name.get()}<br> `;
      });
      this.world.team.getTeamPlayers(this.world, 'Team A', 'Group 2').forEach(player => {
        group2TeamAPlayers += `${player.name.get()}<br> `;
      });
      this.world.team.getTeamPlayers(this.world, 'Team B', 'Group 2').forEach(player => {
        group2TeamBPlayers += `${player.name.get()}<br> `;
      });

      group1TeamBMemberlist.as(hz.TextGizmo).text.set(`${group1TeamBPlayers}`);
      group1TeamAMemberlist.as(hz.TextGizmo).text.set(`${group1TeamAPlayers}`);
      group2TeamAMemberlist.as(hz.TextGizmo).text.set(`${group2TeamAPlayers}`);
      group2TeamBMemberlist.as(hz.TextGizmo).text.set(`${group2TeamBPlayers}`);
    } else {
      console.warn('One or more memberlist properties are not set.');
    }
  }

}
hz.Component.register(Teams);