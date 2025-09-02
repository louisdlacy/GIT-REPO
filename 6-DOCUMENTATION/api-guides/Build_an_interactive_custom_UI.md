Build an interactive custom UI
This topic shows you how to build an interactive custom UI, because creating a static, non-interactive UI panel is only the beginning. In most cases, you’d want to build dynamic UI panels that interact with the rest of the world. These are the two types of interactions:
Calling TypeScript from the UI:
Some UI components, for example, Pressables can receive player inputs and execute their effects implemented in the TypeScript.
Controlling the UI from TypeScript:
TypeScript can control and update what is being displayed in the UI at runtime after the UI is initialized.
This topic and Build a dynamic custom UI explore these capabilities by working through an example. Consider a game where the players are given a chance to change the color for a ball. In the UI, you’d like to have a text prompt and a confirmation button in the UI. After any player clicks the button, you’d want the ball’s color to be updated, button removed, and the prompt’s content and color changed.
The following image is an interactive UI showing a text prompt and a confirmation button. A text prompt and a confirmation button
The following image is an interactive UI showing some confirmation text. Some confirmation text after clicking the button
Build a static UI
To start, build the static version of the UI.
class BallDialog extends UIComponent {
  panelHeight = 200;
  panelWidth = 460;

  initializeUI() {
    return View({
      children: [
        Text({
          text: 'Want to change the color of the ball?',
          style: {
            color: 'black',
            fontSize: 24,
          },
        }),
        View({
          children: Text({
            text: 'Sure!',
            style: {
              color: 'white',
            },
          }),
          style: {
            alignItems: 'center',
            backgroundColor: '#19AD0E',
            borderRadius: 8,
            height: 36,
            justifyContent: 'center',
            marginTop: 12,
            width: 240,
          },
        }),
      ],
      style: {
        alignItems: 'center',
        backgroundColor: '#EDE2D5',
        borderRadius: 24,
        flexDirection: 'column',
        padding: 24,
        width: '100%',
      },
    });
  }
}
Invoking Callbacks from UI
Some components like Pressable can take function props as event handlers, which are callbacks. For example, the props of Pressable include onClick, onEnter, onExit, etc., and each callback will be executed when the corresponding event happens in the UI.
Add the effect of changing the ball color to the UI above. Some style props are hidden for simplicity.
class BallDialog extends UIComponent<typeof BallDialog> {
  static propsDefinition = {
    ball: { type: PropTypes.Entity },
  };

  initializeUI() {
    return View({
      children: [
        Text({
          text: 'Want to change the color of the ball?',
          style: {
            color: 'black',
            fontSize: 24,
            },
        }),
        Pressable({
          children: Text({ text: 'Sure!', style: { color: 'white', } }),
          onClick: () => {
            this.props.ball.color.set(new Color(0.9, 0.2, 0.2));
          },
          style: {
            alignItems: 'center',
            backgroundColor: '#19AD0E',
            borderRadius: 8,
            height: 36,
            justifyContent: 'center',
            marginTop: 12,
            width: 240,
          },
        }),
      ],
      style: {
        alignItems: 'center',
        backgroundColor: '#EDE2D5',
        borderRadius: 24,
        flexDirection: 'column',
        padding: 24,
        width: '100%',
      },
    });
  }
}
Summary of the code above:
You pass in the entity that you want to manipulate through the props.
You change the button from View to Pressable so that you can assign callbacks to the component to act on the player input events.
You write the onClick callback as a function. Place the desired effects inside the function to set a new color to the entity that you pass to the props.
The acting player
You can also know which player is the acting player, meaning the player who triggered the callback. This becomes handy when creating buttons that have different effects for different players.
All the callbacks are of type (player: Player) => void, and the parameter player is the Player object of the acting player. You can then implement the callback effects that takes in the player information:
Pressable({
  onClick: (player: Player) => {
    console.log(`Player with id ${player.index.get()} clicked`);
    // Do things differently based on the player
    this.sendCodeBlockEvent(player, myPlayerEvent, {...});
  },
})
You will explore more in Player-specific UI with an advanced example.
Working with class methods
A common pattern is to make the callback a class method. When you do this, be extra careful about the meaning of this. In TypeScript, class methods are not bound by default. If you do not bind a class method and pass it to a prop as a callback, when it is actually called, this will be undefined. This is not a behavior specific to our UI framework, but a part of how functions and classes work in JavaScript.
There are three solutions to this issue. The first is to explicitly bind this when assigning callbacks:
// in BallDialog class
handleClick() {
  this.props.ball.color.set(new Color(0.9, 0.2, 0.2));
}

// then in Pressable
onClick: this.handleClick.bind(this),
The second is to change class methods into class fields:
// in BallDialog class
handleClick = () => {
  this.props.ball.color.set(new Color(0.9, 0.2, 0.2));
};

// then in Pressable
onClick: this.handleClick,
The third is to write callbacks as inline arrow functions:
// in BallDialog class
handleClick() {
  this.props.ball.color.set(new Color(0.9, 0.2, 0.2));
}

// then in Pressable
onClick: () => this.handleClick(),
Passing parameters to callbacks
Sometimes the callback that you want to call needs to take parameters, for example, a class method this.setBallColor(color: Color) that encapsulates the effect of color change and takes a parameter as the new color. When you need to pass parameters to a callback, you can either bind the function or create a new inline arrow function:
// in BallDialog class
setBallColor(color: Color) {
  this.props.ball.color.set(color);
}

// then in Pressable
onClick: this.setBallColor.bind(this, new Color(0.9, 0.2, 0.2)),
// or equivalently
onClick: () => this.setBallColor(new Color(0.9, 0.2, 0.2)),
