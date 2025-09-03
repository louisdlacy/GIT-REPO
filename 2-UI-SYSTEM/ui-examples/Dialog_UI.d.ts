import { UIComponent, UINode } from 'horizon/ui';
export type DialogContainer = {
    title?: string;
    response: string;
    option1Text: string;
    option2Text?: string;
    option3Text?: string;
};
export declare class Dialog_UI extends UIComponent<typeof Dialog_UI> {
    static propsDefinition: {
        trigger: {
            type: "Entity";
        };
    };
    private dialogTitle;
    private line;
    private option1;
    private option2;
    private option3;
    private optionTree;
    private localPlayer;
    private talkingEntity;
    private trigger;
    start(): void;
    chooseDialogOption(option: number): void;
    updateText(container: DialogContainer): void;
    initializeUI(): UINode<import("horizon/ui").ViewProps>;
}
