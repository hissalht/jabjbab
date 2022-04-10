import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

export function NetworkSystem(
  sendChannel: RTCDataChannel,
  playerId: 0 | 1
): JabjabSystem {
  return (world: JabjabWorld) => {
    const payload = {
      frame: world.frame,
      inputs: {
        [playerId]: world.inputs[playerId],
      },
    };
    // simulate network delay
    setTimeout(() => {
      sendChannel.send(JSON.stringify(payload));
    }, 100);
    return world;
  };
}
