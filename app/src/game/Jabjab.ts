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
    InputSystem({
      domEl: document.body,
      playerId,
      keybinds: {
        left: ["ArrowLeft"],
        right: ["ArrowRight"],
        down: ["ArrowDown"],
        up: ["ArrowUp"],
      },
    }),
    // InputSystem({
    //   domEl: document.body,
    //   playerId: playerId === 0 ? 1 : 0,
    //   keybinds: {
    //     left: ["z"],
    //     right: ["f"],
    //     down: ["e"],
    //     up: [" "],
    //   },
    // }),
    RollbackNetcodeSystem(sendChannel, receiveChannel, world, playerId),
    minimalPipeline,
    RenderingSystem(ctx)
  );

  const FRAMERATE = 60;

  let start: number;
  let then = 0;

  function loop(now: number) {
    requestAnimationFrame(loop);

    if (!start) {
      start = now;
    }

    const targetRenderedFrames = Math.floor((now - start) / (1000 / FRAMERATE));

    while (world.frame < targetRenderedFrames) {
      world.debug.tslf = now - then;
      world.debug.fps = 1000 / (now - then);
      then = now;
      world = pipeline(world);
      world.frame++;
    }
  }

  requestAnimationFrame(loop);
}
