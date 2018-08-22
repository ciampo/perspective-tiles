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
  }

  startDrawing() {
    this._drawing = true;
    requestAnimationFrame(this.drawFrame);
  }

  stopDrawing() {
    this._drawing = false;
  }

  onResize() {
    // Update sketch sizes
    this.sketchSize.w = window.innerWidth;
    this.sketchSize.h = window.innerHeight;
  }

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    console.log('Hey');

    // Draw

    // Update model
  }
};