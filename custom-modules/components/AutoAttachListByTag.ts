import {
  AttachableEntity,
  AttachablePlayerAnchor,
  CodeBlockEvents,
  Component,
  Entity,
  NetworkEvent,
  Player,
  PropTypes,
} from "horizon/core";

import { assertAllNullablePropsSet, debugLog, getEntityListByTag } from "sysHelper";

export const AttachEvent = new NetworkEvent<{ player: Player }>("AttachEvent");
export const DetachEvent = new NetworkEvent("DetachEvent");
export const AttachmentListRequest = new NetworkEvent<{requester: Entity}>("AttachmentListRequest");
export const AttachmentListResponse = new NetworkEvent<{attachments: Entity[] }>("AttachmentListResponse");


class AutoAttachListByTag extends Component<typeof AutoAttachListByTag> {
  static propsDefinition = {
    enabled: {
      type: PropTypes.Boolean,
      default: true,
    },
    showDebugs: {
      type: PropTypes.Boolean,
      default: false,
    },
    assignOwnership: {
      type: PropTypes.Boolean,
      default: true,
    },
    sendAttachEvent: {
      type: PropTypes.Boolean,
      default: true,
    },
    playerAnchor: {
      type: PropTypes.String,
      default: "Torso",
    },
    tag: {
      type: PropTypes.String,
      default: "",
    },
  };

  private objectsToAttachList: Entity[] = [];
  private playerList: Player[] = [];
  private playerAnchor: AttachablePlayerAnchor = AttachablePlayerAnchor.Head;

  override preStart() {
    if (!this.props.enabled) return;

    assertAllNullablePropsSet(this, this.entity.name.get());

    if (this.props.playerAnchor === "Head") {
      this.playerAnchor = AttachablePlayerAnchor.Head;
    } else if (this.props.playerAnchor === "Torso") {
      this.playerAnchor = AttachablePlayerAnchor.Torso;
    } else {
      console.error(`Invalid player anchor type: ${this.props.playerAnchor}. Defaulting to Torso.`);
      this.playerAnchor = AttachablePlayerAnchor.Torso;
    }

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player: Player) =>
      this.onWorldPlayerEnter(player)
    );

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      this.onWorldPlayerExit.bind(this)
    );

    this.connectNetworkEvent(this.entity, AttachmentListRequest, (data) => {
      // Handle the response data
      this.sendNetworkEvent(data.requester, AttachmentListResponse, { attachments: this.objectsToAttachList });
    });

  }

  start() {
    if (!this.props.enabled) return;

    const entities = getEntityListByTag(this.props.tag, this.world);
    this.onListEvent({ list: entities, listId: 0 });
  }

  onListEvent(data: { list: Entity[]; listId: number }) {
    debugLog(this.props.showDebugs, `Received list event on ${this.entity.name.get()}`);
    this.objectsToAttachList = data.list;
    if (this.objectsToAttachList === undefined) {
      console.error("Object list is undefined");
    }
  }

  onWorldPlayerEnter(enterPlayer: Player) {
    //filter out multiple calls for the same player
    if (this.playerList.includes(enterPlayer)) {
      return;
    }

    this.playerList.push(enterPlayer);

    this.SetupAttachment(enterPlayer);
  }

  SetupAttachment(player: Player) {
    //NULL CHECK
    if (this.objectsToAttachList.length === 0) {
      this.async.setTimeout(() => {
        this.SetupAttachment(player);
      }, 0.1 * 1000);
      return;
    }

    const index = player.index.get();
    const attachable = this.objectsToAttachList[index];
    if (attachable) {
      debugLog(
        this.props.showDebugs,
        `Attaching ${attachable.name.get()} to player ${player.name.get()} with index of ${index}`
      );

      if (this.props.assignOwnership) {
        attachable.owner.set(player);
      }
      
      attachable.as(AttachableEntity).attachToPlayer(player, this.playerAnchor);

      if (this.props.sendAttachEvent) {
        this.sendNetworkEvent(attachable, AttachEvent, {
          player: player,
        });
      }
    }
  }

  onWorldPlayerExit(exitPlayer: Player) {
    if (!this.playerList.includes(exitPlayer)) {
      return;
    }

    const playerIndex = this.playerList.indexOf(exitPlayer);
    if (playerIndex > -1) {
      this.playerList.splice(playerIndex, 1);
    }

    const index = exitPlayer.index.get();
    const attachable = this.objectsToAttachList[index];
    if (attachable) {
      attachable.as(AttachableEntity)?.detach();
      attachable.owner.set(this.world.getServerPlayer());

      this.sendNetworkEvent(attachable.as(Entity), DetachEvent, {});
    }
  }
}
Component.register(AutoAttachListByTag);
