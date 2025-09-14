import { CustomUI_GenericPanel } from 'CustomUI_GenericPanel';
import { UIComponent } from 'horizon/ui';

/**
 * A custom UI Panel specifically for remixing and extension to accommodate NPC uses
 */
class CustomUI_NpcPanel extends CustomUI_GenericPanel {
  static propsDefinition = {
    ...CustomUI_GenericPanel.propsDefinition
  };
  panelHeight = 200;
  panelWidth = 600;
};
UIComponent.register(CustomUI_NpcPanel);
