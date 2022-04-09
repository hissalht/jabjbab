interface JabjabGameOptions {
  canvas: HTMLCanvasElement;
  sendChannel: RTCDataChannel;
  receiveChannel: RTCDataChannel;
}

export function runGame(options: JabjabGameOptions) {
  const { canvas } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get rendering context");
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
