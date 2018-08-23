import * as utils from './utils.js';

export default class Sketch {
  static get DefaultOptions() {
    return {};
  }

  constructor(rootEl, options = {}) {
    // From arguments
    this._root = rootEl;
    this.options = Object.assign({}, Sketch.DefaultOptions, options);

    // Bind
    this.drawFrame = this.drawFrame.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);

    // Rendering
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._root.appendChild(this._canvas);

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._baseUnitSize = 80;
    this._fillColors = [0.9, 0.7, 0.5];

    this._root.addEventListener('pointermove', this.onPointerMove, false);

    this.onResize();
  }

  onPointerMove(evt) {
    const xPos = (evt.clientX - this._viewportSize.w / 2) /
      (this._viewportSize.w * 4);
    const yPos = (evt.clientY - this._viewportSize.h / 2) /
      (this._viewportSize.h * 4);
    const f = xPos + yPos;

    this._fillColors[1] = 0.5 - f;
    this._fillColors[2] = 0.5 + f;
  }

  startDrawing() {
    this._drawing = true;
    requestAnimationFrame(this.drawFrame);
  }

  stopDrawing() {
    this._drawing = false;
  }

  onResize() {
    const { innerWidth, innerHeight } = window;
    this._viewportSize = { w: innerWidth, h: innerHeight };

    this._canvas.style.width = `${innerWidth}px`;
    this._canvas.style.height = `${innerHeight}px`;
    this._canvas.setAttribute('width', `${innerWidth * this._DPR}px`);
    this._canvas.setAttribute('height', `${innerHeight * this._DPR}px`);
  }

  _generateFillColor(n) {
    const q = Math.round(255 * n);
    return `rgb(${q}, ${q}, ${q})`;
  }

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    // Draw
    this._ctx.fillStyle = this._generateFillColor(this._fillColors[0]);
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    for (let x = 0; x < this._viewportSize.w / this._baseUnitSize + 1; x += 1) {
      for (let y = 0; y < this._viewportSize.h / this._baseUnitSize + 1; y += 1) {
        const yOffset = x % 2 === 0 ? 0 : -0.5;

        this._drawCell(x, y + yOffset);
      }
    }
  }

  _drawCell(x, y) {

    const u = this._baseUnitSize;

    this._ctx.fillStyle = this._generateFillColor(this._fillColors[1]);
    this._ctx.beginPath();
    this._ctx.moveTo(x * u, y * u);
    this._ctx.lineTo((x + 0.5) * u, y * u);
    this._ctx.lineTo(x * u, (y + 0.5) * u);
    this._ctx.moveTo((x + 1) * u, (y + 1) * u);
    this._ctx.lineTo((x + 0.5) * u, (y + 1) * u);
    this._ctx.lineTo((x + 1) * u, (y + 0.5) * u);
    this._ctx.closePath();
    this._ctx.fill();

    this._ctx.fillStyle = this._generateFillColor(this._fillColors[2]);
    this._ctx.beginPath();
    this._ctx.moveTo((x + 1) * u, y * u);
    this._ctx.lineTo((x + 1) * u, (y + 0.5) * u);
    this._ctx.lineTo((x + 0.5) * u, y * u);
    this._ctx.moveTo(x * u, (y + 1) * u);
    this._ctx.lineTo((x + 0.5) * u, (y + 1) * u);
    this._ctx.lineTo(x * u, (y + 0.5) * u);
    this._ctx.closePath();
    this._ctx.fill();
  }
};