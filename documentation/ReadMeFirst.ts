import { Component } from 'horizon/core';

/*
Leaderboard Manager Plug & Play © 2025 by GausRoth is licensed under Creative Commons Attribution 4.0 International.
To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/

YouTube Tutorial:
https://youtu.be/2bH_ypYp3R0

GitHub:
https://github.com/Gausroth/HorizonWorldsTutorials

Documentaion:
https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/world-leaderboard-gizmo
https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/quests-leaderboards-and-variable-groups/leaderboard-reset-frequency
https://developers.meta.com/horizon-worlds/reference/2.0.0/core_ileaderboards
https://developers.meta.com/horizon-worlds/learn/documentation/mhcp-program/community-tutorials/creator-manual#leaderboards

Asste Pack Contents:
* ReadMeFirst: A TypeScript script designed to inform you about the Leaderboard Manager Plug & Play asset.
* TypeScriptDemo (object): An empty object that holds the TypeScriptDemo script.  
* TypeScriptDemo (script): A TypeScript script designed to show you how to send an event from a TypeScript script to the LeaderboardManager to
  update a players leaderboard score.
* CodeBlockDemo (object): An empty object that holds the CodeBlockDemo script.  
* CodeBlockDemo (script): A CodeBlock script designed to show you how to send an event from a CodeBlock script to the LeaderboardManager to
  update a players leaderboard score.
* LeaderboardManager (object): An empty object that holds the LeaderboardManager script.  
* LeaderboardManager (script): A TypeScript script that updates a players leaderboard score.

Setup (Desktop Editor):
* Create a leaderboard: Systems > leaderboards > + > Set leaderboard required data fields (Name, Sort Order, Reset Frequency).
* Add the World Leaderboard gizmo: Build > Gizmozs > Right Click on World Leaderboard > Place.
* Select WorldLeaderboard in the Hierarchy.
* Set WorldLeaderboard's Behavior: Set Leaderboard to the leaderboard you created.
* Delete the CodeBlockDemo (object) & CodeBlockDemo (script)
* See Setup Continued.

Setup (VR Editor):
* Create a leaderboard: Hamburger Button (Left Controller) > Systems > leaderboards > Create Leaderboard > Set leaderboard required data fields (Name, Sort Order, Reset Frequency).
* Add the World Leaderboard gizmo: Hamburger Button (Left Controller) > Build > Gizmozs > Click on World Leaderboard and drag into the world to place.
* Select WorldLeaderboard in the world and open its properties panel (right joystick up).
* Set WorldLeaderboard's Behavior: Set Leaderboard to the leaderboard you created.
* Delete the TypeScriptDemo (object) & TypeScriptDemo (script)
* See Setup Continued.

Setup Continued (Desktop Editor & VR Editor)
* If you are using CodeBlocks you can delete the TypeScriptDemo (object) & TypeScriptDemo (script).
* If you are using TypeScript you can delete the CodeBlockDemo (object) & CodeBlockDemo (script).
* NOTE: Both demo scripts are designed to run when the player enters the world.
* Start the world and enter to see the leaderboard update.

* NOTE: Once you understand how this asset works you can delete all demos and this script.
*/

class ReadMeFirst extends Component<typeof ReadMeFirst> {
    static propsDefinition = {};

    start() { }
}
Component.register(ReadMeFirst);