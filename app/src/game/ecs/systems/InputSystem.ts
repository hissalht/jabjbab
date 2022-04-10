import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

type QueuedKeyEvent = ["keydown" | "keyup", string];

export function InputSystem(domEl: HTMLElement, playerId: 0 | 1): JabjabSystem {
  const queue: Array<QueuedKeyEvent> = [];

  domEl.addEventListener("keydown", (e) => {
    e.preventDefault();
    queue.push(["keydown", e.key]);
  });

  domEl.addEventListener("keyup", (e) => {
    e.preventDefault();
    queue.push(["keyup", e.key]);
  });

  return (world: JabjabWorld) => {
    while (queue.length) {
      const [eventType, key] = queue.shift()!;

      if (key === "ArrowLeft") {
        world.inputs[playerId].left = eventType === "keydown";
      } else if (key === "ArrowRight") {
        world.inputs[playerId].right = eventType === "keydown";
      } else if (key === "ArrowUp") {
        world.inputs[playerId].up = eventType === "keydown";
      } else if (key === "ArrowDown") {
        world.inputs[playerId].down = eventType === "keydown";
      }
    }
    return world;
  };
}
