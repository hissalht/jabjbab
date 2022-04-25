import { pipe } from "bitecs";
import {
  createWorld,
  initializeWorld,
  InputSystem,
  RollbackNetcodeSystem,
  RenderingSystem,
  minimalPipeline,
} from "./ecs";

interface JabjabGameOptions {
  canvas: HTMLCanvasElement;
  sendChannel: RTCDataChannel;
  receiveChannel: RTCDataChannel;
  playerId: 0 | 1;
}

export function runGame(options: JabjabGameOptions) {
  const { canvas, playerId, sendChannel, receiveChannel } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get rendering context");
  }

  let world = createWorld();
  initializeWorld(world);

  const pipeline = pipe(
    InputSystem(document.body, playerId),
    RollbackNetcodeSystem(sendChannel, receiveChannel, world, playerId),
    minimalPipeline,
    RenderingSystem(ctx)
  );

  const FRAME_DIFF = 1000 / 61;
  let then = 0;
  function loop(now: number) {
    requestAnimationFrame(loop);

    // @ts-expect-error
    window._debug = world.debug;

    // TODO: framerate is wonky on firefox. Find a way to balance frame length over time.
    const diff = now - then;
    if (diff >= FRAME_DIFF) {
      world.debug.tslf = now - then;
      world.debug.fps = 1000 / (now - then);
      then = now;
      world = pipeline(world);
      world.frame++;
    }
  }

  requestAnimationFrame(loop);
}
