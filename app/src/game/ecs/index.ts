import {
  addComponent,
  addEntity,
  createWorld as baseCreateWorld,
  pipe,
} from "bitecs";
import { Character } from "./components/Character";
import { Position, PositionOffset } from "./components/Position";
import { PushBox } from "./components/PushBox";
import { Rectangle } from "./components/Rectangle";
import { JabjabWorld } from "./JabjabWorld";
import { ActionSystem } from "./systems/ActionSystem";
import { MovementSystem } from "./systems/MovementSystem";

export function createWorld(): JabjabWorld {
  return baseCreateWorld({
    frame: 0,
    inputs: {
      [0]: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
      [1]: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
    },
    debug: {
      tslf: 0,
      fps: 0,
      rf: 0,
    },
  });
}

export function initializeWorld(world: JabjabWorld) {
  const p1 = addEntity(world);
  addComponent(world, Character, p1);
  addComponent(world, Position, p1);
  Character.playerId[p1] = 0;
  Position.x[p1] = 50;
  Position.y[p1] = 0;

  const p1PushBox = addEntity(world);
  addComponent(world, PushBox, p1PushBox);
  PushBox.characterId[p1PushBox] = p1;
  addComponent(world, Rectangle, p1PushBox);
  Rectangle.w[p1PushBox] = 150;
  Rectangle.h[p1PushBox] = 250;
  addComponent(world, PositionOffset, p1PushBox);
  PositionOffset.x[p1PushBox] = -Rectangle.w[p1PushBox] / 2;

  const p2 = addEntity(world);
  addComponent(world, Character, p2);
  addComponent(world, Position, p2);
  Character.playerId[p2] = 1;
  Position.x[p2] = 500;
  Position.y[p2] = 0;

  const p2PushBox = addEntity(world);
  addComponent(world, PushBox, p2PushBox);
  PushBox.characterId[p2PushBox] = p2;
  addComponent(world, Rectangle, p2PushBox);
  Rectangle.w[p2PushBox] = 150;
  Rectangle.h[p2PushBox] = 250;
  addComponent(world, PositionOffset, p2PushBox);
  PositionOffset.x[p2PushBox] = -Rectangle.w[p2PushBox] / 2;
}

export const minimalPipeline = pipe(ActionSystem, MovementSystem);

export * from "./systems/InputSystem";
export * from "./systems/MovementSystem";
export * from "./systems/RollbackNetcodeSystem";
export * from "./systems/RenderingSystem";

export * from "./components/Character";
export * from "./components/Position";
export * from "./components/Rectangle";
