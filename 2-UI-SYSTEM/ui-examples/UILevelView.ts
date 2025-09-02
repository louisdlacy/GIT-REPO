
import { Binding, Text, View } from "horizon/ui";
import { PlayerHUDBindings } from "PlayerHUDUtils";

type ShadowOffset = [number, number];

const TextShadows = {
  standard: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: [2, 2] as ShadowOffset,
    textShadowRadius: 2,
  },
  light: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: [1, 1] as ShadowOffset,
    textShadowRadius: 1,
  }
};

export function levelBarView() {
  return View({
    children: [
      View({
        children: [
          View({
            children: [
              View({
                style: {
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: [
                  // Background container with shadow effect
                  View({
                    style: {
                      width: '100%',
                      height: 10, // Height of the progress bar
                      backgroundColor: '#333333', // Darker background
                      borderRadius: 5,
                      overflow: 'hidden',
                    },
                    children: [
                      // Progress bar fill that uses interpolation for width
                      View({
                        style: {
                          height: '100%',
                          backgroundColor: Binding.derive(
                            [PlayerHUDBindings.isLevelingUp],
                            (isLevelingUp) => isLevelingUp ? '#FFD700' : '#22cc44' // Gold when leveling up, green otherwise
                          ),
                          width: PlayerHUDBindings.xpPercentage.interpolate([0, 1], ['0%', '100%']),
                          borderRadius: 4, // Slightly smaller than container for clean edges
                        }
                      }),

                      // Add lighter green overlay on top portion of the progress bar
                      View({
                        style: {
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '30%',
                          width: PlayerHUDBindings.xpPercentage.interpolate([0, 1], ['0%', '100%']),
                          backgroundColor: Binding.derive(
                            [PlayerHUDBindings.isLevelingUp],
                            (isLevelingUp) => isLevelingUp ? '#FFD700' : '#22cc44' // Gold when leveling up, green otherwise
                          ),
                        }
                      }),

                      // highlight effect for better visual appeal
                      View({
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
          View({
            children: [
              Text({
                text: "xp needed",
                style: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: 'white',
                  marginLeft: 10,
                  ...TextShadows.light,
                }
              }),
              Text({
                text: Binding.derive([PlayerHUDBindings.xpMaxValue, PlayerHUDBindings.xpValue], (maxXP, currentXP) => `${Number(maxXP) - Number(currentXP)} xp`),
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

       View({
         children: [
           View({
            children: [
              Text({
                text: "Level:",
                style: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                  marginRight: 8,
                  ...TextShadows.light,
                }
              }),
              Text({
                text: PlayerHUDBindings.levelValue,
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