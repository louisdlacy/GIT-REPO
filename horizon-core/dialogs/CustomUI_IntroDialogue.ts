/*
  Welcome to the Custom AI NPC Examples world!

  This world is an ever evolving collection of remixable exmaples showing what can be done with Horizon's AI-powered NPCs.

  This is a simple CustomUI script that is used to display a welcome message and instructions for the user.

  The code executes as follows:
  1. initializeUI() - this method is executed when the simulation begins. This sets up the data structures. By default, the custom UI is empty.
  2. start() - this method is executed when the player enters the simulation. This creates the onPlayerEnterTrigger() event listener, which fires when the player enters the trigger zone.
    Note that we are counting on this start() method to execute after the other start() methods,
    including the one that reads in the data, under the assumption that the first custom UI is some distance from the SpawnPoint.
  3.refresh() - when the player enters the trigger zone, the AssetReferenceRows[] array is scanned for the proper row and, if found, populates the custom UI with the correct data.
    This occurs after the player enters the trigger zone, meaning the player is in close proximity to the custom UI.

*/

import {
  UIComponent,
  View,
  Text,
  Binding,
  Pressable,
  UINode,
} from "horizon/ui";
import * as hz from 'horizon/core';


/**
 * This is a hardcoded Custom UI to describe this remix world.
 */
class CustomUI_IntroDialogue extends UIComponent {

  static propsDefinition = {};

  // Following are fixed values (no variables permitted) for the height and width of the custom UI panel.
  panelHeight = 800;
  panelWidth = 1200;

  // Following are special variables (bindings) for applying variable values to custom UIs.
  bndTitleText = new Binding<string>('');
  bndSubTitleText = new Binding<string>('');
  bndbodyText = new Binding<string>('');
  bndButtonText = new Binding<string>('Next');

  // Current page index
  private currentPageIndex = 0;

  // Array of body text pages
  private bodyTextPages: string[] = [];

  initializeUI() {
    // Here, we set the values of the bindings using the set() method.
    this.bndTitleText.set('Welcome to AI NPC Examples!')
    this.bndSubTitleText.set('How to explore:')

    // Convert the body text into an array of sentences (one per page)
    this.bodyTextPages = [
      `This world is composed of some NPCs and sample assets from the game 'Profit or Perish'.
      We demonstrate simple NPC interactions.
      As the public API evolves, we will expand this world with more examples demonstrating the new capabilities of the API.`,

      `Some NPCs will walk towards you. They will greet you by name and then remain quiet.`,

      `There are a handful of items here that you can grab. When holding them, the NPCs will know about them.
      When you grab or drop them, if an NPC is nearby, they will react to it.`,

      `The best way to explore this world is to open it in the Horizon Worlds Editor and inspect the code and assets used.`,
    ];

    // Start by displaying the first page
    this.updateDisplayedPage();

    return View({
      children: [
        // Title section
        View({
          children: [
            Text({
              text: this.bndTitleText,
              style: {
                color: "black",
                fontSize: 72,
                fontWeight: "800",
              }
            })
          ],
          style: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "flex-end",
            justifyContent: "space-between",
          },
        }),

        // Content section
        View({
          children: [
            Text({
              text: this.bndSubTitleText,
              style: { color: "black", fontSize: 36, fontWeight: "600" }
            }),
            Text({
              text: this.bndbodyText,
              style: { color: "black", fontSize: 36 }
            }),
          ],
          style: {
            flexDirection: "column",
            paddingTop: 18,
            flex: 1,
          },
        }),

        // Button section
        View({
          children: [
            Pressable({
              onClick: (player: hz.Player) => this.onNextButtonPressed(),
              children: [
                Text({
                  text: this.bndButtonText,
                  style: {
                    color: "white",
                    fontSize: 36,
                    fontWeight: "600",
                  }
                })
              ],
              style: {
                backgroundColor: "#00008B", // dark blue
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 15,
                paddingBottom: 15,
                borderRadius: 10,
              }
            })
          ],
          style: {
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingTop: 20,
          },
        })
      ],

      style: {
        backgroundColor: "white",
        borderColor: "#00008B", // dark blue in RGB hex value
        borderWidth: 12,
        borderRadius: 25,
        padding: 20,
        flexDirection: "column",
        alignItems: "stretch",
        height: this.panelHeight,
      },
    });
  };

  /**
   * Updates the displayed page based on the current page index
   */
  private updateDisplayedPage(): void {
    // Set the body text to the current page
    if (this.currentPageIndex < this.bodyTextPages.length) {
      this.bndbodyText.set(this.bodyTextPages[this.currentPageIndex]);
    }

    // Update button text based on whether we're on the last page
    const isLastPage = this.currentPageIndex === this.bodyTextPages.length - 1;
    this.bndButtonText.set(isLastPage ? "Start Over" : "Next");
  }

  /**
   * Handles the button press
   */
  private onNextButtonPressed(): void {
    // Check if we're on the last page
    if (this.currentPageIndex === this.bodyTextPages.length - 1) {
      // If on last page, start over from the beginning
      this.currentPageIndex = 0;
    } else {
      // Otherwise, go to the next page
      this.currentPageIndex++;
    }

    // Update the displayed page
    this.updateDisplayedPage();
  }
};
UIComponent.register(CustomUI_IntroDialogue);
