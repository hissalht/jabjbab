import { defineDeserializer, defineSerializer, pipe } from "bitecs";
import { createWorld } from "..";
import { Controllable } from "../components/Controllable";
import { Position } from "../components/Position";
import { Rectangle } from "../components/Rectangle";
import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld, PlayerInputs } from "../JabjabWorld";
import { MovementSystem } from "./MovementSystem";

function objectEqual(a: Record<string, any>, b: Record<string, any>): boolean {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

interface NetworkPayload {
  frame: number;
  inputs: {
    [key: number]: PlayerInputs;
  };
}

export function RollbackNetcodeSystem(
  sendChannel: RTCDataChannel,
  receiveChannel: RTCDataChannel,
  worldConfig: JabjabWorld,
  playerId: 0 | 1
): JabjabSystem {
  const otherPlayerId = playerId === 0 ? 1 : 0;
  const serialize = defineSerializer(worldConfig);
  const deserialize = defineDeserializer(worldConfig);
  const minimalPipeline = pipe(MovementSystem);
  const W = new Map<
    number,
    {
      i: { 0: PlayerInputs; 1: PlayerInputs };
      w: ArrayBuffer;
    }
  >();

  let currentWorld: JabjabWorld;
  let queuedWorld: JabjabWorld | null;

  receiveChannel.addEventListener("message", ({ data }) => {
    const payload: NetworkPayload = JSON.parse(data);
    const frame = payload.frame;

    const savedState = W.get(frame);

    if (!savedState) {
      // TODO: handle inputs from the future
      throw new Error("Somehow you received inputs from the future...");
    }

    const predictedInputs = savedState.i[otherPlayerId];
    const actualInputs = payload.inputs[otherPlayerId];

    if (!objectEqual(predictedInputs, actualInputs)) {
      // ROLLBACK BABEEEEE
      const currentFrame = currentWorld.frame;
      const rollback = currentFrame - frame;
      console.log(
        `Input difference detected. Rollbacking ${rollback} frames...`
      );
      const rollbackWorld = createWorld();
      rollbackWorld.frame = frame;
      rollbackWorld.inputs = savedState.i;
      rollbackWorld.inputs[otherPlayerId] = actualInputs;
      deserialize(rollbackWorld, savedState.w);
      while (rollbackWorld.frame < currentFrame + 1) {
        minimalPipeline(rollbackWorld);
        rollbackWorld.frame++;
      }

      // TODO: queue the network payload and treat in in the system function
      queuedWorld = rollbackWorld;
    }

    W.delete(frame);
  });

  return (world: JabjabWorld) => {
    currentWorld = world;

    const payload: NetworkPayload = {
      frame: world.frame,
      inputs: {
        [playerId]: world.inputs[playerId],
      },
    };

    const serializedWorld = serialize(world);
    W.set(world.frame, { i: world.inputs, w: serializedWorld });

    // simulate network delay
    setTimeout(() => {
      sendChannel.send(JSON.stringify(payload));
    }, 2000);

    const returnedWorld = queuedWorld ?? world;
    queuedWorld = null;

    return returnedWorld;
  };
}
