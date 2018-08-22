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

    // Rendering
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._root.appendChild(this._canvas);

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this.onResize();
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

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    // Draw
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    const gridSize = {
      x: 100,
      y: 60,
    };

    for (let x = 0; x < this._viewportSize.w; x += gridSize.x) {
      for (let y = 0; y < this._viewportSize.h; y += gridSize.y) {
        this._ctx.fillStyle = `rgba(0, 0, 0, ${Math.random()})`;
        this._ctx.fillRect(x, y, gridSize.x, gridSize.y);
      }
    }

    // Update model
  }
};