import { stepEasing } from './utils.js';
import { drawTile } from './tile.js';

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
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    // Rendering
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._root.appendChild(this._canvas);

    // Device pixel ratio.
    this._DPR = 1;// window.devicePixelRatio;

    this._root.addEventListener('pointermove', this._onPointerMove);
    this._root.addEventListener('pointerup', this._onPointerUp);

    this._offsetCounter = 0;
    this._offsetCounterActive = false;
    this._offsetCounterRTT = 80;

    this.onResize();
  }

  _createGrey(percBrightness) {
    return `hsl(0, 0%, ${percBrightness}%)`;
  }

  get u() {
    return this._baseUnitSize || 60;
  }

  set u(u) {
    this._baseUnitSize = u;
  }

  get fillBg() {
    return this._fillBg || this._createGrey(100);
  }

  set fillBg(fillBg) {
    this._fillBg = fillBg;
  }

  get fillA() {
    return this._fillA || this._createGrey(70);
  }

  set fillA(fillA) {
    this._fillA = fillA;
  }

  get fillB() {
    return this._fillB || this._createGrey(30);
  }

  set fillB(fillB) {
    this._fillB = fillB;
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

  _onPointerMove(evt) {
    // deltaY ranges between -0.4 and +0.4
    const deltaY = (evt.clientY - this._viewportSize.h / 2) / this._viewportSize.h / 5 * 4;

    this.fillA = this._createGrey(Math.round(100 * (0.5 + deltaY)));
    this.fillB = this._createGrey(Math.round(100 * (0.5 - deltaY)));
  }

  _onPointerUp() {
    if (this._offsetCounterActive) {
      return;
    }

    this._offsetCounter = 0;
    this._offsetCounterActive = true;
  }

  // _computeOffsetX(n, maxN, secondHalfOfTheLoop) {
  //   let xOffset = - 0.5 * this._wholeAnimationLoops;

  //   if (this._offsetCounterActive) {
  //     const cycleCounter = Math.min(maxN * this._offsetCounterRTT, this._offsetCounter);
  //     const inverseCounter = maxN * this._offsetCounterRTT - cycleCounter;
  //     const nextIteration = n + 1;
  //     if (inverseCounter < nextIteration * this._offsetCounterRTT) {
  //       const additionalAmount = (maxN - nextIteration) * this._offsetCounterRTT;
  //       const perc = (cycleCounter - additionalAmount) / this._offsetCounterRTT;
  //       xOffset -= 0.5 * stepEasing(perc, 0.8);
  //     }

  //     if (secondHalfOfTheLoop && this._offsetCounter > maxN * this._offsetCounterRTT) {
  //       const cycleCounter = this._offsetCounter % (maxN * this._offsetCounterRTT);
  //       const inverseCounter = maxN * this._offsetCounterRTT - cycleCounter;

  //       const cycleN = 2 * maxN - n;
  //       const perc = Math.min(cycleN, cycleCounter / this._offsetCounterRTT);
  //       xOffset -= 0.5 * stepEasing(perc, 0.8);
  //     }
  //   }

  //   return xOffset;
  // }

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    const maxX = Math.round(this._viewportSize.w / this.u) + 1;
    const maxY = Math.round(this._viewportSize.h / this.u) + 1;
    let x, y;

    for (x = -1; x < maxX; x += 1) {
      for (y = 0; y < maxY; y += 1) {
        const yOffset = x % 2 === 0 ? 0 : -0.5;
        drawTile(this._ctx, this.u,
          this.fillBg, this.fillA, this.fillB,
          x, 0, y, yOffset, this._offsetCounter / this._offsetCounterRTT);
      }
    }

    // Increate offset counter.
    if (this._offsetCounterActive) {
      this._offsetCounter += 1;

      // Allow 2 cycles.
      if (this._offsetCounter > this._offsetCounterRTT) {
        this._offsetCounterActive = false;
        this._offsetCounter = 0;
      }
    }

    // // Slanted \_\
    // this._ctx.fillStyle = this.fillA;
    // this._ctx.beginPath();
    // for (x = -1; x < maxX; x += 1) {
    //   const xOffset = this._offsetCounter > maxX * this._offsetCounterRTT ? - 0.5 : 0;

    //   for (y = 0; y < maxY; y += 1) {
    //     const yOffset = x % 2 === 0 ? 0 : -0.5;

    //     this._ctx.moveTo(this.u * (x + xOffset + 0.5), this.u * (y + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1), this.u * (y + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1.5), this.u * (y + 0.5 + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1), this.u * (y + 0.5 + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 0.5), this.u * (y + yOffset));
    //   }
    // }
    // this._ctx.closePath();
    // this._ctx.fill();

    // // Slanted /_/
    // this._ctx.fillStyle = this.fillB;
    // this._ctx.beginPath();
    // for (x = -1; x < maxX; x += 1) {
    //   const xOffset = this._offsetCounter > maxX * this._offsetCounterRTT ? - 0.5 : 0;

    //   for (y = 0; y < maxY; y += 1) {
    //     const yOffset = x % 2 === 0 ? 0 : -0.5;

    //     this._ctx.moveTo(this.u * (x + xOffset + 1), this.u * (y + 0.5 + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1.5), this.u * (y + 0.5  + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1), this.u * (y + 1  + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 0.5), this.u * (y + 1  + yOffset));
    //     this._ctx.lineTo(this.u * (x + xOffset + 1), this.u * (y + 0.5  + yOffset));
    //   }
    // }
    // this._ctx.closePath();
    // this._ctx.fill();

    // // Diamond
    // this._ctx.fillStyle = this.fillBg;
    // this._ctx.strokeStyle = '#666';
    // this._ctx.lineWidth = 0.1;
    // this._ctx.beginPath();
    // const diamondsMaxX = this._offsetCounterActive ? 2 * maxX : maxX;
    // for (x = -1; x < diamondsMaxX; x += 1) {
    //   const xOffset = this._computeOffsetX(x, maxX, true);

    //   for (y = 0; y < maxY; y += 1) {
    //     const yOffset = x % 2 === 0 ? 0 : -0.5;

    //     this._ctx.moveTo(this.u * (x + 0.5 + xOffset), this.u * (y + yOffset));
    //     this._ctx.lineTo(this.u * (x + 1 + xOffset), this.u * (y + 0.5  + yOffset));
    //     this._ctx.lineTo(this.u * (x + 0.5 + xOffset), this.u * (y + 1  + yOffset));
    //     this._ctx.lineTo(this.u * (x + 0 + xOffset), this.u * (y + 0.5  + yOffset));
    //     this._ctx.lineTo(this.u * (x + 0.5 + xOffset), this.u * (y + yOffset));
    //   }
    // }
    // this._ctx.closePath();
    // this._ctx.fill();
    // this._ctx.stroke();

    // // Increate offset counter.
    // if (this._offsetCounterActive) {
    //   this._offsetCounter += 1;

    //   // Allow 2 cycles.
    //   if (this._offsetCounter > 2 * maxX * this._offsetCounterRTT) {
    //     this._wholeAnimationLoops += 1;
    //     this._offsetCounterActive = false;
    //     console.log(this._wholeAnimationLoops);
    //   }
    // }

  }
};