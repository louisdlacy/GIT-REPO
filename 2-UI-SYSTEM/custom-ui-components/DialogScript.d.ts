import { DialogContainer } from 'Dialog_UI';
import * as hz from 'horizon/core';
export declare class DialogScript extends hz.Component<typeof DialogScript> {
    static propsDefinition: {
        response: {
            type: "string";
        };
        option1: {
            type: "string";
        };
        nextDialog1: {
            type: "Entity";
        };
        option2: {
            type: "string";
        };
        nextDialog2: {
            type: "Entity";
        };
        option3: {
            type: "string";
        };
        nextDialog3: {
            type: "Entity";
        };
    };
    private branchingDialogs;
    start(): void;
    /**
     * Retrieves a dialog from the dialog tree based on the provided key sequence.
     *
     * @param key - An array of numbers representing the path in the dialog tree.
     * @returns A DialogContainer object with the dialog response and options, or undefined if the path is empty and the conversation has ended.
     */
    getDialogFromTree(key: number[]): DialogContainer | undefined;
}
