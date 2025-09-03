"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelBarView = levelBarView;
const ui_1 = require("horizon/ui");
const PlayerHUDUtils_1 = require("PlayerHUDUtils");
const TextShadows = {
    standard: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: [2, 2],
        textShadowRadius: 2,
    },
    light: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: [1, 1],
        textShadowRadius: 1,
    }
};
function levelBarView() {
    return (0, ui_1.View)({
        children: [
            (0, ui_1.View)({
                children: [
                    (0, ui_1.View)({
                        children: [
                            (0, ui_1.View)({
                                style: {
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                                children: [
                                    // Background container with shadow effect
                                    (0, ui_1.View)({
                                        style: {
                                            width: '100%',
                                            height: 10, // Height of the progress bar
                                            backgroundColor: '#333333', // Darker background
                                            borderRadius: 5,
                                            overflow: 'hidden',
                                        },
                                        children: [
                                            // Progress bar fill that uses interpolation for width
                                            (0, ui_1.View)({
                                                style: {
                                                    height: '100%',
                                                    backgroundColor: ui_1.Binding.derive([PlayerHUDUtils_1.PlayerHUDBindings.isLevelingUp], (isLevelingUp) => isLevelingUp ? '#FFD700' : '#22cc44' // Gold when leveling up, green otherwise
                                                    ),
                                                    width: PlayerHUDUtils_1.PlayerHUDBindings.xpPercentage.interpolate([0, 1], ['0%', '100%']),
                                                    borderRadius: 4, // Slightly smaller than container for clean edges
                                                }
                                            }),
                                            // Add lighter green overlay on top portion of the progress bar
                                            (0, ui_1.View)({
                                                style: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    height: '30%',
                                                    width: PlayerHUDUtils_1.PlayerHUDBindings.xpPercentage.interpolate([0, 1], ['0%', '100%']),
                                                    backgroundColor: ui_1.Binding.derive([PlayerHUDUtils_1.PlayerHUDBindings.isLevelingUp], (isLevelingUp) => isLevelingUp ? '#FFD700' : '#22cc44' // Gold when leveling up, green otherwise
                                                    ),
                                                }
                                            }),
                                            // highlight effect for better visual appeal
                                            (0, ui_1.View)({
                                                style: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    height: '10%',
                                                    width: '100%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
                                                }
                                            })
                                        ]
                                    })
                                ]
                            })
                        ],
                        style: {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'stretch',
                        }
                    }),
                    (0, ui_1.View)({
                        children: [
                            (0, ui_1.Text)({
                                text: "xp needed",
                                style: {
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginLeft: 10,
                                    ...TextShadows.light,
                                }
                            }),
                            (0, ui_1.Text)({
                                text: ui_1.Binding.derive([PlayerHUDUtils_1.PlayerHUDBindings.xpMaxValue, PlayerHUDUtils_1.PlayerHUDBindings.xpValue], (maxXP, currentXP) => `${Number(maxXP) - Number(currentXP)} xp`),
                                style: {
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginLeft: 10,
                                    ...TextShadows.light,
                                }
                            }),
                        ],
                        style: {
                            justifyContent: 'center',
                        }
                    }),
                ],
                style: {
                    flexDirection: 'row',
                }
            }),
            (0, ui_1.View)({
                children: [
                    (0, ui_1.View)({
                        children: [
                            (0, ui_1.Text)({
                                text: "Level:",
                                style: {
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginRight: 8,
                                    ...TextShadows.light,
                                }
                            }),
                            (0, ui_1.Text)({
                                text: PlayerHUDUtils_1.PlayerHUDBindings.levelValue,
                                style: {
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: 'yellow',
                                    ...TextShadows.standard,
                                }
                            }),
                        ],
                        style: {
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                        }
                    }),
                ],
                style: {
                    alignItems: 'center',
                }
            }),
        ],
        style: {
            backgroundColor: '#222222aa', // Dark background for the level bar
            borderRadius: 10,
            width: '50%',
            padding: 10,
        }
    });
}
