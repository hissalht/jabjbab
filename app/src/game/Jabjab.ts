import { pipe } from "bitecs";
import {
  createWorld,
  initializeWorld,
  InputSystem,
  MovementSystem,
  NetworkSystem,
  RenderingSystem,
} from "./ecs";

interface JabjabGameOptions {
  canvas: HTMLCanvasElement;
  sendChannel: RTCDataChannel;
  receiveChannel: RTCDataChannel;
  playerId: 0 | 1;
}

export function runGame(options: JabjabGameOptions) {
  const { canvas, playerId, sendChannel, receiveChannel } = options;
  console.log("🚀 ~ file: Jabjab.ts ~ line 19 ~ runGame ~ playerId", playerId);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get rendering context");
  }

  const world = createWorld();
  initializeWorld(world);

  const pipeline = pipe(
    InputSystem(document.body, playerId),
    NetworkSystem(sendChannel, playerId),
    MovementSystem,
    RenderingSystem(ctx)
  );

  receiveChannel.addEventListener("message", ({ data }) => {
    const payload = JSON.parse(data);

    const currentFrame = world.frame;
    const receivedFrame = payload.frame;
    world.debug.fdif = currentFrame - receivedFrame;

    const otherPlayerId = playerId === 0 ? 1 : 0;
    world.inputs[otherPlayerId] = payload.inputs[otherPlayerId];
  });

  const FRAME_DIFF = 1000 / 61;
  let then = 0;
  function loop(now: number) {
    requestAnimationFrame(loop);

    // TODO: framerate is wonky on firefox. Find a way to balance frame length over time.
    const diff = now - then;
    if (diff >= FRAME_DIFF) {
      world.debug.tslf = now - then;
      world.debug.fps = 1000 / (now - then);
      then = now;
      pipeline(world);
      world.frame++;
    }
  }

  requestAnimationFrame(loop);
}
