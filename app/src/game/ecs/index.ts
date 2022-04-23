import {
  addComponent,
  addEntity,
  createWorld as baseCreateWorld,
  pipe,
} from "bitecs";
import { Controllable } from "./components/Controllable";
import { Position } from "./components/Position";
import { Rectangle } from "./components/Rectangle";
import { JabjabWorld } from "./JabjabWorld";

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
  addComponent(world, Controllable, p1);
  addComponent(world, Position, p1);
  addComponent(world, Rectangle, p1);
  Controllable.playerId[p1] = 0;
  Position.x[p1] = 0;
  Position.y[p1] = 100;
  Rectangle.w[p1] = 20;
  Rectangle.h[p1] = 20;

  const p2 = addEntity(world);
  addComponent(world, Controllable, p2);
  addComponent(world, Position, p2);
  addComponent(world, Rectangle, p2);
  Controllable.playerId[p2] = 1;
  Position.x[p2] = 200;
  Position.y[p2] = 200;
  Rectangle.w[p2] = 20;
  Rectangle.h[p2] = 20;
}

export * from "./systems/InputSystem";
export * from "./systems/MovementSystem";
export * from "./systems/RollbackNetcodeSystem";
export * from "./systems/RenderingSystem";

export * from "./components/Controllable";
export * from "./components/Position";
export * from "./components/Rectangle";
