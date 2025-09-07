import { Player } from "horizon/core";
import { UIComponent, Binding, UINode, ImageSource } from "horizon/ui";
type VoteEntry = {
    value: number;
    binding: Binding<number>;
};
export declare class CategorySelectionUI extends UIComponent {
    panelWidth: number;
    panelHeight: number;
    static instance: CategorySelectionUI;
    selectedCategory: Binding<number>;
    bindCountDownText: Binding<string>;
    catergoryImage: Binding<ImageSource>;
    playerVotes: Map<Player, number>;
    listOfPlayers: Player[];
    countDownInterval: number;
    votes: VoteEntry[];
    initializeUI(): UINode<import("horizon/ui").ViewProps>;
    preStart(): void;
    playerVoted(player: Player, index: number): void;
    countdown(): void;
    updateImage(index: number): void;
}
export {};
