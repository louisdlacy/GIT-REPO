import { UIComponent, Binding } from "horizon/ui";
/**
 * A generic three part panel for custom UIs consisting of a title, subtitle, and body.
 */
export declare class CustomUI_GenericPanel extends UIComponent {
    static propsDefinition: {
        title: {
            type: "string";
        };
        subTitle: {
            type: "string";
        };
        body: {
            type: "string";
        };
    };
    panelHeight: number;
    panelWidth: number;
    bndTitleText: Binding<string>;
    bndSubTitleText: Binding<string>;
    bndbodyText: Binding<string>;
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
}
