import { defineQuery } from "bitecs";
import { Character } from "../components/Character";
import { Position, PositionOffset } from "../components/Position";
import { PushBox } from "../components/PushBox";
import { Rectangle } from "../components/Rectangle";
import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

const pushBoxQuery = defineQuery([PushBox, Rectangle, PositionOffset]);
const characterQuery = defineQuery([Character, Position]);

const CHARACTER_POSITION_CROSS_SIZE = 10;

export function RenderingSystem(ctx: CanvasRenderingContext2D): JabjabSystem {
  return (world: JabjabWorld) => {
    // clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // apply transformation to use cartesian coordinates (origin at bottom left)
    ctx.save();
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);

    // draw push boxes
    ctx.fillStyle = "#00FFFF44";
    ctx.strokeStyle = "#00FFFF";
    const eids = pushBoxQuery(world);
    for (const eid of eids) {
      const characterId = PushBox.characterId[eid];
      const x = Position.x[characterId] + PositionOffset.x[eid];
      const y = Position.y[characterId] + PositionOffset.y[eid];
      ctx.beginPath();
      ctx.rect(x, y, Rectangle.w[eid], Rectangle.h[eid]);
      ctx.fill();
      ctx.stroke();
    }

    // draw character position
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    for (const eid of characterQuery(world)) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      ctx.beginPath();
      ctx.moveTo(x - CHARACTER_POSITION_CROSS_SIZE, y);
      ctx.lineTo(x + CHARACTER_POSITION_CROSS_SIZE, y);
      ctx.moveTo(x, y - CHARACTER_POSITION_CROSS_SIZE);
      ctx.lineTo(x, y + CHARACTER_POSITION_CROSS_SIZE);
      ctx.stroke();
    }

    // reset transformation
    ctx.restore();

    // render debug info
    ctx.font = "3rem monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`TSLF: ${world.debug.tslf.toFixed(1)} ms`, 300, 50);
    ctx.fillText(`FPS: ${world.debug.fps.toFixed(1)} Hz`, 300, 100);
    ctx.fillText(`RF: ${world.debug.rf}f`, 300, 150);

    return world;
  };
}
