import { defineComponent, Types } from "bitecs";

export const Vector2D = defineComponent({
  x: Types.f64,
  y: Types.f64,
});

export const Position = Vector2D;

export const PositionOffset = Vector2D;
