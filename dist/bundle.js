/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tile_js__ = __webpack_require__(2);



class Sketch {
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
    this._offsetCounterRTT = 60;
    this._offsetLoops = 0;

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
    const {innerWidth, innerHeight} = window;
    this._viewportSize = {w: innerWidth, h: innerHeight};

    this._canvas.style.width = `${innerWidth}px`;
    this._canvas.style.height = `${innerHeight}px`;
    this._canvas.setAttribute('width', `${innerWidth * this._DPR}px`);
    this._canvas.setAttribute('height', `${innerHeight * this._DPR}px`);

    const maxSize = Math.max(this._viewportSize.w, this._viewportSize.h);
    this.u = Math.max(40, Math.min(200, maxSize / 20));
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

  drawFrame() {
    if (this._drawing) {
      requestAnimationFrame(this.drawFrame);
    }

    const maxX = Math.round(this._viewportSize.w / this.u) + 1;
    const maxY = Math.round(this._viewportSize.h / this.u) + 1;

    for (let x = -1; x < maxX; x += 1) {
      for (let y = 0; y < maxY; y += 1) {
        const yOffset = x % 2 === 0 ? 0 : -0.5;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__tile_js__["a" /* drawTile */])(
          this._ctx, this.u,
          this.fillBg, this.fillA, this.fillB,
          x, y + yOffset,
          this._offsetLoops + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* easeInOutCubic */])(this._offsetCounter / this._offsetCounterRTT)
        );
      }
    }

    // Increate offset counter.
    if (this._offsetCounterActive) {
      this._offsetCounter += 1;

      if (this._offsetCounter > this._offsetCounterRTT) {
        this._offsetCounterActive = false;
        this._offsetCounter = 0;
        this._offsetLoops += 1;
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sketch;
;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sketch_js__ = __webpack_require__(0);


let sketch;
let datGui;

// Draw entry point
function start() {
  // Start sketch.
  sketch = new __WEBPACK_IMPORTED_MODULE_0__sketch_js__["a" /* default */](document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', _ => {sketch.onResize()}, false);

  // dat.gui
  // datGui = new dat.GUI();
  // datGui.add(sketch, 'u', 20, 260, 1);
  // datGui.addColor(sketch, 'fillBg');
  // datGui.addColor(sketch, 'fillA');
  // datGui.addColor(sketch, 'fillB');
}

// Start sketch
start();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const drawTile = (ctx, u, fillDiamond, fillA, fillB, x, y, progress) => {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = drawTile;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getMouseCoordinates */
/* unused harmony export getDistance2d */
/* unused harmony export absMax */
/* unused harmony export createCanvasFullScreenBCR */
/* unused harmony export getAngleBetweenPoints */
/* unused harmony export bitwiseRound */
/* unused harmony export stepEasing */
/* harmony export (immutable) */ __webpack_exports__["a"] = easeInOutCubic;
function getMouseCoordinates(evt, canvasBCR, devicePxRatio = 1) {
  let toReturn = {};

  toReturn.x = Math.round(((evt.clientX * devicePxRatio) - canvasBCR.left) /
      (canvasBCR.right - canvasBCR.left) * canvasBCR.width);
  toReturn.y = Math.round(((evt.clientY * devicePxRatio) - canvasBCR.top) /
    (canvasBCR.bottom - canvasBCR.top) * canvasBCR.height);

  return toReturn;
};

function getDistance2d(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

function absMax(x, y) {
  return Math.max(Math.abs(x), Math.abs(y));
};

function createCanvasFullScreenBCR(canvas) {
  return {
    top: 0,
    right: canvas.width,
    bottom: canvas.height,
    left: 0,
    width: canvas.width,
    height: canvas.height
  };
};

function getAngleBetweenPoints(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function bitwiseRound(n) {
  return (0.5 + n) << 0;
}

function stepEasing(n, t = 0.5) {
  const rest = Math.floor(n);
  return rest + Math.min(1, (n - rest) / t);
}

function easeInOutCubic(t) {
  return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
};

/***/ })
/******/ ]);