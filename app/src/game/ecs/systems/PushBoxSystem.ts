import { defineQuery } from "bitecs";
import { Character, CharacterState } from "../components/Character";
import { Position, PositionOffset } from "../components/Position";
import { PushBox } from "../components/PushBox";
import { Rectangle } from "../components/Rectangle";
import { JabjabSystem } from "../JabjabSystem";

function checkRectanglesCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  if (x1 + w2 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
    return true;
  }
  return false;
}

const pushBoxQuery = defineQuery([PushBox, Rectangle, PositionOffset]);

export const PushBoxSystem: JabjabSystem = (world) => {
  const [pb1, pb2] = pushBoxQuery(world);

  const characterId1 = PushBox.characterId[pb1];
  const x1 = Position.x[characterId1] + PositionOffset.x[pb1];
  const y1 = Position.y[characterId1] + PositionOffset.y[pb1];
  const w1 = Rectangle.w[pb1];
  const h1 = Rectangle.h[pb1];
  const cx1 = x1 + w1 / 2;
  // const cy1 = y1 + h1 / 2;

  const characterId2 = PushBox.characterId[pb2];
  const x2 = Position.x[characterId2] + PositionOffset.x[pb2];
  const y2 = Position.y[characterId2] + PositionOffset.y[pb2];
  const w2 = Rectangle.w[pb2];
  const h2 = Rectangle.h[pb2];
  const cx2 = x2 + w2 / 2;
  // const cy2 = y2 + h2 / 2;

  if (checkRectanglesCollision(x1, y1, w1, h1, x2, y2, w2, h2)) {
    console.log("COLLISION");
    // if both characters are walking forward, they shouldnt move
    if (
      Character.state[characterId1] === CharacterState.WALK_FORWARD &&
      Character.state[characterId2] === CharacterState.WALK_FORWARD
    ) {
      // nothing
    }

    // if left char is walking forward, left should push right
    else if (Character.state[characterId1] === CharacterState.WALK_FORWARD) {
      Position.x[characterId1] += cx1 < cx2 ? -2 : 2;
      Position.x[characterId2] += cx1 < cx2 ? 3 : -3;
    }

    // if right char is walking forward, right should push left
    else if (Character.state[characterId2] === CharacterState.WALK_FORWARD) {
      Position.x[characterId1] += cx1 < cx2 ? -3 : 3;
      Position.x[characterId2] += cx1 < cx2 ? 2 : -2;
    }

    // if no one is walking forward, both character should push each other away
    else {
      Position.x[characterId1] += cx1 < cx2 ? -1.5 : 1.5;
      Position.x[characterId2] += cx1 < cx2 ? 1.5 : -1.5;
    }
  }
  return world;
};
