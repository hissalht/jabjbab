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
      case CharacterState.WALKING_FORWARD:
        Position.x[eid] +=
          5 * (Character.direction[eid] === CharacterDirection.LEFT ? -1 : 1);
        break;

      case CharacterState.WALKING_BACKWARD:
        Position.x[eid] +=
          5 * (Character.direction[eid] === CharacterDirection.LEFT ? 1 : -1);
        break;

      case CharacterState.NEUTRAL:
      default:
      // Nothing to do
    }
  }
  return world;
};
