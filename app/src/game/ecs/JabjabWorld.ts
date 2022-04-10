import { IWorld } from "bitecs";

export interface PlayerInputs {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface JabjabWorld extends IWorld {
  frame: number;
  inputs: {
    0: PlayerInputs;
    1: PlayerInputs;
  };
  debug: {
    tslf: number; // time since last frame
    fps: number; // frames per second
    fdif: number; // frame
  };
}
