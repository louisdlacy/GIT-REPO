import * as hz from "horizon/core";

// Script by MikeyAce and king_of_Miami

// PPV and Leaderboard variable names
const NEW_WORLD_POINTS = "NewGroupAug:Points"; // Replace with your "group variable name:ppv name". Example: "Bootcamp Testing:Points"
const NEW_WORLD_LEADERBOARD_NAME = "PointsLeaderboard"; // Replace with your leaderboard name. Example: "PointLeaderboard"

class TriggerPoints extends hz.Component<typeof TriggerPoints> {
	static propsDefinition = {
		//Public variables (edit these in the properties panel in the Desktop Editor)
		sfx: { type: hz.PropTypes.Entity },
		vfx: { type: hz.PropTypes.Entity },
		textGizmo: { type: hz.PropTypes.Entity },
	};

	//Called first before start() when world is started (use this for listening/initializing scripts)
	override preStart(): void {
		this.connectCodeBlockEvent(
			this.entity,
			hz.CodeBlockEvents.OnPlayerEnterTrigger,
			(player) => {
				this.onPlayerEnterTrigger(player);
			}
		);
	}

	// Called automatically when world starts but after preStart()
	start() {}

	// method called when player enters the trigger
	onPlayerEnterTrigger(player: hz.Player) {
		// play sound effects and visual effects
		this.props.sfx?.as(hz.AudioGizmo).play();
		this.props.vfx?.as(hz.ParticleGizmo).play();
		// use console.log to send messages to your console in Desktop Editor
		console.log("Player entered trigger:", player);
		// set PPV score for the individual player that entered the trigger
		// PPV (player persistent variable) is a variable that persists across sessions
		this.world.persistentStorage.setPlayerVariable(
			player,
			NEW_WORLD_POINTS,
			// We get the current PPV score and we add 1 to it
			this.world.persistentStorage.getPlayerVariable(player, NEW_WORLD_POINTS) +
				1.0
		);
		const newTotal =
			this.world.persistentStorage.getPlayerVariable(player, NEW_WORLD_POINTS) +
			1.0;
		this.props.textGizmo?.as(hz.TextGizmo).text.set(`Points: ${newTotal}`);
		// update leaderboard with player's new PPV score
		this.world.leaderboards.setScoreForPlayer(
			NEW_WORLD_LEADERBOARD_NAME,
			player,
			this.world.persistentStorage.getPlayerVariable(player, NEW_WORLD_POINTS),
			false
		);
	}
}

hz.Component.register(TriggerPoints);
