"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCManager = exports.PlayerState = void 0;
/**
  This script orhcestrates behaviors of the NPCs in the world.

 */
const hz = __importStar(require("horizon/core"));
const GameManager_1 = require("GameManager");
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const navmesh_1 = __importDefault(require("horizon/navmesh"));
const QuestManager_1 = require("QuestManager");
const Utils_1 = require("Utils");
// import { refreshScore } from 'EconomyUI';
const DataStore = __importStar(require("DataStore"));
class PlayerState {
    constructor(init) {
        this.gemsCollected = 0;
        this.coins = 0;
        this.redGems = 0;
        this.gemQuestCompleted = false;
        Object.assign(this, init);
    }
}
exports.PlayerState = PlayerState;
const hiddenLocation = new hz.Vec3(0, -100, 0);
// abstract class that governs NPC behavior. Functions within the class define NPC capabilities and map to API endpoints.
// This class is extended in other classes in this script.
class NPCBehavior {
    onTransactionDone(ps, gemDelta, coinDelta) { }
    ;
    constructor(manager) {
        this.manager = manager;
    }
    // Uses referenced NavMesh to return a set of Vec3 waypoints for a path between the from: and to: parameters.
    getPathTo(from, to) {
        let nextPath;
        let getPathAttempts = 0;
        do {
            nextPath = this.manager.navMesh.getPath(from, to);
            getPathAttempts++;
            to.y = from.y;
        } while (nextPath == null && getPathAttempts < 20);
        if (nextPath == null) {
            return new Array();
        }
        return nextPath.waypoints;
    }
    // Managements movement for the NPC from its current location to a provided destination: Vec3 location.
    // Calls to getPath() to return waypoints, which are passed to the NPC methods rotateTo() and moveToPositions()
    moveToPosition(agent, destination, onfulfilled, onrejected) {
        let agentPos = agent.agentPlayer.get()?.foot.getPosition(hz.Space.World); //agent.position.get();
        let navmeshStart = this.manager.navMesh.getNearestPoint(agentPos, .3);
        if (navmeshStart) {
            agentPos = navmeshStart;
        }
        let navmeshDest = this.manager.navMesh.getNearestPoint(destination, .3);
        if (navmeshDest) {
            destination = navmeshDest;
        }
        let path = this.getPathTo(agentPos, destination);
        return agent.locomotion.rotateTo(destination.sub(agentPos)).then((value) => agent.locomotion.moveToPositions(path).then(onfulfilled, onrejected));
    }
    // If an NPC is targeting an hz.Player entity, this method returns the position of the entity's foot as a proxy for the location.
    calcTargetPos(target) {
        let targetPos = target.position.get();
        if (target instanceof hz.Player) {
            targetPos = target.foot.getPosition(hz.Space.World);
        }
        else if (targetPos.distance(hiddenLocation) > 4) {
            targetPos = new hz.Vec3(targetPos.x, 0, targetPos.z); // fudge for foot height for gems
        }
        return targetPos;
    }
    // Follow a moving target: this method attempts to compensate for moving targets when calculating targeting position.
    moveToEntity(agent, target, onfulfilled, onrejected) {
        const epsilon = 1.5;
        let targetPos = this.calcTargetPos(target);
        let dest = targetPos.clone();
        if (target instanceof hz.Player) {
            dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
        }
        return new Promise(async () => {
            let result = avatar_ai_agent_1.AgentLocomotionResult.Error;
            let rejected = false;
            const maxTries = 5;
            let numTries = 0;
            let agentPos = agent.agentPlayer.get().position.get();
            let dist = agentPos.distance(dest);
            while (dist > epsilon) {
                if (numTries > maxTries) {
                    rejected = true;
                    break;
                }
                if (targetPos.distance(hiddenLocation) < 4) {
                    await new Promise((resolve) => this.manager.async.setTimeout(resolve, 1000));
                    numTries = Math.max(numTries, maxTries - 1); // Only 1 retry in this state
                }
                else {
                    await this.moveToPosition(agent, dest, (value) => { result = value; });
                }
                ++numTries;
                targetPos = this.calcTargetPos(target);
                dest = targetPos.clone();
                if (target instanceof hz.Player) {
                    dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
                }
                agentPos = agent.agentPlayer.get().position.get();
                dist = agentPos.distance(dest);
                if (dist < epsilon) {
                    targetPos = this.calcTargetPos(target);
                    dest = targetPos.clone();
                    if (target instanceof hz.Player) {
                        dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
                    }
                    agentPos = agent.agentPlayer.get().position.get();
                    dist = agentPos.distance(dest);
                    agent.lookAt(targetPos);
                }
            }
            if (rejected) {
                if (onrejected) {
                    onrejected(avatar_ai_agent_1.AgentLocomotionResult.Error);
                }
                else if (onfulfilled) {
                    onfulfilled(avatar_ai_agent_1.AgentLocomotionResult.Error);
                }
            }
            else {
                if (onfulfilled) {
                    onfulfilled(result);
                }
            }
        });
    }
}
// null class is used to define the CurrentBehavior object until it can be defined during initialization of each NPC.
class NullNPCBehavior extends NPCBehavior {
    updateForPlayer(ps) {
        console.log("NullNPCBehavior");
    }
}
// NPC behavior when in GameState.Ready state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGameReady extends NPCBehavior {
    constructor() {
        super(...arguments);
        this.merchState = -1;
    }
    onTransactionDone(ps, gemDelta, coinDelta) {
        if (ps.coins <= 0 || ps.gemsCollected <= 0) {
            this.merchState = 2;
        }
    }
    updateForPlayer(ps) {
        const ve = this.manager.props.villageElder.as(avatar_ai_agent_1.AvatarAIAgent);
        // New player?
        if (!this.manager.veBusy && !ps.gemQuestCompleted && ps.gemsCollected == 0) {
            if (!ve.locomotion.isMoving.get()) {
                // Go to the human player
                this.manager.veBusy = true;
                this.moveToEntity(ve, ps.player, (value) => {
                    this.manager.audio?.playVEWelcome(); // Get some attention and then start the game
                    ve.locomotion.jump().then((value) => this.manager.async.setTimeout(() => {
                        this.moveToEntity(ve, this.manager.props.startLocation, (value) => { this.manager.veBusy = false; });
                    }, 3000));
                });
            }
        }
        else if (ps.gemQuestCompleted && this.merchState != 2) {
            this.merchState = 0;
        }
        const merch = this.manager.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent);
        if (!this.manager.merchantBusy) {
            if (this.merchState == 0) { // Go sell some gems
                this.manager.merchantBusy = true;
                this.moveToEntity(merch, this.manager.props.merchantIdleLocation, (result) => {
                    this.manager.merchantBusy = false;
                    if (ps.player.position.get().distance(merch.position.get()) < 10) {
                        if (ps.coins > 0) {
                            this.manager.audio?.playTMWelcomeMoney();
                        }
                        else {
                            this.manager.audio?.playTMWelcomeNoMoney();
                        }
                    }
                    this.merchState = 1;
                });
            }
            else if (this.merchState == 2) { // Evil merchant starts the gem game all over again
                this.manager.merchantBusy = true;
                this.manager.audio?.playTMStartButton();
                this.moveToEntity(merch, this.manager.props.startLocation, async (result) => {
                    this.manager.merchantBusy = false;
                });
            }
        }
    }
}
// NPC behavior when in GameState.Playing state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGamePlaying extends NPCBehavior {
    constructor(manager) {
        super(manager);
        GameManager_1.gems.forEach((value) => {
            if (value.as(hz.GrabbableEntity)) {
                value.as(hz.GrabbableEntity).setWhoCanGrab([manager.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent).agentPlayer.get(), manager.props.villageElder.as(avatar_ai_agent_1.AvatarAIAgent).agentPlayer.get()]);
            }
        });
    }
    onTransactionDone(ps, gemDelta, coinDelta) {
        if (this.shouldBennyHill()) {
            let gem = this.pickTargetGem();
            this.manager.sendLocalBroadcastEvent(GameManager_1.collectGem, { gem: gem, collector: ps.player });
        }
    }
    updateForPlayer(ps) {
        const ve = this.manager.props.villageElder.as(avatar_ai_agent_1.AvatarAIAgent);
        const merch = this.manager.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent);
        // Have the VE go hunt the target gem
        if (!this.manager.veBusy) {
            let targetGem = this.pickTargetGem();
            if (targetGem) {
                this.manager.veBusy = true;
                this.moveToPosition(ve, this.calcTargetPos(targetGem), (value) => {
                    ve.locomotion.jump().then((value) => {
                        this.manager.veBusy = false;
                        this.manager.async.setTimeout(() => {
                            if (this.manager.currentBehavior != this) { // Force an update to elimate lag for VE celebration
                                this.manager.currentBehavior.updateForPlayer(ps);
                            }
                        }, 1);
                    });
                });
            }
        }
        let collectedGem = this.pickCollectedGem();
        // If gems have been collected, have the merchant put them back
        if (collectedGem && !this.manager.merchantBusy) {
            this.manager.merchantBusy = true;
            // collectedGem.visible.set(false);
            collectedGem.position.set(this.manager.props.gemGrabLocation.position.get());
            this.manager.async.setTimeout(() => {
                collectedGem.visible.set(true);
                this.grabbedGem = collectedGem;
                collectedGem.collidable.set(false);
                merch.grabbableInteraction.grab(hz.Handedness.Right, collectedGem).then(async (result) => {
                    --ps.gemsCollected; // decrement here, collectGem handler will increment if/when necessary
                    console.log("grab " + collectedGem.name.get() + " / " + ps.gemsCollected);
                    GameManager_1.totalGemsCollected.delete(collectedGem.id);
                    this.manager.refreshEconUI();
                    this.moveToEntity(merch, collectedGem.getComponents()[0].props.coursePositionRef, (result) => {
                        let playReplaceVO = false;
                        this.grabbedGem = undefined;
                        if (merch.grabbableInteraction.getGrabbedEntity(hz.Handedness.Right) == collectedGem) { // VE can steal back the gem via collision
                            merch.grabbableInteraction.drop(hz.Handedness.Right);
                            collectedGem?.owner.set(this.manager.world.getServerPlayer());
                            this.manager.async.setTimeout(() => collectedGem.collidable.set(true), 2000);
                            if (this.manager.currentBehavior == this && GameManager_1.totalGemsCollected.size < GameManager_1.gems.length - 1) {
                                this.manager.sendLocalEvent(collectedGem, GameManager_1.moveGemToCourse, { gem: collectedGem });
                                playReplaceVO = true;
                            }
                            else {
                                this.manager.sendLocalBroadcastEvent(GameManager_1.collectGem, { gem: collectedGem, collector: merch.agentPlayer.get() });
                            }
                            if (playReplaceVO) {
                                this.manager.audio?.playTMReplaceGem();
                                merch.locomotion.jump().then((result) => {
                                    this.moveToPosition(merch, this.manager.props.merchantIdleLocation.position.get(), (value) => { this.manager.async.setTimeout(() => this.manager.merchantBusy = false, 10000); });
                                });
                            }
                            else {
                                this.moveToPosition(merch, this.manager.props.merchantIdleLocation.position.get(), (value) => { this.manager.merchantBusy = false; });
                            }
                        }
                        else {
                            this.moveToPosition(merch, this.manager.props.merchantIdleLocation.position.get(), (value) => { this.manager.merchantBusy = false; });
                        }
                    });
                });
            }, 2000); // $$$ default is 2000
        }
    }
    // The shouldBennyHill() behavior is for the Traveling Merchant NPC to grab gems and place them back in gem locations.
    // This behavior is enabled if the number of collected gems is less than the total number of gems in the world, and greater than 0.
    shouldBennyHill() {
        return GameManager_1.totalGemsCollected.size < GameManager_1.gems.length - 1 && GameManager_1.totalGemsCollected.size > 0;
    }
    pickTargetGem() {
        let merch = this.manager.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent);
        let targetGem = GameManager_1.gems.find((value) => !GameManager_1.totalGemsCollected.has(value.id) && this.grabbedGem != value);
        // if(targetGem) console.log("target gem: " + targetGem.name.get() + " at " + targetGem.position.get().toString());
        // else console.log("no target gem found");
        return targetGem;
    }
    pickCollectedGem() {
        if (!this.shouldBennyHill())
            return null;
        let collectedGem = GameManager_1.gems.slice().reverse().find((value) => GameManager_1.totalGemsCollected.has(value.id));
        // if(collectedGem) console.log("collectedGem gem: " + collectedGem.name.get());
        // else console.log("no collectedGem gem found");
        return collectedGem;
    }
}
// NPC behavior when in GameState.Finished state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGameFinished extends NPCBehavior {
    constructor() {
        super(...arguments);
        this.state = 0;
    }
    updateForPlayer(ps) {
        // VE celebration
        if (!this.manager.veBusy && this.state == 0) {
            this.manager.veBusy = true;
            const ve = this.manager.props.villageElder.as(avatar_ai_agent_1.AvatarAIAgent);
            this.manager.audio?.playVEThanks();
            ve.locomotion.jump().then(() => {
                this.moveToPosition(ve, hz.Vec3.zero, (value) => { this.manager.veBusy = false; });
                this.state = 1;
            });
        }
        if (this.manager.merchantBusy || this.state == 0) {
            return;
        }
        // Send the merchant to the winning player
        this.manager.merchantBusy = true;
        const merch = this.manager.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent);
        ps = this.getWinningPlayer();
        this.moveToEntity(merch, ps.player, async (result) => {
            this.manager.audio?.playTMResetButton();
            await merch.locomotion.jump();
            // Reset the game
            this.moveToEntity(merch, this.manager.props.resetLocation, async (result) => {
                await merch.locomotion.jump();
                // console.log("merch done reset");
                this.manager.audio?.playTMAfterReset();
                this.manager.merchantBusy = false;
            });
        });
    }
    getWinningPlayer() {
        let ps = this.manager.playerMap.values().next().value;
        this.manager.playerMap.forEach(element => {
            if (element.gemsCollected > ps.gemsCollected) {
                ps = element;
            }
        });
        return ps;
    }
}
// class for managing the two NPC characters (villegeElder entity and merchant entity) in the world.
// setup inclues:
// * spawn in NPCs
// * initialize and bake navigation mesh for NPCs to use
// * Set up audio asets
// * Set up listeners for change of game states or when a gem is collected.
class NPCManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.playerMap = new Map();
        this.veBusy = false;
        this.merchantBusy = false;
        this.currentBehavior = new NullNPCBehavior(this);
        this.updateId = 0;
    }
    async preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => this.handleOnPlayerEnter(player));
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => this.handleOnPlayerExit(player));
        if (this.props.villageElder) {
            const ve = this.props.villageElder?.as(avatar_ai_agent_1.AvatarAIAgent);
            ve.spawnAgentPlayer().then((spawnResult) => this.onSpawnResult(spawnResult, ve));
        }
        if (this.props.merchant) {
            const merch = this.props.merchant?.as(avatar_ai_agent_1.AvatarAIAgent);
            merch.spawnAgentPlayer().then((spawnResult) => this.onSpawnResult(spawnResult, merch));
        }
        const navMeshManager = navmesh_1.default.getInstance(this.world);
        const navMesh = await navMeshManager.getByName("NPC");
        if (navMesh == null) {
            console.error("Could not find navMesh: NPC");
            return;
        }
        ;
        this.navMesh = navMesh;
        // Get status of navigation mesh baking. Wait until complete.
        const bake = this.navMesh.getStatus().currentBake;
        if (bake != null) {
            await bake;
        }
        ;
        console.log("Bake complete!");
    }
    onSpawnResult(spawnResult, avatar) {
    }
    start() {
        this.audio = this.props.audioBank?.getComponents()[0];
        DataStore.dataStore.setData('NPCManager', this);
        this.connectLocalBroadcastEvent(GameManager_1.gameStateChanged, (payload) => this.onGameStateChanged(payload.state));
        this.connectLocalBroadcastEvent(GameManager_1.collectGem, (payload) => this.onGemCollected(payload.gem, payload.collector));
        this.currentBehavior = new NPCBehaviorGameReady(this);
        this.audio?.playVEIntro(); // Get some attention and then start the game
        this.updateId = this.async.setInterval(() => this.onUpdate(), 10000);
    }
    onUpdate() {
        if (this.currentBehavior && this.playerMap.size > 0) {
            this.currentBehavior.updateForPlayer(this.playerMap.values().next().value);
        }
        else {
            console.warn("onUpdate noop");
        }
    }
    handleOnPlayerExit(player) {
        let ps = this.playerMap.get(player.id);
        if (ps) {
            this.playerMap.delete(player.id);
        }
    }
    handleOnPlayerEnter(player) {
        if (!player || (0, Utils_1.isNPC)(player)) {
            let ps = this.playerMap.get(player.id);
            if (ps) {
                this.playerMap.delete(player.id);
            }
            return;
        }
        else if (!this.playerMap.has(player.id)) {
            let ps = new PlayerState({ player: player });
            this.playerMap.set(player.id, ps);
        }
    }
    onGameStateChanged(gameState) {
        switch (gameState) {
            case GameManager_1.GameState.Playing:
                this.currentBehavior = new NPCBehaviorGamePlaying(this);
                // 250110 SPO Added
                this.audio?.playVEStartButton();
                break;
            case GameManager_1.GameState.Finished:
                this.playerMap.forEach((value) => {
                    value.coins += 4;
                    value.gemQuestCompleted = true;
                });
                this.refreshEconUI();
                this.currentBehavior = new NPCBehaviorGameFinished(this);
                break;
            default:
                this.currentBehavior = new NPCBehaviorGameReady(this);
                break;
        }
    }
    onGemCollected(gem, collector) {
        const merch = this.props.merchant.as(avatar_ai_agent_1.AvatarAIAgent);
        if (merch.grabbableInteraction.getGrabbedEntity(hz.Handedness.Right) == gem) {
            merch.grabbableInteraction.drop(hz.Handedness.Right);
            gem.owner.set(this.world.getServerPlayer());
            this.audio?.playVEInterference();
        }
        else {
            if (GameManager_1.gems.length > GameManager_1.totalGemsCollected.size) {
                this.audio?.playVECollectGem(); // Otherwise we collide with playVEThanks
            }
        }
        let ps = this.playerMap.get(collector.id);
        if (!ps) {
            ps = this.playerMap.values().next().value;
        }
        if (ps) {
            ps.gemsCollected++;
            console.log("onGemCollected " + gem.name.get() + " / " + collector.name.get() + " / " + ps.gemsCollected);
            if ((ps.gemsCollected >= 1) && (ps.player.hasCompletedAchievement('QuestCollect1Gem') == false)) {
                this.sendLocalBroadcastEvent(QuestManager_1.questComplete, { player: ps.player, questName: QuestManager_1.QuestNames.QuestCollect1Gem });
            }
            else if ((ps.gemsCollected >= 5) && (ps.player.hasCompletedAchievement('QuestCollect5Gems') == false)) {
                this.sendLocalBroadcastEvent(QuestManager_1.questComplete, { player: ps.player, questName: QuestManager_1.QuestNames.QuestCollect5Gems });
            }
            this.currentBehavior.updateForPlayer(ps);
        }
        this.refreshEconUI();
    }
    onTransactionDone(ps, GemDelta, CoinDelta) {
        this.audio?.playTMTransactionDone();
        this.currentBehavior.onTransactionDone(ps, GemDelta, CoinDelta);
    }
    refreshEconUI() {
        const EconUIs = DataStore.dataStore.getData('EconomyUIs');
        let ps = this.playerMap.values().next().value;
        if (ps) {
            if ((0, Utils_1.isNPC)(ps.player))
                console.error('Bugcheck: NPC getting counted as a human?? ' + ps.player.name.get());
            EconUIs[0].refresh(ps.player); // Only 1 econ billboard, so only refresh the first human player
        }
    }
}
exports.NPCManager = NPCManager;
NPCManager.propsDefinition = {
    villageElder: { type: hz.PropTypes.Entity },
    merchant: { type: hz.PropTypes.Entity },
    resetLocation: { type: hz.PropTypes.Entity },
    startLocation: { type: hz.PropTypes.Entity },
    audioBank: { type: hz.PropTypes.Entity },
    merchantIdleLocation: { type: hz.PropTypes.Entity },
    gemGrabLocation: { type: hz.PropTypes.Entity }
};
hz.Component.register(NPCManager);
