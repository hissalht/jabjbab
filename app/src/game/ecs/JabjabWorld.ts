import { IWorld } from "bitecs";

export interface JabjabWorld extends IWorld {
  frame: 0;
  inputs: {
    0: {
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
    1: {
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
  };
  debug: {
    tslf: number; // time since last frame
    fps: number; // frames per second
    fdif: number; // frame
  };
}
