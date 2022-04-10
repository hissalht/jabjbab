import { defineQuery } from "bitecs";
import { Controllable } from "../components/Controllable";
import { Position } from "../components/Position";
import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

const movableQuery = defineQuery([Controllable, Position]);

export const MovementSystem: JabjabSystem = function (world: JabjabWorld) {
  const eids = movableQuery(world);
  for (const eid of eids) {
    const playerId = Controllable.playerId[eid] as 0 | 1;
    // debugger;
    if (world.inputs[playerId].left) {
      Position.x[eid] -= 5;
    }
    if (world.inputs[playerId].right) {
      Position.x[eid] += 5;
    }
    if (world.inputs[playerId].up) {
      Position.y[eid] -= 5;
    }
    if (world.inputs[playerId].down) {
      Position.y[eid] += 5;
    }
  }
  return world;
};
