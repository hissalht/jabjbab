import { defineComponent, Types } from "bitecs";

export enum CharacterState {
  NEUTRAL = 0,
  WALKING_FORWARD = 1,
  WALKING_BACKWARD = 2,
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
