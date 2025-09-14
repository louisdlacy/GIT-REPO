/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This script orhcestrates behaviors of the NPCs in the world.

 */

import * as hz from 'horizon/core';
import { gameStateChanged, setGameState, collectGem, GameState, gems, totalGemsCollected, moveGemToCourse } from 'GameManager';
import { AgentGrabActionResult, AgentGrabbableInteraction, AgentLocomotionResult, AgentSpawnResult, AvatarAIAgent } from 'horizon/avatar_ai_agent';
import NavMeshManager, { NavMesh, NavMeshBakeInfo, NavMeshPath } from 'horizon/navmesh';
import { GemController } from 'GemController';
import { QuestNames, questComplete } from 'QuestManager';
import { isNPC } from 'Utils';
// $$$ SPO Added.
import { merchantTakesGem } from 'GameManager';
// import { refreshScore } from 'EconomyUI';

import * as DataStore from 'DataStore';
import * as EconomyUI from 'EconomyUI';
import { NPCAudioPlayback } from 'NPCAudioPlayback';

export class PlayerState {
  public player!: hz.Player;
  public gemsCollected : number = 0;
  public coins : number = 0;
  public redGems : number = 0;
  public gemQuestCompleted : boolean = false;

  public constructor(init?:Partial<PlayerState>) {
    Object.assign(this, init);
  }
}

const hiddenLocation = new hz.Vec3(0, -100, 0);

// abstract class that governs NPC behavior. Functions within the class define NPC capabilities and map to API endpoints.
// This class is extended in other classes in this script.

abstract class NPCBehavior {
  public abstract updateForPlayer(ps : PlayerState) : void;
  public onTransactionDone(ps : PlayerState, gemDelta:number, coinDelta:Number){};
  manager!: NPCManager;

  public constructor(manager : NPCManager) {
    this.manager = manager;
  }

  // Uses referenced NavMesh to return a set of Vec3 waypoints for a path between the from: and to: parameters.
  public getPathTo(from : hz.Vec3, to : hz.Vec3) : Array<hz.Vec3> {
    let nextPath: NavMeshPath | null;

    let getPathAttempts: number = 0;
    do {
      nextPath = this.manager.navMesh.getPath(from, to);
      getPathAttempts++;
      to.y = from.y;
    } while (nextPath == null && getPathAttempts < 20);
    if (nextPath == null) {
      return new Array<hz.Vec3>();
    }
    return nextPath.waypoints;
  }

  // Managements movement for the NPC from its current location to a provided destination: Vec3 location.
  // Calls to getPath() to return waypoints, which are passed to the NPC methods rotateTo() and moveToPositions()
  protected moveToPosition(
    agent : AvatarAIAgent,
    destination : hz.Vec3,
    onfulfilled?:((value: AgentLocomotionResult) => void | PromiseLike<void>) | null | undefined,
    onrejected?:((reason:any) => void | PromiseLike<never>) | null | undefined) : Promise<void> {

    let agentPos = agent.agentPlayer!.get()?.foot.getPosition(hz.Space.World)!; //agent.position.get();

    let navmeshStart = this.manager.navMesh!.getNearestPoint(agentPos, .3);
    if(navmeshStart) {
      agentPos = navmeshStart;
    }
    let navmeshDest = this.manager.navMesh!.getNearestPoint(destination, .3);
    if(navmeshDest) {
      destination = navmeshDest;
    }

    let path = this.getPathTo(agentPos, destination);
    return agent.locomotion.rotateTo(destination.sub(agentPos)).then( (value: AgentLocomotionResult) => agent.locomotion.moveToPositions(path).then(onfulfilled, onrejected));
  }

  // If an NPC is targeting an hz.Player entity, this method returns the position of the entity's foot as a proxy for the location.
  protected calcTargetPos(target : hz.Entity | hz.Player) : hz.Vec3 {

    let targetPos = target.position.get();
    if(target instanceof hz.Player) {
      targetPos = target.foot.getPosition(hz.Space.World);
    } else if (targetPos.distance(hiddenLocation) > 4) {
      targetPos = new hz.Vec3(targetPos.x, 0, targetPos.z); // fudge for foot height for gems
    }
    return targetPos;
  }

  // Follow a moving target: this method attempts to compensate for moving targets when calculating targeting position.
  protected moveToEntity(
    agent : AvatarAIAgent,
    target : hz.Entity | hz.Player,
    onfulfilled?:((value: AgentLocomotionResult) => void | PromiseLike<void>) | null | undefined,
    onrejected?:((reason:any) => void | PromiseLike<never>) | null | undefined) : Promise<void> {

    const epsilon = 1.5;
    let targetPos = this.calcTargetPos(target);
    let dest = targetPos.clone();

    if(target instanceof hz.Player) {
      dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
    }

    return new Promise<void>(async () => {
      let result = AgentLocomotionResult.Error;
      let rejected = false;

      const maxTries = 5;
      let numTries = 0;
      let agentPos = agent.agentPlayer.get()!.position.get();
      let dist = agentPos.distance(dest);

      while(dist > epsilon) {

        if(numTries > maxTries) {
          rejected = true;
          break;
        }

        if(targetPos.distance(hiddenLocation) < 4) {
          await new Promise((resolve) => this.manager.async.setTimeout(resolve, 1000));
          numTries = Math.max(numTries, maxTries - 1); // Only 1 retry in this state
        } else {
          await this.moveToPosition(agent, dest, (value : AgentLocomotionResult) => {result = value});
        }

        ++numTries;

        targetPos = this.calcTargetPos(target);
        dest = targetPos.clone();
        if(target instanceof hz.Player) {
          dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
        }
        agentPos = agent.agentPlayer.get()!.position.get();
        dist = agentPos.distance(dest);
        if(dist < epsilon) {
          targetPos = this.calcTargetPos(target);
          dest = targetPos.clone();
          if(target instanceof hz.Player) {
            dest.addInPlace(hz.Vec3.mul(target.forward.get(), 2));
          }
          agentPos = agent.agentPlayer.get()!.position.get();
          dist = agentPos.distance(dest);
          agent.lookAt(targetPos);
        }
      }

      if(rejected) {
        if(onrejected) {
          onrejected(AgentLocomotionResult.Error);
        } else if(onfulfilled) {
          onfulfilled(AgentLocomotionResult.Error);
        }
      } else {
        if(onfulfilled) {
          onfulfilled(result);
        }
      }
    });
  }
}

// null class is used to define the CurrentBehavior object until it can be defined during initialization of each NPC.
class NullNPCBehavior extends NPCBehavior {
  public updateForPlayer(ps: PlayerState): void {
    console.log("NullNPCBehavior");
  }
}

// NPC behavior when in GameState.Ready state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGameReady extends NPCBehavior {

  private merchState : number = -1;

  public onTransactionDone(ps: PlayerState, gemDelta: number, coinDelta: Number): void {
    if(ps.coins <= 0 || ps.gemsCollected <= 0) {
      this.merchState = 2;
    }
  }

  updateForPlayer(ps : PlayerState) {

    const ve: AvatarAIAgent = this.manager.props.villageElder!.as(AvatarAIAgent);
    // New player?
    if(!this.manager.veBusy && !ps.gemQuestCompleted && ps.gemsCollected == 0) {
      if(!ve.locomotion.isMoving.get()) {
        // Go to the human player
        this.manager.veBusy = true;
        this.moveToEntity(ve, ps.player,
          (value:AgentLocomotionResult) => {
            this.manager.audio?.playVEWelcome();  // Get some attention and then start the game
            ve.locomotion.jump().then((value:AgentLocomotionResult) =>
              this.manager.async.setTimeout( () => {
                this.moveToEntity(ve, this.manager.props.startLocation!,
                  (value:AgentLocomotionResult) => {this.manager.veBusy = false})
              }, 3000));
          }
        );
      }
    }
    else if(ps.gemQuestCompleted && this.merchState != 2) {
      this.merchState = 0;
    }

    const merch : AvatarAIAgent = this.manager.props.merchant!.as(AvatarAIAgent);
    if(!this.manager.merchantBusy) {
      if(this.merchState == 0) {        // Go sell some gems
        this.manager.merchantBusy = true;
        this.moveToEntity(merch, this.manager.props.merchantIdleLocation!, (result : AgentLocomotionResult) => {
          this.manager.merchantBusy = false;
          if(ps.player.position.get().distance(merch.position.get()) < 10) {
            if(ps.coins > 0) {
              this.manager.audio?.playTMWelcomeMoney();
            } else {
              this.manager.audio?.playTMWelcomeNoMoney();
            }
          }
          this.merchState = 1;
        });
      } else if(this.merchState == 2) {  // Evil merchant starts the gem game all over again
        this.manager.merchantBusy = true;
        this.manager.audio?.playTMStartButton();
        this.moveToEntity(merch, this.manager.props.startLocation!, async (result : AgentLocomotionResult) => {
          this.manager.merchantBusy = false;
        })
      }

    }
  }
}

// NPC behavior when in GameState.Playing state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGamePlaying extends NPCBehavior {

  private grabbedGem : hz.Entity | undefined;

  public constructor(manager : NPCManager) {
    super(manager);
    gems.forEach((value : hz.Entity) => {
      if(value.as(hz.GrabbableEntity)) {
        value.as(hz.GrabbableEntity).setWhoCanGrab(
          [manager.props.merchant!.as(AvatarAIAgent).agentPlayer.get()!, manager.props.villageElder!.as(AvatarAIAgent).agentPlayer.get()!])
      }
    })
  }

  public onTransactionDone(ps : PlayerState, gemDelta:number, coinDelta:Number){
    if(this.shouldBennyHill()) {
      let gem = this.pickTargetGem();
      this.manager.sendLocalBroadcastEvent( collectGem, { gem : gem!, collector : ps.player } );
    }
  }

  public updateForPlayer(ps: PlayerState): void {

    const ve: AvatarAIAgent = this.manager.props.villageElder!.as(AvatarAIAgent);
    const merch : AvatarAIAgent = this.manager.props.merchant!.as(AvatarAIAgent);

    // Have the VE go hunt the target gem
    if(!this.manager.veBusy) {
      let targetGem = this.pickTargetGem();
      if(targetGem) {
        this.manager.veBusy = true;
        this.moveToPosition(ve, this.calcTargetPos(targetGem),
          (value:AgentLocomotionResult) => {
            ve.locomotion.jump().then((value:AgentLocomotionResult) =>
              {
                this.manager.veBusy = false;
                this.manager.async.setTimeout(() => {
                  if(this.manager.currentBehavior != this) {  // Force an update to elimate lag for VE celebration
                      this.manager.currentBehavior.updateForPlayer(ps)
                    }
                  }, 1);
              });
          }
        )
      }
    }

    let collectedGem = this.pickCollectedGem();
    // If gems have been collected, have the merchant put them back
    if(collectedGem && !this.manager.merchantBusy) {
      this.manager.merchantBusy = true;
      // collectedGem.visible.set(false);
      collectedGem.position.set(this.manager.props.gemGrabLocation!.position.get());

      this.manager.async.setTimeout(() => {
        collectedGem!.visible.set(true);
        this.grabbedGem = collectedGem!;
        collectedGem!.collidable.set(false);
        merch.grabbableInteraction.grab(hz.Handedness.Right, collectedGem!).then(async (result: AgentGrabActionResult) => {
          --ps.gemsCollected; // decrement here, collectGem handler will increment if/when necessary
          console.log("grab " + collectedGem!.name.get() + " / " + ps.gemsCollected);
          totalGemsCollected.delete(collectedGem!.id);
          this.manager.refreshEconUI();

          this.moveToEntity(merch, collectedGem!.getComponents<GemController>()[0].props.coursePositionRef!, (result: AgentLocomotionResult) => {
            let playReplaceVO = false;
            this.grabbedGem = undefined;
            if(merch.grabbableInteraction.getGrabbedEntity(hz.Handedness.Right) == collectedGem) { // VE can steal back the gem via collision
              merch.grabbableInteraction.drop(hz.Handedness.Right);
              collectedGem?.owner.set(this.manager.world.getServerPlayer());
              this.manager.async.setTimeout(() => collectedGem!.collidable.set(true), 2000);
              if(this.manager.currentBehavior == this && totalGemsCollected.size < gems.length - 1) {
                this.manager.sendLocalEvent( collectedGem!, moveGemToCourse, { gem : collectedGem! } );
                playReplaceVO = true;
              } else {
                this.manager.sendLocalBroadcastEvent( collectGem, { gem : collectedGem!, collector : merch.agentPlayer.get()! } );
              }
              if(playReplaceVO) {
                this.manager.audio?.playTMReplaceGem();
                merch.locomotion.jump().then((result:AgentLocomotionResult) => {
                  this.moveToPosition(merch, this.manager.props.merchantIdleLocation!.position.get(), (value:AgentLocomotionResult) =>
                    {this.manager.async.setTimeout(() => this.manager.merchantBusy = false, 10000)});
                })
              }
              else {
                this.moveToPosition(merch, this.manager.props.merchantIdleLocation!.position.get(), (value:AgentLocomotionResult) =>
                  {this.manager.merchantBusy = false;});
              }
            }
            else {
              this.moveToPosition(merch, this.manager.props.merchantIdleLocation!.position.get(), (value:AgentLocomotionResult) =>
                {this.manager.merchantBusy = false;});
            }
          });
        });
      }, 2000); // $$$ default is 2000
    }

  }

  // The shouldBennyHill() behavior is for the Traveling Merchant NPC to grab gems and place them back in gem locations.
  // This behavior is enabled if the number of collected gems is less than the total number of gems in the world, and greater than 0.
  public shouldBennyHill() : boolean {
    return totalGemsCollected.size < gems.length - 1 && totalGemsCollected.size > 0;
  }

  public pickTargetGem() : hz.Entity | null | undefined {
    let merch = this.manager.props.merchant!.as(AvatarAIAgent);
    let targetGem = gems.find((value) => !totalGemsCollected.has(value.id) && this.grabbedGem != value);
    // if(targetGem) console.log("target gem: " + targetGem.name.get() + " at " + targetGem.position.get().toString());
    // else console.log("no target gem found");
    return targetGem;
  }

  public pickCollectedGem() : hz.Entity | null | undefined {
    if(!this.shouldBennyHill()) return null;
    let collectedGem = gems.slice().reverse().find((value) => totalGemsCollected.has(value.id));
    // if(collectedGem) console.log("collectedGem gem: " + collectedGem.name.get());
    // else console.log("no collectedGem gem found");
    return collectedGem;
  }

}

// NPC behavior when in GameState.Finished state of the world. Overrides to base NPCBehavior class are defined here for this gamestate.
class NPCBehaviorGameFinished extends NPCBehavior {

  private state : number = 0;

  public updateForPlayer(ps: PlayerState): void {

    // VE celebration
    if(!this.manager.veBusy && this.state == 0) {
      this.manager.veBusy = true;
      const ve: AvatarAIAgent = this.manager.props.villageElder!.as(AvatarAIAgent);
      this.manager.audio?.playVEThanks();
      ve.locomotion.jump().then(() => {
        this.moveToPosition(ve, hz.Vec3.zero, (value:AgentLocomotionResult) => { this.manager.veBusy = false; })
        this.state = 1;
      });
    }

    if(this.manager.merchantBusy || this.state == 0) {
      return;
    }

    // Send the merchant to the winning player
    this.manager.merchantBusy = true;
    const merch : AvatarAIAgent = this.manager.props.merchant!.as(AvatarAIAgent);
    ps = this.getWinningPlayer();
    this.moveToEntity(merch, ps.player, async (result : AgentLocomotionResult) => {
      this.manager.audio?.playTMResetButton();
      await merch.locomotion.jump();
        // Reset the game
      this.moveToEntity(merch, this.manager.props.resetLocation!,
        async (result : AgentLocomotionResult) => {
          await merch.locomotion.jump();
          // console.log("merch done reset");
          this.manager.audio?.playTMAfterReset()
          this.manager.merchantBusy = false;
      })
    });
  }

  public getWinningPlayer() : PlayerState {
    let ps = this.manager.playerMap.values().next().value!;
    this.manager.playerMap.forEach(element => {
      if(element.gemsCollected > ps.gemsCollected) {
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
export class NPCManager extends hz.Component<typeof NPCManager> {
  static propsDefinition = {
    villageElder: {type: hz.PropTypes.Entity!},
    merchant: {type: hz.PropTypes.Entity!},
    resetLocation: {type: hz.PropTypes.Entity!},
    startLocation: {type: hz.PropTypes.Entity!},
    audioBank: {type: hz.PropTypes.Entity!},
    merchantIdleLocation: {type: hz.PropTypes.Entity!},
    gemGrabLocation: {type: hz.PropTypes.Entity!}
  };

  public playerMap: Map<number, PlayerState> = new Map<number, PlayerState>();
  public navMesh!: NavMesh;
  public veBusy : boolean = false;
  public merchantBusy : boolean = false;

  public currentBehavior : NPCBehavior = new NullNPCBehavior(this);
  private updateId : Number = 0;

  public audio? : NPCAudioPlayback;

  async preStart() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld, 
        (player: hz.Player) => this.handleOnPlayerEnter(player));

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitWorld,
      (player: hz.Player) => this.handleOnPlayerExit(player));

    if (this.props.villageElder) {
      const ve: AvatarAIAgent = this.props.villageElder?.as(AvatarAIAgent);
      ve.spawnAgentPlayer().then((spawnResult) => this.onSpawnResult(spawnResult, ve));
    }
    if (this.props.merchant) {
      const merch: AvatarAIAgent = this.props.merchant?.as(AvatarAIAgent);
      merch.spawnAgentPlayer().then((spawnResult) => this.onSpawnResult(spawnResult, merch));
    }

    const navMeshManager = NavMeshManager.getInstance(this.world);
    const navMesh = await navMeshManager.getByName("NPC");
    if (navMesh == null) {
      console.error("Could not find navMesh: NPC");
      return;
    };
    this.navMesh = navMesh;

    // Get status of navigation mesh baking. Wait until complete.
    const bake = this.navMesh.getStatus().currentBake;
    if (bake != null) {
      await bake;
    };
    console.log("Bake complete!");
  }

  private onSpawnResult(spawnResult: AgentSpawnResult, avatar : AvatarAIAgent): void {
  }

  start() {
    this.audio = this.props.audioBank?.getComponents<NPCAudioPlayback>()[0];

    DataStore.dataStore.setData('NPCManager',this)

    this.connectLocalBroadcastEvent(
      gameStateChanged,
      (payload: {state : GameState}) => this.onGameStateChanged(payload.state));


    this.connectLocalBroadcastEvent(
      collectGem,
      (payload: {gem: hz.Entity, collector: hz.Player}) => this.onGemCollected(payload.gem, payload.collector));

    this.currentBehavior = new NPCBehaviorGameReady(this);
    this.audio?.playVEIntro();  // Get some attention and then start the game
    this.updateId = this.async.setInterval(() => this.onUpdate(), 10000);
  }

  private onUpdate() : void {
    if(this.currentBehavior && this.playerMap.size > 0) {
      this.currentBehavior.updateForPlayer(this.playerMap.values().next().value!);
    } else {
      console.warn("onUpdate noop");
    }
  }

  private handleOnPlayerExit(player: hz.Player): void {
    let ps = this.playerMap.get(player.id);
    if (ps) {
      this.playerMap.delete(player.id);
    }
  }

  private handleOnPlayerEnter(player: hz.Player): void {
    if(!player || isNPC(player)) {
      let ps = this.playerMap.get(player.id);
      if (ps) {
        this.playerMap.delete(player.id);
      }
      return;
    }
    else if (!this.playerMap.has(player.id)) {
      let ps = new PlayerState({ player : player });
      this.playerMap.set(player.id, ps);
    }
  }

  private onGameStateChanged(gameState : GameState) : void {
    switch(gameState) {
      case GameState.Playing:
        this.currentBehavior = new NPCBehaviorGamePlaying(this);
        // 250110 SPO Added
        this.audio?.playVEStartButton()
        break;
      case GameState.Finished:
        this.playerMap.forEach((value:PlayerState) =>  {
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

  private onGemCollected(gem: hz.Entity, collector: hz.Player): void {

    const merch : AvatarAIAgent = this.props.merchant!.as(AvatarAIAgent);
    if(merch.grabbableInteraction.getGrabbedEntity(hz.Handedness.Right) == gem) {
      merch.grabbableInteraction.drop(hz.Handedness.Right);
      gem.owner.set(this.world.getServerPlayer());
      this.audio?.playVEInterference();
    } else {
      if(gems.length > totalGemsCollected.size) {
        this.audio?.playVECollectGem(); // Otherwise we collide with playVEThanks
      }
    }
    let ps = this.playerMap.get(collector.id);
    if(!ps) {
      ps = this.playerMap.values().next().value;
    }
    if(ps) {
        ps.gemsCollected++;
        console.log("onGemCollected " + gem.name.get() + " / " + collector.name.get() + " / " + ps.gemsCollected);
        if ((ps.gemsCollected >= 1) && (ps.player.hasCompletedAchievement('QuestCollect1Gem') == false)) {
          this.sendLocalBroadcastEvent( questComplete, {player: ps.player, questName: QuestNames.QuestCollect1Gem } );
        } else if ((ps.gemsCollected >= 5) && (ps.player.hasCompletedAchievement('QuestCollect5Gems') == false)) {
          this.sendLocalBroadcastEvent( questComplete, {player: ps.player, questName: QuestNames.QuestCollect5Gems } );
        }
      this.currentBehavior.updateForPlayer(ps);
    }
    this.refreshEconUI();
  }

  public onTransactionDone(ps : PlayerState, GemDelta : number, CoinDelta : number) : void {
    this.audio?.playTMTransactionDone();
    this.currentBehavior.onTransactionDone(ps, GemDelta, CoinDelta);
  }

  public refreshEconUI() : void {
    const EconUIs = DataStore.dataStore.getData('EconomyUIs') as (Array<EconomyUI.EconomyUI>)
    let ps = this.playerMap.values().next().value;
    if(ps) {
      if(isNPC(ps.player)) console.error('Bugcheck: NPC getting counted as a human?? ' + ps.player.name.get());
      EconUIs[0].refresh(ps.player);  // Only 1 econ billboard, so only refresh the first human player
    }
  }
}

hz.Component.register(NPCManager);
