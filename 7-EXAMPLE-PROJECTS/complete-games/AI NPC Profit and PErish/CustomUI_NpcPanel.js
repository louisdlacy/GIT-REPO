"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomUI_GenericPanel_1 = require("CustomUI_GenericPanel");
const ui_1 = require("horizon/ui");
/**
 * A custom UI Panel specifically for remixing and extension to accommodate NPC uses
 */
class CustomUI_NpcPanel extends CustomUI_GenericPanel_1.CustomUI_GenericPanel {
}
CustomUI_NpcPanel.propsDefinition = {
    ...CustomUI_GenericPanel_1.CustomUI_GenericPanel.propsDefinition
};
;
ui_1.UIComponent.register(CustomUI_NpcPanel);
