import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

type QueuedKeyEvent = ["keydown" | "keyup", string];

interface InputSystemOptions {
  /** Element to bind the event listener */
  domEl: HTMLElement;

  /** For which player the system gets the inputs */
  playerId: 0 | 1;

  /** Keyboard configuration */
  keybinds: {
    left: string[];
    right: string[];
    up: string[];
    down: string[];
  };
}

export function InputSystem(options: InputSystemOptions): JabjabSystem {
  const { domEl, playerId, keybinds } = options;
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

      if (keybinds.left.includes(key)) {
        world.inputs[playerId].left = eventType === "keydown";
      } else if (keybinds.right.includes(key)) {
        world.inputs[playerId].right = eventType === "keydown";
      } else if (keybinds.up.includes(key)) {
        world.inputs[playerId].up = eventType === "keydown";
      } else if (keybinds.down.includes(key)) {
        world.inputs[playerId].down = eventType === "keydown";
      }
    }
    return world;
  };
}
