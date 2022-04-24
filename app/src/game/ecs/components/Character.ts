import { defineComponent, Types } from "bitecs";

export enum CharacterState {
  IDLE = 0,
  WALK_FORWARD = 1,
  WALK_BACKWARD = 2,
  NEUTRAL_JUMP = 3,
}

export enum CharacterDirection {
  LEFT = 0,
  RIGHT = 1,
}

export const Character = defineComponent({
  playerId: Types.ui8,
  state: Types.ui8,
  direction: Types.ui8,
});
