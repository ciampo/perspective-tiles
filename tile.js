export const drawTile = (ctx, u, fillBg, fillA, fillB, x0, x1, y0, y1, progress) => {
  ctx.save();

  ctx.scale(u, u);
  ctx.translate(x0 + x1 + 0.5, y0 + y1 + 0.5);
  ctx.rotate(Math.PI * progress);

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

  ctx.fillStyle = fillBg;
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