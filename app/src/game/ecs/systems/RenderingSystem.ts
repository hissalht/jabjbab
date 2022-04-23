import { defineQuery } from "bitecs";
import { Position } from "../components/Position";
import { Rectangle } from "../components/Rectangle";
import { JabjabSystem } from "../JabjabSystem";
import { JabjabWorld } from "../JabjabWorld";

const renderableQuery = defineQuery([Position, Rectangle]);

export function RenderingSystem(ctx: CanvasRenderingContext2D): JabjabSystem {
  return (world: JabjabWorld) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "cyan";
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
    document.getElementById("p0")!.innerHTML = `${Position.x[eids[0]]}`;
    document.getElementById("p1")!.innerHTML = `${Position.x[eids[1]]}`;

    ctx.font = "3rem monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`TSLF: ${world.debug.tslf.toFixed(1)} ms`, 300, 50);
    ctx.fillText(`FPS: ${world.debug.fps.toFixed(1)} Hz`, 300, 100);
    ctx.fillText(`RF: ${world.debug.rf}f`, 300, 150);

    return world;
  };
}
