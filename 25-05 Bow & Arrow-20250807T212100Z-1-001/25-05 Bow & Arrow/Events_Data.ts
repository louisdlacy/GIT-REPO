import { Entity, NetworkEvent } from "horizon/core";



export const events = {
  networked: {
    requestArrow: new NetworkEvent<{ requester: Entity }>('requestArrow'),
    yourArrowIs: new NetworkEvent<{ arrow: Entity }>('yourArrowIs'),
  },
  local: {

  },
}