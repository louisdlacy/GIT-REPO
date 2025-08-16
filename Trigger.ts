import { CodeBlockEvents, Component, NetworkEvent, Player, PropTypes } from 'horizon/core'
import { UIComponent, UINode, View } from 'horizon/ui';

export const PlayersToDisplay = new NetworkEvent<{ players: Player[] }>("playersToDisplay");
export const CUIReady = new NetworkEvent("cuiReady");

class Trigger extends Component<typeof Trigger> {
    static propsDefinition = {
        local: { type: PropTypes.Entity }
    };
    private currentUser: undefined | Player
    private playerLeavingTimeout: undefined | number

    preStart(): void {
        if (!this.props.local) {
            throw new Error("Trigger component requires a 'local' prop with an Entity reference.");
        }

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.currentUser && this.currentUser !== player) {
                this.world.ui.showPopupForPlayer(player, this.currentUser.name.get() + " is using this station", 8);
                return
            } else if (this.currentUser === player) {
                if (this.playerLeavingTimeout) {
                    this.async.clearTimeout(this.playerLeavingTimeout);
                }
            }

            this.currentUser = player;
            this.props.local!.owner.set(player);
        })

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            if (this.currentUser === player) {
                this.returnToServer();
            }
        });

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.sendNetworkEvent(this.props.local!, PlayersToDisplay, { players: this.world.getPlayers() });
        })

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.currentUser === player) {
                this.returnToServer();
            } else {
                this.sendNetworkEvent(this.props.local!, PlayersToDisplay, { players: this.world.getPlayers() });
            }
        })

        this.connectNetworkEvent(this.entity, CUIReady, () => {
            if (this.currentUser) {
                this.sendNetworkEvent(this.props.local!, PlayersToDisplay, { players: this.world.getPlayers() });
            }
        });
    }

    start() {

    }

    private returnToServer() {
        if (this.playerLeavingTimeout) {
            this.async.clearTimeout(this.playerLeavingTimeout);
        }

        this.playerLeavingTimeout = this.async.setTimeout(() => {
            this.currentUser = undefined;
            this.props.local!.owner.set(this.world.getServerPlayer());
            this.playerLeavingTimeout = undefined;
        }, 2000);
    }
}
Component.register(Trigger);