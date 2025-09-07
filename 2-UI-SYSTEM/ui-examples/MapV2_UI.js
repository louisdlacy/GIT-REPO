"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const MapUI_Library_1 = require("MapUI_Library");
/**
 * THIS SYSTEM WAS MADE BY MKE_THEGURU FOR THE MHCP 'MENTOR MINI-BUILD' SERIES
 *
 * FEEL FREE TO MAKE THIS YOUR OWN, DISSECT, OPERATE ON, OR OTHERWISE USE THIS ASSET FOR YOUR OWN PURPOSES
 *
 * THE GOAL OF THIS ASSET IS TO HAVE AN EASY-TO-USE SCALABLE MECHANIC FOR NAVIGATING WORLDS AND/OR DISPLAYING PLAYERS LOCATIONS IN THE WORLD
 * THIS ASSET WAS DESIGNED TO BE MINIMUM VIABLE PRODUCT, WITH A LITTLE EXTRA ON TOP. THINK OF IT AS A STARTING POINT!
 *
 * IF YOU HAVE QUESTIONS/COMMENTS/OTHERWISE IN REGARDS TO THIS ASSET, FEEL FREE TO POST A QUESTION TO THE MHCP DISCORD CHANNEL OR COMMUNITY FORUMS AND TAG @MKE_THEGURU
**/
class MapV2_UI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelWidth = 1024;
        this.panelHeight = 1024;
        this.mapPanelSize = this.panelWidth * 0.75;
        this.bannerHeight = (this.panelHeight - this.mapPanelSize) / 2;
        this.worldBounds = { x: 32, y: 32 };
        this.rapidSpawn = [];
        this.isTravelMap = new ui_1.Binding(true);
        this.worldPlayersData = new ui_1.Binding([]);
    }
    initializeUI() {
        this.rapidSpawn = this.world.getEntitiesWithTags([MapUI_Library_1.spawnTag]);
        const bannerStyle = {
            width: this.mapPanelSize,
            height: this.bannerHeight,
            backgroundColor: MapUI_Library_1.mapColors.pinSecondary,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center"
        };
        return (0, ui_1.View)({
            style: {
                width: this.panelWidth,
                height: this.panelHeight,
                backgroundColor: MapUI_Library_1.mapColors.mainPanel,
                justifyContent: "center",
                alignItems: "center",
            },
            children: [
                (0, ui_1.View)({
                    style: bannerStyle,
                    children: [
                        this.makeButton('Travel', (player) => { this.handleTravelClick(player); }),
                        this.makeButton('Players', (player) => { this.handlePeopleClick(player); }),
                    ]
                }),
                ui_1.UINode.if(this.isTravelMap, this.makeSpawnMap(), this.makePlayerMap()), //MAIN WINDOW OF THE MAP. WILL BE EITHER TRAVEL OR PLAYER DISPLAY MAP
                (0, ui_1.View)({
                    style: bannerStyle,
                    children: [
                        this.makeButton('Refresh', (player) => { this.handleRefreshClick(player); }),
                    ]
                }),
            ]
        });
    }
    makeSpawnMap() {
        return (0, ui_1.View)({
            style: {
                height: this.mapPanelSize,
                aspectRatio: 1,
                backgroundColor: MapUI_Library_1.mapColors.travelMapWindow,
            },
            children: this.mapTravelPoints()
        });
    }
    mapTravelPoints() {
        const travelPoints = [];
        this.rapidSpawn.forEach((spawn) => {
            const nametag = spawn.tags.get()[1];
            const label = nametag ? nametag : 'DEFAULT';
            const spawnPos = spawn.position.get();
            if (this.pointIsInRange(spawnPos)) {
                travelPoints.push(this.makePin(MapUI_Library_1.MapTypes.TRAVEL, spawnPos, label, spawn));
            }
        });
        return travelPoints;
    }
    makePlayerMap() {
        this.updatePlayerMap();
        return (0, ui_1.DynamicList)({
            data: this.worldPlayersData, renderItem: (playerData, index) => {
                const playerPos = playerData.position;
                return this.makePin(MapUI_Library_1.MapTypes.PLAYER, playerData.position, playerData.name);
            },
            style: {
                height: this.mapPanelSize,
                aspectRatio: 1,
                backgroundColor: MapUI_Library_1.mapColors.playerMapWindow,
            },
        });
    }
    mapPlayers() {
        const playerPins = [];
        const worldPlayersData = this.world.getPlayers();
        worldPlayersData.forEach((player) => {
            const playerPos = player.position.get();
            if (this.pointIsInRange(playerPos)) {
                playerPins.push(this.makePin(MapUI_Library_1.MapTypes.PLAYER, playerPos, player.name.get()));
            }
        });
        return playerPins;
    }
    makePin(type, worldCoordinate, label, respawnRef) {
        const mapPos = this.worldToMapPoint(worldCoordinate);
        const labelOffset = mapPos.y > this.mapPanelSize / 2 ? '75%' : '-75%';
        const pinStyle = {
            height: 50,
            aspectRatio: 1,
            backgroundColor: MapUI_Library_1.mapColors.pinPrimary,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: mapPos.x - 25,
            top: mapPos.y - 25,
        };
        const pinLabel = (0, ui_1.Text)({
            text: label.toUpperCase(),
            style: {
                height: '50%',
                aspectRatio: 4,
                backgroundColor: MapUI_Library_1.mapColors.pinSecondary,
                bottom: labelOffset,
                ...MapUI_Library_1.pinLabelTextFormatting
            }
        });
        if (type === MapUI_Library_1.MapTypes.TRAVEL) {
            return (0, ui_1.Pressable)({
                style: pinStyle,
                children: [pinLabel],
                onClick: (player) => {
                    if (respawnRef) {
                        respawnRef.as(core_1.SpawnPointGizmo).teleportPlayer(player);
                    }
                }
            });
        }
        else {
            return (0, ui_1.View)({
                style: pinStyle,
                children: [pinLabel]
            });
        }
    }
    makeButton(label, callback) {
        return (0, ui_1.Pressable)({
            style: {
                height: this.bannerHeight * 0.9,
                aspectRatio: 3,
                backgroundColor: MapUI_Library_1.mapColors.utilityButtons
            },
            children: [
                (0, ui_1.Text)({
                    text: label.toUpperCase(),
                    style: {
                        height: '100%',
                        aspectRatio: 3,
                        fontSize: 50,
                        fontFamily: 'Roboto-Mono',
                        fontWeight: "bold",
                        textAlign: "center",
                        textAlignVertical: "center"
                    }
                })
            ],
            onClick: callback
        });
    }
    handleTravelClick(player) {
        //console.log(`${player.name.get()} selected travel`);
        this.isTravelMap.set(true, [player]);
    }
    handlePeopleClick(player) {
        //console.log(`${player.name.get()} selected people`);
        this.isTravelMap.set(false, [player]);
    }
    handleRefreshClick(player) {
        //console.log(`${player.name.get()} selected refresh`);
        this.updatePlayerMap();
    }
    worldToMapPoint(worldCoord) {
        // STEP 1) Figure out the center of the map.
        // If you gave the map a special "center" object, use its position.
        // Otherwise, use (0, 0, 0) as the center.
        const worldCenter = this.props.mapCenter ? this.props.mapCenter.position.get() : core_1.Vec3.zero;
        // STEP 2) Find out how far this point is from the center, in X and Z.
        // This gives us a position relative to the center, not the whole world.
        // We use X for left/right and Z for up/down on the map.
        const vec2 = {
            x: worldCoord.x - worldCenter.x,
            y: worldCoord.z - worldCenter.z
        };
        // STEP 3) Turn those distances into a percentage (0 to 1) of the map's total size.
        // This is called "normalizing"—it lets us fit any world position onto our map panel.
        const minX = -this.worldBounds.x;
        const maxX = this.worldBounds.x;
        const minY = -this.worldBounds.y;
        const maxY = this.worldBounds.y;
        const mapX = (vec2.x - minX) / (maxX - minX); // 0 = far left, 1 = far right
        const mapY = (vec2.y - minY) / (maxY - minY); // 0 = bottom, 1 = top
        // STEP 4) Flip the Y value so the top of the world is at the top of the map.
        // Multiply by the map panel size to get the actual pixel position.
        const panelX = mapX * this.mapPanelSize;
        const panelY = (1 - mapY) * this.mapPanelSize;
        // STEP 5: Return the final position for the pin on the map
        return { x: panelX, y: panelY };
    }
    pointIsInRange(position) {
        const worldCenter = this.props.mapCenter ? this.props.mapCenter.position.get() : core_1.Vec3.zero;
        const boundsX = worldCenter.x + this.worldBounds.x;
        const boundsY = worldCenter.y + this.worldBounds.y;
        const inBoundsX = position.x <= boundsX && position.x >= boundsX * -1;
        const inBoundsY = position.y <= boundsY && position.y >= boundsY * -1;
        return inBoundsX && inBoundsY;
    }
    getWorldPlayersData() {
        return this.world.getPlayers().map((player) => ({
            name: player.name.get(),
            position: player.position.get()
        }));
    }
    updatePlayerMap() {
        this.worldPlayersData.set(this.getWorldPlayersData());
    }
    start() { }
}
MapV2_UI.propsDefinition = {
    mapCenter: { type: core_1.PropTypes.Entity },
    worldBoundsX: { type: core_1.PropTypes.Number, default: 32 },
    worldBoundsY: { type: core_1.PropTypes.Number, default: 32 },
};
ui_1.UIComponent.register(MapV2_UI);
