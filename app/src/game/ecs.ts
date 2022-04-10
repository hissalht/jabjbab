import {
  addComponent,
  addEntity,
  createWorld as baseCreateWorld,
  defineComponent,
  defineQuery,
  IWorld,
  Types,
} from "bitecs";

export interface JabjabWorld extends IWorld {
  frame: 0;
  inputs: {
    0: {
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
    1: {
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
  };
  debug: {
    tslf: number;
    fps: number;
    fdif: number;
  };
}

export function createWorld(): JabjabWorld {
  return baseCreateWorld({
    frame: 0,
    inputs: {
      [0]: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
      [1]: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
    },
    debug: {
      tslf: 0,
      fps: 0,
      fdif: 0,
    },
  });
}

export const Position = defineComponent({
  x: Types.f64,
  y: Types.f64,
});

export const Rectangle = defineComponent({
  w: Types.f64,
  h: Types.f64,
});

export const Controllable = defineComponent({
  playerId: Types.ui8,
});

export function initializeWorld(world: JabjabWorld) {
  const p1 = addEntity(world);
  addComponent(world, Controllable, p1);
  addComponent(world, Position, p1);
  addComponent(world, Rectangle, p1);
  Controllable.playerId[p1] = 0;
  Position.x[p1] = 50;
  Position.y[p1] = 100;
  Rectangle.w[p1] = 20;
  Rectangle.h[p1] = 20;

  const p2 = addEntity(world);
  addComponent(world, Controllable, p2);
  addComponent(world, Position, p2);
  addComponent(world, Rectangle, p2);
  Controllable.playerId[p2] = 1;
  Position.x[p2] = 200;
  Position.y[p2] = 200;
  Rectangle.w[p2] = 20;
  Rectangle.h[p2] = 20;
}

const movableQuery = defineQuery([Controllable, Position]);
export function MovementSystem(world: JabjabWorld) {
  const eids = movableQuery(world);
  for (const eid of eids) {
    const playerId = Controllable.playerId[eid] as 0 | 1;
    if (world.inputs[playerId].left) {
      Position.x[eid] -= 5;
    }
    if (world.inputs[playerId].right) {
      Position.x[eid] += 5;
    }
    if (world.inputs[playerId].up) {
      Position.y[eid] -= 5;
    }
    if (world.inputs[playerId].down) {
      Position.y[eid] += 5;
    }
  }
  return world;
}

const renderableQuery = defineQuery([Position, Rectangle]);
export function RenderingSystem(ctx: CanvasRenderingContext2D) {
  return (world: JabjabWorld) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "blue";
    const eids = renderableQuery(world);
    for (const eid of eids) {
      ctx.beginPath();
      ctx.rect(
        Position.x[eid],
        Position.y[eid],
        Rectangle.w[eid],
        Rectangle.h[eid]
      );
      ctx.fill();
    }

    ctx.font = "3rem monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`TSLF: ${world.debug.tslf.toFixed(1)} ms`, 300, 50);
    ctx.fillText(`FPS: ${world.debug.fps.toFixed(1)} Hz`, 300, 100);
    ctx.fillText(`FDIF: ${world.debug.fdif}`, 300, 150);

    return world;
  };
}

type QueuedKeyEvent = ["keydown" | "keyup", string];

export function InputSystem(domEl: HTMLElement, playerId: 0 | 1) {
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

export function NetworkSystem(sendChannel: RTCDataChannel, playerId: 0 | 1) {
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
