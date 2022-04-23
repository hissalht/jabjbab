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

  const networkPayloadQueue: NetworkPayload[] = [];

  receiveChannel.addEventListener("message", ({ data }) => {
    const payload: NetworkPayload = JSON.parse(data);
    setTimeout(() => {
      networkPayloadQueue.push(payload);
    }, 100);
  });

  return (world: JabjabWorld) => {
    const payload: NetworkPayload = {
      frame: world.frame,
      inputs: {
        [playerId]: world.inputs[playerId],
      },
    };
    const payloadJson = JSON.stringify(payload);

    // simulate network delay
    sendChannel.send(payloadJson);

    // save game state to be used in a possible future rollback
    const serializedWorld = serialize(world);
    W.set(world.frame, { i: world.inputs, w: serializedWorld });

    // check for rollbacks
    networkPayloadQueue.sort((a, b) => a.frame - b.frame);
    while (networkPayloadQueue.length) {
      const payload = networkPayloadQueue[0];
      const savedState = W.get(payload.frame);

      if (!savedState) {
        console.log("We received a frame from the future 🤔");
        throw new Error("We received a frame from the future 🤔");
      }

      const predictedInputs = savedState.i[otherPlayerId];
      const actualInputs = payload.inputs[otherPlayerId];

      if (objectEqual(predictedInputs, actualInputs)) {
        // get rid of saved state because we now know that the predicted inputs were correct
        // TODO: clean W when needed
        // W.delete(payload.frame);
        // get rid of queued network payload, we checked it
        networkPayloadQueue.shift();
        continue;
      } else {
        // rollback
        const rollbackWorld = createWorld();
        deserialize(rollbackWorld, savedState.w);
        rollbackWorld.frame = payload.frame;

        while (rollbackWorld.frame !== world.frame) {
          const savedState = W.get(rollbackWorld.frame)!;
          rollbackWorld.inputs[playerId] = savedState.i[playerId]!;
          if (networkPayloadQueue[0]?.frame === rollbackWorld.frame) {
            const i = networkPayloadQueue.shift()?.inputs[otherPlayerId]!;
            rollbackWorld.inputs[otherPlayerId] = i;
          }
          // save game state to be used in a possible future rollback
          console.log(rollbackWorld.frame, rollbackWorld.inputs[otherPlayerId]);
          const serializedWorld = serialize(rollbackWorld);
          W.set(rollbackWorld.frame, {
            i: rollbackWorld.inputs,
            w: serializedWorld,
          });
          minimalPipeline(rollbackWorld);
          rollbackWorld.frame++;
        }

        const serializedWorld = serialize(rollbackWorld);
        W.set(rollbackWorld.frame, {
          i: rollbackWorld.inputs,
          w: serializedWorld,
        });

        rollbackWorld.debug = world.debug;

        return rollbackWorld;
      }
    }

    return world;
  };
}
