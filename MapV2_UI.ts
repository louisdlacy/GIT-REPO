import { Entity, Player, PropTypes, Quaternion, SpawnPointGizmo, Vec3 } from "horizon/core";
import { Binding, Callback, DynamicList, Pressable, Text, UIComponent, UINode, View, ViewStyle } from "horizon/ui";
import { mapColors, MapTypes, pinLabelTextFormatting, PlayerPinData, spawnTag } from "MapUI_Library";


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


class MapV2_UI extends UIComponent<typeof MapV2_UI> {
  static propsDefinition = {
    mapCenter: { type: PropTypes.Entity },
    worldBoundsX: { type: PropTypes.Number, default: 32 },
    worldBoundsY: { type: PropTypes.Number, default: 32 },
  };

  protected panelWidth: number = 1024;
  protected panelHeight: number = 1024;
  private mapPanelSize: number = this.panelWidth * 0.75;
  private bannerHeight: number = (this.panelHeight - this.mapPanelSize) / 2;

  private worldBounds = { x: 32, y: 32 };
  private rapidSpawn: Entity[] = [];
  private isTravelMap: Binding<boolean> = new Binding<boolean>(true);
  private worldPlayersData: Binding<PlayerPinData[]> = new Binding<PlayerPinData[]>([]);

  initializeUI(): UINode {
    this.rapidSpawn = this.world.getEntitiesWithTags([spawnTag]);

    const bannerStyle: ViewStyle = {
      width: this.mapPanelSize,
      height: this.bannerHeight,
      backgroundColor: mapColors.pinSecondary,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center"
    };

    return View({ //MAIN WINDOW OF THE UI
      style: {
        width: this.panelWidth,
        height: this.panelHeight,
        backgroundColor: mapColors.mainPanel,
        justifyContent: "center",
        alignItems: "center",
      },
      children: [
        View({  //TOP CONTAINER FOR MAP_TYPES BUTTONS
          style: bannerStyle,
          children: [
            this.makeButton('Travel', (player) => { this.handleTravelClick(player); }),
            this.makeButton('Players', (player) => { this.handlePeopleClick(player); }),
          ]
        }),
        UINode.if(this.isTravelMap, this.makeSpawnMap(), this.makePlayerMap()), //MAIN WINDOW OF THE MAP. WILL BE EITHER TRAVEL OR PLAYER DISPLAY MAP
        View({  //BOTTOM CONTAINER FOR PLAYER MAP REFRESH BUTTON
          style: bannerStyle,
          children: [
            this.makeButton('Refresh', (player) => { this.handleRefreshClick(player); }),
          ]
        }),
      ]
    })
  }

  makeSpawnMap(): UINode {  //THIS WILL INITIALIZE THE TRAVEL MAP WITH PRESSABLE PINS FOR TRAVELING TO A DESTINATION
    return View({
      style: {
        height: this.mapPanelSize,
        aspectRatio: 1,
        backgroundColor: mapColors.travelMapWindow,
      },
      children: this.mapTravelPoints()
    });
  }

  mapTravelPoints(): UINode[] { //THIS RETURNS AN ARRAY OF PRESSABLE PINS MAPPED TO THE LOCATIONS OF EACH DESIGNATED SPAWN POINT IN THE WORLD
    const travelPoints: UINode[] = [];

    this.rapidSpawn.forEach((spawn) => {
      const nametag = spawn.tags.get()[1];
      const label = nametag ? nametag : 'DEFAULT';
      const spawnPos = spawn.position.get();

      if (this.pointIsInRange(spawnPos)) {
        travelPoints.push(this.makePin(MapTypes.TRAVEL, spawnPos, label, spawn));
      }
    })
    return travelPoints;
  }

  makePlayerMap(): UINode { //THIS WILL INITIALIZE THE PLAYER MAP WITH VIEW ONLY PINS FOR SEEING WHERE ALL PLAYERS/NPCS ARE LOCATED THROUGHOUT THE WORLD
    this.updatePlayerMap();

    return DynamicList({
      data: this.worldPlayersData, renderItem: (playerData: PlayerPinData, index?: number) => {
        const playerPos = playerData.position;
        return this.makePin(MapTypes.PLAYER, playerData.position, playerData.name);
      },
      style: {
        height: this.mapPanelSize,
        aspectRatio: 1,
        backgroundColor: mapColors.playerMapWindow,
      },
    });
  }

  mapPlayers(): UINode[] {  //THIS RETURNS AN ARRAY OF VIEW ONLY PINS MAPPED TO THE LOCATIONS OF EACH PLAYER/NPC IN THE WORLD
    const playerPins: UINode[] = [];
    const worldPlayersData = this.world.getPlayers();

    worldPlayersData.forEach((player) => {
      const playerPos = player.position.get();
      if (this.pointIsInRange(playerPos)) {
        playerPins.push(this.makePin(MapTypes.PLAYER, playerPos, player.name.get()));
      }
    })

    return playerPins;
  }

  makePin(type: MapTypes, worldCoordinate: Vec3, label: string, respawnRef?: Entity) {  //THIS RETURN A SINGLE PIN (PRESSABLE OR VIEW ONLY) WITH A SINGLE TEXT LABEL FOR THE NAME
    const mapPos = this.worldToMapPoint(worldCoordinate);
    const labelOffset = mapPos.y > this.mapPanelSize / 2 ? '75%' : '-75%';

    const pinStyle: ViewStyle = {
      height: 50,
      aspectRatio: 1,
      backgroundColor: mapColors.pinPrimary,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      left: mapPos.x - 25,
      top: mapPos.y - 25,
    };

    const pinLabel: UINode = Text({
      text: label.toUpperCase(),
      style: {
        height: '50%',
        aspectRatio: 4,
        backgroundColor: mapColors.pinSecondary,
        bottom: labelOffset,
        ...pinLabelTextFormatting
      }
    })

    if (type === MapTypes.TRAVEL) {
      return Pressable({
        style: pinStyle,
        children: [pinLabel],
        onClick: (player) => {
          if (respawnRef) {
            respawnRef.as(SpawnPointGizmo).teleportPlayer(player);
          }
        }
      })
    } else {
      return View({
        style: pinStyle,
        children: [pinLabel]
      })
    }
  }

  makeButton(label: string, callback: Callback): UINode { //THIS WILL RETURN A SINGLE PRESSABLE WITH A SINGLE TEXT LABEL FOR THE NAME AND A CALLBACK FUNCTION FOR INTERACTIVITY
    return Pressable({
      style: {
        height: this.bannerHeight * 0.9,
        aspectRatio: 3,
        backgroundColor: mapColors.utilityButtons
      },
      children: [
        Text({
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
    })
  }

  handleTravelClick(player: Player) { //THIS IS CALLED WHEN THE USER TOGGLES INTO THE 'TRAVEL' MAP
    //console.log(`${player.name.get()} selected travel`);
    this.isTravelMap.set(true, [player]);
  }

  handlePeopleClick(player: Player) { //THIS IS CALLED WHEN THE USER TOGGLES INTO THE 'PLAYER' MAP
    //console.log(`${player.name.get()} selected people`);
    this.isTravelMap.set(false, [player]);
  }

  handleRefreshClick(player: Player) {  //THIS IS CALLED WHEN THE USER REFRESHES 'PLAYER' MAP
    //console.log(`${player.name.get()} selected refresh`);
    this.updatePlayerMap();
  }

  worldToMapPoint(worldCoord: Vec3): { x: number, y: number } { //THE MOST IMPORTANT FUNCTION OF THIS SCRIPT. WILL CONVERT A 3D POINT IN THE WORLD TO A 2D POINT ON THE MAP

    // STEP 1) Figure out the center of the map.
    // If you gave the map a special "center" object, use its position.
    // Otherwise, use (0, 0, 0) as the center.
    const worldCenter = this.props.mapCenter ? this.props.mapCenter.position.get() : Vec3.zero;

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

  pointIsInRange(position: Vec3): boolean { //RETURNS A BOOLEAN BASED ON IF THE POINT OF INTEREST IS WITHIN THE DEFINED BOUNDS OF THE MAP
    const worldCenter = this.props.mapCenter ? this.props.mapCenter.position.get() : Vec3.zero;
    const boundsX = worldCenter.x + this.worldBounds.x;
    const boundsY = worldCenter.y + this.worldBounds.y;
    const inBoundsX = position.x <= boundsX && position.x >= boundsX * -1;
    const inBoundsY = position.y <= boundsY && position.y >= boundsY * -1;
    return inBoundsX && inBoundsY;
  }

  getWorldPlayersData(): PlayerPinData[] {  //RETURNS AN ARRAY OF OBJECTS CONTAING INFO ABOUT THE NAME AND LOCATION OF EVERY PLAYER/NPC IN THE WORLD
    return this.world.getPlayers().map((player) => ({
      name: player.name.get(),
      position: player.position.get()
    }));
  }

  updatePlayerMap() { //WILL CALL THE GET_WORLD_PLAYERS_DATA METHOD
    this.worldPlayersData.set(this.getWorldPlayersData());
  }

  start() { }
}
UIComponent.register(MapV2_UI);