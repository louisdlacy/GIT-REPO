import {
	Image,
	ImageSource,
	Pressable,
	Text,
	UIComponent,
	UINode,
	View,
} from "horizon/ui";
import * as hz from "horizon/core";
type Item = {
	id: number;
	image: hz.Asset;
	price: number;
	entity: hz.Entity;
};
class StoreCUI extends UIComponent<typeof StoreCUI> {
	protected panelHeight: number = 400;
	protected panelWidth: number = 860;

	static propsDefinition = {
		item1Price: { type: hz.PropTypes.Number, default: 10 }, //can change on Properties panel
		item2Price: { type: hz.PropTypes.Number, default: 20 }, //can change on Properties panel
		item3Price: { type: hz.PropTypes.Number, default: 30 }, //can change on Properties panel
		item1: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
		item2: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
		item3: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
	};
	private image1 = new hz.Asset(BigInt(1446484563346865)); //200x200
	private image2 = new hz.Asset(BigInt(1285034479867638)); //200x200
	private image3 = new hz.Asset(BigInt(752942800709672)); //200x200

	private items: Array<Item> = [];

	initializeUI(): UINode {
		// Return a UINode to specify the contents of your UI.
		// For more details and examples go to:
		// https://developers.meta.com/horizon-worlds/learn/documentation/typescript/api-references-and-examples/custom-ui
		this.items = [
			{
				id: 1,
				image: this.image1,
				price: this.props.item1Price,
				entity: this.props.item1!,
			},
			{
				id: 2,
				image: this.image2,
				price: this.props.item2Price,
				entity: this.props.item2!,
			},
			{
				id: 3,
				image: this.image3,
				price: this.props.item3Price,
				entity: this.props.item3!,
			},
		];

		return View({
			children: this.items.map((item, i) =>
				View({
					children: [
						Image({
							source: ImageSource.fromTextureAsset(item.image),
							style: {
								width: 200,
								height: 200,
								borderColor: "#e9da12ff",
								borderWidth: 3,
							},
						}),
						Pressable({
							children: [
								Text({
									text: `Buy $${item.price} `,
									style: {
										fontSize: 40,
										fontWeight: "bold",
										color: "#0e0c0cff",
										alignSelf: "center",
										justifyContent: "center",
									},
								}),
							],
							onPress: (player: hz.Player) => {
								this.purchaseItem(player, i);
								player.unfocusUI();
								player.velocity.set(new hz.Vec3(0, 6, 0));
							},
							style: {
								backgroundColor: "#00ff80ff",
								borderRadius: 16,
								width: 200,
								height: 60,
								borderColor: "#000000ff",
								borderWidth: 4,
								marginTop: 10,
							},
						}),
					],
					style: {
						padding: 10,
						margin: 30,
					},
				})
			),
			style: {
				flexDirection: "row",
				gradientAngle: "40deg",
				gradientColorA: "#f700ffff",
				gradientColorB: "#16efffff",
				gradientXa: 0.3,
				gradientXb: 0.8,
				height: this.panelHeight,
				width: this.panelWidth,
			},
		});
	}
	purchaseItem(player: hz.Player, index: number) {
		//get PPV value and store as playerMoney for use on line 121/126
		const playerMoney = this.world.persistentStorage.getPlayerVariable(
			player,
			"EconomyPPVS:Money"
		);
		//use index to pull info from items array
		const cost = this.items[index].price;
		// Check if the player has enough money to purchase the item
		if (playerMoney >= cost) {
			//Update PPV value minus Cost
			this.world.persistentStorage.setPlayerVariable(
				player,
				"EconomyPPVS:Money",
				playerMoney - cost
			);
			this.world.leaderboards.setScoreForPlayer(
				"HighestMoney",
				player,
				playerMoney - cost,
				true
			);
			const itemEntity = this.items[index].entity;
			//Force grab purchased item to player hand
			itemEntity
				.as(hz.GrabbableEntity)
				.forceHold(player, hz.Handedness.Right, true);
		} else {
			this.world.ui.showPopupForPlayer(player, "Find More Money", 3, {
				position: new hz.Vec3(0, 0.3, 0),
			});
		}
	}
}

UIComponent.register(StoreCUI);
