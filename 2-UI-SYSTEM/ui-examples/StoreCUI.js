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
const ui_1 = require("horizon/ui");
const hz = __importStar(require("horizon/core"));
class StoreCUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 400;
        this.panelWidth = 860;
        this.image1 = new hz.Asset(BigInt(1446484563346865)); //200x200
        this.image2 = new hz.Asset(BigInt(1285034479867638)); //200x200
        this.image3 = new hz.Asset(BigInt(752942800709672)); //200x200
        this.items = [];
    }
    initializeUI() {
        // Return a UINode to specify the contents of your UI.
        // For more details and examples go to:
        // https://developers.meta.com/horizon-worlds/learn/documentation/typescript/api-references-and-examples/custom-ui
        this.items = [
            {
                id: 1,
                image: this.image1,
                price: this.props.item1Price,
                entity: this.props.item1,
            },
            {
                id: 2,
                image: this.image2,
                price: this.props.item2Price,
                entity: this.props.item2,
            },
            {
                id: 3,
                image: this.image3,
                price: this.props.item3Price,
                entity: this.props.item3,
            },
        ];
        return (0, ui_1.View)({
            children: this.items.map((item, i) => (0, ui_1.View)({
                children: [
                    (0, ui_1.Image)({
                        source: ui_1.ImageSource.fromTextureAsset(item.image),
                        style: {
                            width: 200,
                            height: 200,
                            borderColor: "#e9da12ff",
                            borderWidth: 3,
                        },
                    }),
                    (0, ui_1.Pressable)({
                        children: [
                            (0, ui_1.Text)({
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
                        onPress: (player) => {
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
            })),
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
    purchaseItem(player, index) {
        //get PPV value and store as playerMoney for use on line 121/126
        const playerMoney = this.world.persistentStorage.getPlayerVariable(player, "EconomyPPVS:Money");
        //use index to pull info from items array
        const cost = this.items[index].price;
        // Check if the player has enough money to purchase the item
        if (playerMoney >= cost) {
            //Update PPV value minus Cost
            this.world.persistentStorage.setPlayerVariable(player, "EconomyPPVS:Money", playerMoney - cost);
            this.world.leaderboards.setScoreForPlayer("HighestMoney", player, playerMoney - cost, true);
            const itemEntity = this.items[index].entity;
            //Force grab purchased item to player hand
            itemEntity
                .as(hz.GrabbableEntity)
                .forceHold(player, hz.Handedness.Right, true);
        }
        else {
            this.world.ui.showPopupForPlayer(player, "Find More Money", 3, {
                position: new hz.Vec3(0, 0.3, 0),
            });
        }
    }
}
StoreCUI.propsDefinition = {
    item1Price: { type: hz.PropTypes.Number, default: 10 }, //can change on Properties panel
    item2Price: { type: hz.PropTypes.Number, default: 20 }, //can change on Properties panel
    item3Price: { type: hz.PropTypes.Number, default: 30 }, //can change on Properties panel
    item1: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
    item2: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
    item3: { type: hz.PropTypes.Entity }, //connect a grabbable configured entity
};
ui_1.UIComponent.register(StoreCUI);
