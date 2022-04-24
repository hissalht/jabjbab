import { defineQuery } from "bitecs";
import {
  Character,
  CharacterDirection,
  CharacterState,
} from "../components/Character";
import { JabjabSystem } from "../JabjabSystem";

// TODO: handle character state transition with state machine ?

const characterQuery = defineQuery([Character]);

export const ActionSystem: JabjabSystem = (world) => {
  for (const eid of characterQuery(world)) {
    const playerId = Character.playerId[eid] as 0 | 1;

    if (world.inputs[playerId].left === world.inputs[playerId].right) {
      Character.state[eid] = CharacterState.NEUTRAL;
    } else if (world.inputs[playerId].left) {
      Character.state[eid] =
        Character.direction[eid] === CharacterDirection.LEFT
          ? CharacterState.WALKING_FORWARD
          : CharacterState.WALKING_BACKWARD;
    } else if (world.inputs[playerId].right) {
      Character.state[eid] =
        Character.direction[eid] === CharacterDirection.RIGHT
          ? CharacterState.WALKING_FORWARD
          : CharacterState.WALKING_BACKWARD;
    }
  }

  return world;
};
