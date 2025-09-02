import { TriviaGameUI } from "answerStation";
import { Events } from "Events";
import { CodeBlockEvents, Component, Player, PlayerDeviceType, } from "horizon/core";

export type Dbentry = {
    question: string;
    answers: string[];
};

export let GameStatus: "idle" | "preparing" | "running" = "idle";

export class gameManager extends Component<typeof gameManager> {
    static s_instance: gameManager;
    static propsDefinition = {};

    // The map is used as a boolean to track if the player is active (true) or eliminated (false).
    private players = new Map<Player, boolean>();
    private stations: TriviaGameUI[] = [];

    preStart() {
        gameManager.s_instance = this;
        this.connectLocalBroadcastEvent(Events.gameOver, () => {
            this.players.clear();
            this.stations.forEach((station) => {
                // station.clear();
            });
            GameStatus = "idle";
            this.sendLocalBroadcastEvent(Events.hideMobileUI, {});
        });

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player: Player) => {
            this.players.delete(player);
            this.playerElimination(player);
        });
    }

    start() { }

    registerStation(station: TriviaGameUI) {
        this.stations.push(station);
    }

    registerPlayer(player: Player) {
        if (GameStatus === "running" || this.players.has(player)) {
            return;
        }
        this.players.set(player, false); // Register player vote
    }

    startGame(winningCategory: number) {
        if (GameStatus === "running") {
            return;
        }

        GameStatus = "running";
        let index = 0;
        const mobilePlayers: Player[] = [];
        this.players.forEach((value, key) => {
            if (key.deviceType.get() !== PlayerDeviceType.VR) {
                mobilePlayers.push(key);
                this.sendNetworkBroadcastEvent(Events.setCameratoViewMode, { player: key, });
            }

            this.stations[index].assignplayer(key);
            this.players.set(key, true);
            index++;
        });

        this.async.setTimeout(() => {
            this.sendLocalBroadcastEvent(Events.startGame, { winningCategory, players: this.players });
        }, 5_000);

        this.sendLocalBroadcastEvent(Events.assignMobilePlayers, { mobilePlayers })
        this.sendLocalBroadcastEvent(Events.showOnlyToVR, {});
    }

    playerElimination(player: Player) {
        if (this.players.has(player)) {
            this.players.set(player, false);
        }

        let alivePlayers = 0;
        this.sendLocalBroadcastEvent(Events.RemoveMobilePlayer, { player });

        this.players.forEach((isActive) => {
            if (isActive) {
                alivePlayers++;
            }
        });

        if (alivePlayers === 0) {
            this.sendLocalBroadcastEvent(Events.allplayersEliminated, {});
            this.world.getPlayers().forEach((player) => {
                this.sendNetworkEvent(player, Events.setCameraPlayerview, {});
            });
        }
    }
}
Component.register(gameManager);
