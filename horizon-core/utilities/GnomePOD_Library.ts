import { Color, TextureAsset } from "horizon/core";

export const UIImages = {
  fact: new TextureAsset(BigInt('24364162219836570')),
  weather: new TextureAsset(BigInt('1378267316803258')),
  joke: new TextureAsset(BigInt('1209114960969607')),
}

export const statusColors = {
  responding: new Color(0.651, 1, 0),
  waiting: new Color(1, 0.894, 0),
  idle: new Color(1, 1, 1),
}

export const finalCallouts = [
  `Right then… no more nonsense? I've got a pie in the oven and a ferret in the wall.`,
  `You good now? Because my kettle's screaming like a banshee.`,
  `Anything else, or can I finally finish fixing my enchanted sink?`,
  `Speak now or forever let me return to my stew.`,
  `Please tell me that was the last request. My gnome soap opera's about to start.`,
  `Is that it? Because the cat's casting spells again and I *need* to supervise.`,
  `All done? I've got boots to polish and a hex to reverse.`,
  `If that's all, I'll be vanishing into my teapot for the foreseeable future.`,
  `One last thing, or am I officially off the hook?`,
  `You sure? I was *this close* to a nap before you summoned me.`,
  `We good? Because the sourdough's fermenting and I won't miss that again.`,
  `Well? Last call before I go back to pretending you don't exist.`
];
