import { Component, PropTypes } from 'horizon/core';

/**
 * Accessibility Manager
 * Central hub for managing accessibility settings.
 */
class sysAccessibilityManager extends Component<typeof sysAccessibilityManager> {
  static propsDefinition = {
    // For enabling/disabling subtitles.
    subtitlesEnabled: { type: PropTypes.Boolean, default: false },

    // For enabling/disabling a high-contrast UI theme.
    highContrastUI: { type: PropTypes.Boolean, default: false },

    // A multiplier for UI text size.
    textScale: { type: PropTypes.Number, default: 1.0 },

    // To enable interaction aids like 'LargeTriggers'.
    interactionHelper: { type: PropTypes.String, default: 'None' },
  };

  start() {
    console.log("sysAccessibilityManager started.");
    // In a real implementation, these props would be used to configure other systems.
  }
}

Component.register(sysAccessibilityManager);