import { AvatarAIAgent } from "horizon/avatar_ai_agent";
import { CodeBlockEvents, Component, Player, PropTypes, Vec3 } from "horizon/core";
import NavMeshManager, { NavMesh } from "horizon/navmesh";


class AvatarNPCs_Entity extends Component<typeof AvatarNPCs_Entity> {
  static propsDefinition = {
    destination: { type: PropTypes.Entity },
    detectJump: { type: PropTypes.Boolean, default: false },
  };

  destination = Vec3.zero;

  prevPos = Vec3.zero;

  navMesh: NavMesh | undefined;

  async preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
  
    const navMeshManager = NavMeshManager.getInstance(this.world);
    this.navMesh = await navMeshManager.getByName('NPC') ?? undefined;

    if (this.navMesh) {
      this.navMesh.rebake();
    }
    else {
      console.log('navMesh not found');
    }
  }

  start() {
    if (this.props.destination) {
      this.destination = this.props.destination.position.get();
    }
  }

  playerEnterWorld(player: Player) {
    if (this.entity === AvatarAIAgent.getGizmoFromPlayer(player)) {
      const positions = this.navMesh?.getPath(player.position.get(), this.destination)?.waypoints;

      this.entity.as(AvatarAIAgent).locomotion.moveToPositions(positions ?? [this.destination]);

      if (this.props.detectJump) {
        this.async.setInterval(() => { this.loop(player); }, 500);
      }
    }
  }

  loop(npcPlayer: Player) {
    const distanceVec = this.destination.sub(npcPlayer.position.get());
    const distanceWithoutY = distanceVec.componentMul(new Vec3(1,0,1)).magnitude();

    const curPos = npcPlayer.position.get();
    const distanceMoved = curPos.distance(this.prevPos);
    this.prevPos = curPos;

    const isAtDest = distanceWithoutY < 0.25;
    const isStagnant = distanceMoved < 0.25;
    
    if (isStagnant && !isAtDest) {
      this.entity.as(AvatarAIAgent).locomotion.jump();
    }
  }
}
Component.register(AvatarNPCs_Entity);