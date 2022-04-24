import { defineQuery } from "bitecs";
import {
  Character,
  CharacterDirection,
  CharacterState,
} from "../components/Character";
import { Position } from "../components/Position";
import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

const movableQuery = defineQuery([Character, Position]);

export const MovementSystem: JabjabSystem = function (world: JabjabWorld) {
  for (const eid of movableQuery(world)) {
    switch (Character.state[eid]) {
      case CharacterState.WALK_FORWARD:
        Position.x[eid] +=
          5 * (Character.direction[eid] === CharacterDirection.LEFT ? -1 : 1);
        break;

      case CharacterState.WALK_BACKWARD:
        Position.x[eid] +=
          5 * (Character.direction[eid] === CharacterDirection.LEFT ? 1 : -1);
        break;

      case CharacterState.IDLE:
      default:
      // Nothing to do
    }
  }
  return world;
};
