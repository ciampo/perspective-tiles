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
    this.onPointerUp = this.onPointerUp.bind(this);

    // Rendering
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._root.appendChild(this._canvas);

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._baseUnitSize = 160;
    this._colorBrightness = [0.9, 0.7, 0.5];
    this._hue = Math.random();

    this._root.addEventListener('pointermove', this.onPointerMove, false);
    this._root.addEventListener('pointerup', this.onPointerUp, false);

    this.onResize();
  }

  onPointerUp() {
    this._hue = Math.random();
  }

  onPointerMove(evt) {
    const xPos = (evt.clientX - this._viewportSize.w / 2) /
      (this._viewportSize.w);
    const yPos = (evt.clientY - this._viewportSize.h / 2) /
      (this._viewportSize.h);
    const f = xPos / 4 + yPos / 4;

    this._colorBrightness[1] = 0.5 - f;
    this._colorBrightness[2] = 0.5 + f;
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

  _generateFillColor(brightness) {
    const hue = Math.round(360 * this._hue);
    return `hsl(${hue}, 78%, ${90 - Math.round((1 - brightness) * 40)}%)`;
  }

  _generateCanvasPattern(density, fill) {
    const s = 24;
    const c = document.createElement("canvas");
    c.width = s;
    c.height = s;
    const ctx = c.getContext("2d");

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, s, s);

    ctx.fillStyle = fill;

    ctx.beginPath();
    for (let x = 0; x <= s; x += density) {
      for (let y = 0; y <= s; y += density) {
        ctx.moveTo(x - 1, y - 1);
        ctx.lineTo(x + 1, y - 1);
        ctx.lineTo(x + 1, y + 1);
        ctx.lineTo(x - 1, y + 1);
        ctx.lineTo(x - 1, y - 1);
      }
    }
    ctx.closePath();
    ctx.fill();

    return c;
  }

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    // Draw
    // this._ctx.fillStyle = this._generateFillColor(this._colorBrightness[0], 0);
    this._ctx.fillStyle = this._ctx.createPattern(
      this._generateCanvasPattern(8, `hsl(${Math.round(this._hue * 360)}, 75%, 30%)`),
      'repeat',
    );
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

    this._ctx.fillStyle = this._generateFillColor(this._colorBrightness[1], 1);

    this._ctx.fillStyle = this._ctx.createPattern(
      this._generateCanvasPattern(4, `hsl(${Math.round(this._hue * 360)}, 75%, 30%)`),
      'repeat',
    );

    this._ctx.beginPath();
    this._ctx.moveTo(x * u, y * u);
    this._ctx.lineTo((x + 0.5) * u, y * u);
    this._ctx.lineTo(x * u, (y + 0.5) * u);
    this._ctx.moveTo((x + 1) * u, (y + 1) * u);
    this._ctx.lineTo((x + 0.5) * u, (y + 1) * u);
    this._ctx.lineTo((x + 1) * u, (y + 0.5) * u);
    this._ctx.closePath();
    this._ctx.fill();
    // this._ctx.stroke();

    this._ctx.fillStyle = this._generateFillColor(this._colorBrightness[2], 2);

    this._ctx.fillStyle = this._ctx.createPattern(
      this._generateCanvasPattern(3, `hsl(${Math.round(this._hue * 360)}, 75%, 30%)`),
      'repeat',
    );

    this._ctx.beginPath();
    this._ctx.moveTo((x + 1) * u, y * u);
    this._ctx.lineTo((x + 1) * u, (y + 0.5) * u);
    this._ctx.lineTo((x + 0.5) * u, y * u);
    this._ctx.moveTo(x * u, (y + 1) * u);
    this._ctx.lineTo((x + 0.5) * u, (y + 1) * u);
    this._ctx.lineTo(x * u, (y + 0.5) * u);
    this._ctx.closePath();
    this._ctx.fill();
    // this._ctx.stroke();
  }
};