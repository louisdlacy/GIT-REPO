import { Text, UIComponent, UINode, View, Pressable, Binding } from 'horizon/ui';
import { Color } from 'horizon/core';

enum SCREENS {
  MENU = 'menu',
  GAME = 'game',
  // Add new screen constants here:
  // SETTINGS= 'settings'
};

class GameMenuUI extends UIComponent<typeof GameMenuUI> {
  protected panelHeight: number = 800;
  protected panelWidth: number = 600;

  static propsDefinition = {};

  screenList: string[] = Object.values(SCREENS);

  private currentScreen = new Binding<string>(SCREENS.MENU);

  private navigateToScreen(screenName: string): void {
    this.currentScreen.set(screenName);
  }

  private createScreenNode(screenConstant: string, node: UINode): UINode {
    return UINode.if(
      this.currentScreen.derive(screen => screen === screenConstant),
      node
    );
  }

  initializeUI(): UINode {
    return View({
      children: [
        this.createScreenNode(SCREENS.MENU, this.startMenuView()),
        this.createScreenNode(SCREENS.GAME, this.gameScreenView()),

        // Add future screens here using the same pattern:
        // this.createScreenNode(SCREENS.SETTINGS, this.settingsScreenView()),

        // Fallback for any unregistered screens
        UINode.if(
          this.currentScreen.derive(screen =>
            !this.screenList.includes(screen)
          ),
          this.screenNotFoundView()
        )
      ],
      style: {
        backgroundColor: 'black',
        flex: 1
      }
    });
  }

  private startMenuView(): UINode {
    return View({
      children: [
        // Game Logo Space
        View({
          children: [
            Text({
              text: "YOUR GAME LOGO HERE",
              style: {
                fontSize: 48,
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'Anton'
              }
            })
          ],
          style: {
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40
          }
        }),

        // Start Button
        View({
          children: [
            Pressable({
              children: [
                Text({
                  text: "START GAME",
                  style: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'black'
                  }
                })
              ],
              onClick: () => {
                this.navigateToScreen(SCREENS.GAME);
              },
              style: {
                backgroundColor: Color.green,
                borderRadius: 10,
                padding: 20,
                width: 200,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center'
              }
            })
          ],
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }
        })
      ],
      style: {
        flex: 1,
        padding: 40,
        justifyContent: 'center'
      }
    });
  }

  private gameScreenView(): UINode {
    return View({
      children: [
        // Back to Menu Button - Top Right Corner
        View({
          children: [
            Pressable({
              children: [
                Text({
                  text: "BACK TO MENU",
                  style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'black'
                  }
                })
              ],
              onClick: () => {
                this.navigateToScreen(SCREENS.MENU);
              },
              style: {
                backgroundColor: Color.red,
                borderRadius: 8,
                padding: 12,
                width: 150,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center'
              }
            })
          ],
          style: {
            position: 'absolute',
            bottom: 20,
            right: 20
          }
        }),

        // Placeholder game content
        View({
          children: [
            Text({
              text: "YOUR GAME HERE",
              style: {
                fontSize: 36,
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'white'
              }
            })
          ],
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }
        })
      ],
      style: {
        flex: 1
      }
    });
  }

  // Optional: fallback for unknown screens
  private screenNotFoundView(): UINode {
    return View({
      children: [
        Text({
          text: `Screen not found`,
          style: {
            fontSize: 24,
            color: 'red',
            textAlign: 'center'
          }
        })
      ],
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    });
  }
}
UIComponent.register(GameMenuUI);
