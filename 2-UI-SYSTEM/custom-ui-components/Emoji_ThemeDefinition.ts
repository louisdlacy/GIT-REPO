//--- SCRIPT: Emoji_ThemeDefinition.ts ---//
// Functionality: A reusable data container for a single UI theme.
// Type: Server Script
// Placement: Attached to multiple empty gizmos, each tagged with EmojiTheme.
// Responsibilities: Holds all creator - configurable properties for a theme, such as colors, sizes, and opacities.It has no active logic and is read by the Emoji_ServerController at startup.
// Properties:
// - Name: The unique string name for the theme(e.g., "dark", "forest").
// - (All other properties for panel, buttons, text, etc.)

// See: (FORUM LINK)


import * as hz from 'horizon/core';
import { Color } from 'horizon/core';

export class Emoji_ThemeDefinition extends hz.Component<typeof Emoji_ThemeDefinition> {
    static propsDefinition = {
        // The unique name for this theme (e.g., "dark", "light", "forest").
        // This will appear in the player's preferences dropdown.
        Name: { type: hz.PropTypes.String, default: "dark" },

        // --- Panel Dimensions & Background --- //
        panelWidth: { type: hz.PropTypes.Number, default: 500 },
        panelHeight: { type: hz.PropTypes.Number, default: 280 },
        panelBackgroundColor: { type: hz.PropTypes.Color, default: new Color(0.117, 0.117, 0.117) },
        panelBackgroundOpacity: { type: hz.PropTypes.Number, default: 0.9 },

        // --- Category Tabs --- //
        categoryTabColorDefault: { type: hz.PropTypes.Color, default: new Color(0, 0, 0) },
        categoryTabOpacityDefault: { type: hz.PropTypes.Number, default: 0.0 },
        categoryTabColorHover: { type: hz.PropTypes.Color, default: new Color(0.133, 0.133, 0.133) },
        categoryTabOpacityHover: { type: hz.PropTypes.Number, default: 1.0 },
        categoryTabColorActive: { type: hz.PropTypes.Color, default: new Color(0.2, 0.2, 0.2) },
        categoryTabOpacityActive: { type: hz.PropTypes.Number, default: 1.0 },

        // --- Emoji Buttons --- //
        emojiButtonColorDefault: { type: hz.PropTypes.Color, default: new Color(0.266, 0.266, 0.266) },
        emojiButtonOpacityDefault: { type: hz.PropTypes.Number, default: 1.0 },
        emojiButtonColorHover: { type: hz.PropTypes.Color, default: new Color(0.333, 0.333, 0.333) },
        emojiButtonOpacityHover: { type: hz.PropTypes.Number, default: 1.0 },
        emojiButtonColorPressed: { type: hz.PropTypes.Color, default: new Color(0, 0.667, 1) },
        emojiButtonOpacityPressed: { type: hz.PropTypes.Number, default: 1.0 },

        // --- Preferences Panel Buttons --- //
        prefsButtonColorDefault: { type: hz.PropTypes.Color, default: new Color(0.266, 0.266, 0.266) },
        prefsButtonColorHover: { type: hz.PropTypes.Color, default: new Color(0.333, 0.333, 0.333) },
        prefsButtonColorPressed: { type: hz.PropTypes.Color, default: new Color(0, 0.667, 1) },
        prefsButtonDisabledColor: { type: hz.PropTypes.Color, default: new Color(0.15, 0.15, 0.15) },

        // --- Emoji Pop-up Display --- //
        // REVISED (v0.18): Added properties for the pop-up background.
        displayBackgroundColor: { type: hz.PropTypes.Color, default: new hz.Color(0.1, 0.1, 0.1) },
        displayBackgroundOpacity: { type: hz.PropTypes.Number, default: 0.7 },

        // --- Font & Icon Sizes --- //
        categoryTabTextSize: { type: hz.PropTypes.Number, default: 18 },
        emojiButtonSize: { type: hz.PropTypes.Number, default: 64 },
        emojiIconSize: { type: hz.PropTypes.Number, default: 50 },

        // --- Text Colors --- //
        primaryTextColor: { type: hz.PropTypes.Color, default: new Color(1, 1, 1) },
        secondaryTextColor: { type: hz.PropTypes.Color, default: new Color(0.8, 0.8, 0.8) },
    };

    start() {
        // This component is a data container. No active logic is needed on start.
        // The Emoji_Controller will find this component and read its properties.
    }
}

hz.Component.register(Emoji_ThemeDefinition);

