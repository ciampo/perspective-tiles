export const drawTile = (ctx, u, fillDiamond, fillA, fillB, x, y, progress) => {
  ctx.save();

  // Scale by the unit
  ctx.scale(u, u);
  // Translate to the center of the tile
  ctx.translate(x + 0.5, y + 0.5);
  // Rotate (when animating)
  ctx.rotate(Math.PI * progress / 2);

  ctx.fillStyle = fillA;
  ctx.beginPath();
  ctx.moveTo(-0.5, -0.5);
  ctx.lineTo(0, -0.5);
  ctx.lineTo(-0.5, 0);
  ctx.moveTo(0.5, 0.5);
  ctx.lineTo(0, 0.5);
  ctx.lineTo(0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fillB;
  ctx.beginPath();
  ctx.moveTo(0.5, -0.5);
  ctx.lineTo(0.5, 0);
  ctx.lineTo(0, -0.5);
  ctx.moveTo(-0.5, 0.5);
  ctx.lineTo(0, 0.5);
  ctx.lineTo(-0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fillDiamond;
  ctx.beginPath();
  ctx.moveTo(-0.5, 0);
  ctx.lineTo(0, -0.5);
  ctx.lineTo(0.5, 0);
  ctx.lineTo(0, 0.5);
  ctx.lineTo(-0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}