Interactive Custom UI Screen Overlay
Overview
An interactive screen overlay is a type of screen overlay that renders in screen-space on top of the world, just like a non-interactive screen overlay does, while allowing players to interact with UI elements within the overlay such as buttons, menu options, and more.
Interactive, blocking screen overlays are designed to be used for situations that require the player’s immediate focus and attention. This means they are great for things like in-game shops, tutorials, and other UI that require the player to stop what they are doing and interact with the overlay before they can progress or continue playing.
By design, interactive, blocking screen overlays prevent gameplay-related inputs in order to allow the player to focus fully on the UI, which means this feature is not suitable for creating customized on-screen controls.
interactive overlay.gif
Interactive, non-blocking screen overlays are designed to be used as onscreen inputs that can be fully customized in size and appearance. Interactive, non-blocking screen overlays do not prevent gameplay-related inputs, and can be used in combination with the Custom Input API to create custom on-screen controls.
Getting Started
When you set the Display mode property of a Custom UI panel to Screen Overlay, a property named Input mode appears. You can use this property to switch the mode of the panel from No Interaction to Interactive, Blocking or Interactive, Non-Blocking, which allows the overlay to receive input from the current input pointer (such as a mouse, touchscreen, or VR controller).

You can test the interaction by adding a Pressable component to your UI script.
Pressable pseudo code:
Pressable({
  children: Text({
    text: 'Close',
    style: {
      color: 'white',
    },
  }),
  onClick: () => {
    console.log('Clicked Close');
    this.entity.visible.set(false);
  },
  style: {
    alignItems: 'center',
    backgroundColor: 'red',
    height: 36,
    justifyContent: 'center',
    width: 240,
  },
});
Input behavior when using Interactive, Blocking Screen Overlay
When an interactive, blocking screen overlay is visible on the screen, the following input behavior occurs:
Desktop
Player controls are locked
On-screen desktop prompts disappear
Mouse cursor is released and can be used to interact with any panel marked as Interactive, Blocking
Mobile
On-screen player controls are hidden and the player cannot move or look around
System controls such as PUI and Pause remain visible
Player can interact with any panel marked as Interactive, Blocking using touch input
VR
The interactive overlay is displayed on a HUD-like panel at a comfortable distance in front of the player and is locked to the camera
Player can interact with any panel marked as Interactive, Blocking using the VR controller pointer
Player controls such as movement are not locked
The overlay UI on VR will still be occluded by other objects. We cannot always render it on top, and this is because avatar (and raycasting) need to be on top of the UI, thus if the UI is on top of everything, so does avatar, which is wrong because avatar will occlude with the rest of world
Input behaviour when using Interactive, Non-Blocking Screen Overlay
When an interactive, non-blocking screen overlay is visible on the screen, the following behaviour occurs:
Desktop
Interactive, non-blocking screen overlay is not currently supported for desktop players
Mobile
On-screen player controls are still visible (you can disable the default onscreen buttons for mobile players with the Custom Input API)
Player can interact with any panel marked as Interactive, Non-Blocking using touch input
VR
The interactive, non-blocking overlay is not displayed for VR players and the player controls such as movement are not locked