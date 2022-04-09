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
    const otherPlayerId = playerId === 0 ? 1 : 0;
    world.inputs[otherPlayerId] = payload.inputs[otherPlayerId];
  });

  let then = 0;
  function loop(now: number) {
    if (now - then >= 1000 / 60) {
      then = now;
      pipeline(world);
      world.frame++;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
