//--- SCRIPT: Emoji_CategoryDefinition.ts ---//
// Functionality: To define a category and its emojis.
// Type: Server Script
// Placement: Attached to multiple empty gizmos, each tagged with EmojiCategory.
// Responsibilities: A data container for a single category, configured by the creator with a Name, DisplayOrder, and up to 50 emoji Assets.
// Properties
// - Name: The string name of the category.
// - DisplayOrder: A number that determines the order of the category tabs.
// - emoji1 through emoji50: Asset references for the emoji textures.

// See: (FORUM LINK)

import * as hz from 'horizon/core';

export class Emoji_CategoryDefinition extends hz.Component<typeof Emoji_CategoryDefinition> {
    static propsDefinition = {
        // The name of this category, which will be displayed on the UI tab.
        Name: { type: hz.PropTypes.String, default: "New Category" },

        // The order in which this category should appear in the UI. Lower numbers appear first.
        DisplayOrder: { type: hz.PropTypes.Number, default: 0 },

        // Assign up to 50 emoji texture assets for this category.
        emoji1: { type: hz.PropTypes.Asset }, emoji2: { type: hz.PropTypes.Asset },
        emoji3: { type: hz.PropTypes.Asset }, emoji4: { type: hz.PropTypes.Asset },
        emoji5: { type: hz.PropTypes.Asset }, emoji6: { type: hz.PropTypes.Asset },
        emoji7: { type: hz.PropTypes.Asset }, emoji8: { type: hz.PropTypes.Asset },
        emoji9: { type: hz.PropTypes.Asset }, emoji10: { type: hz.PropTypes.Asset },
        emoji11: { type: hz.PropTypes.Asset }, emoji12: { type: hz.PropTypes.Asset },
        emoji13: { type: hz.PropTypes.Asset }, emoji14: { type: hz.PropTypes.Asset },
        emoji15: { type: hz.PropTypes.Asset }, emoji16: { type: hz.PropTypes.Asset },
        emoji17: { type: hz.PropTypes.Asset }, emoji18: { type: hz.PropTypes.Asset },
        emoji19: { type: hz.PropTypes.Asset }, emoji20: { type: hz.PropTypes.Asset },
        emoji21: { type: hz.PropTypes.Asset }, emoji22: { type: hz.PropTypes.Asset },
        emoji23: { type: hz.PropTypes.Asset }, emoji24: { type: hz.PropTypes.Asset },
        emoji25: { type: hz.PropTypes.Asset }, emoji26: { type: hz.PropTypes.Asset },
        emoji27: { type: hz.PropTypes.Asset }, emoji28: { type: hz.PropTypes.Asset },
        emoji29: { type: hz.PropTypes.Asset }, emoji30: { type: hz.PropTypes.Asset },
        emoji31: { type: hz.PropTypes.Asset }, emoji32: { type: hz.PropTypes.Asset },
        emoji33: { type: hz.PropTypes.Asset }, emoji34: { type: hz.PropTypes.Asset },
        emoji35: { type: hz.PropTypes.Asset }, emoji36: { type: hz.PropTypes.Asset },
        emoji37: { type: hz.PropTypes.Asset }, emoji38: { type: hz.PropTypes.Asset },
        emoji39: { type: hz.PropTypes.Asset }, emoji40: { type: hz.PropTypes.Asset },
        emoji41: { type: hz.PropTypes.Asset }, emoji42: { type: hz.PropTypes.Asset },
        emoji43: { type: hz.PropTypes.Asset }, emoji44: { type: hz.PropTypes.Asset },
        emoji45: { type: hz.PropTypes.Asset }, emoji46: { type: hz.PropTypes.Asset },
        emoji47: { type: hz.PropTypes.Asset }, emoji48: { type: hz.PropTypes.Asset },
        emoji49: { type: hz.PropTypes.Asset }, emoji50: { type: hz.PropTypes.Asset },
    };

    start() {
        // This component is a data container. No active logic is needed on start.
        // The Emoji_Controller will find this component and read its properties.
    }
}

hz.Component.register(Emoji_CategoryDefinition);
