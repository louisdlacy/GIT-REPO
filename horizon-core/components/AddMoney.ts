import * as hz from "horizon/core";

class AddMoney extends hz.Component<typeof AddMoney> {
	static propsDefinition = {
		amount: { type: hz.PropTypes.Number, default: 1 },
		text: { type: hz.PropTypes.Entity },
	};

	start() {
		this.connectCodeBlockEvent(
			this.entity,
			hz.CodeBlockEvents.OnPlayerEnterTrigger,
			(player: hz.Player) => {
				const currentMoney = this.world.persistentStorage.getPlayerVariable(
					player,
					"EconomyPPVS:Money"
				);
				const newAmount = currentMoney + this.props.amount;
				this.world.persistentStorage.setPlayerVariable(
					player,
					"EconomyPPVS:Money",
					newAmount
				);
				this.props.text!.as(hz.TextGizmo).text.set(`$${newAmount}`);
				this.world.leaderboards.setScoreForPlayer(
					"HighestMoney",
					player,
					newAmount,
					true
				);
			}
		);
	}
}
hz.Component.register(AddMoney);
