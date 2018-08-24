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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(2);


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

function onKeyDown(evt) {
  // 'c' key pressed.
  // if (evt.keyCode === 67) {
  //   sketch.switchColorMode();
  // }
}

// Draw entry point
function start() {
  // Start sketch.
  sketch = new __WEBPACK_IMPORTED_MODULE_0__sketch_js__["a" /* default */](document.getElementById('root'), {});
  sketch.startDrawing();

  // Event listeners.
  window.addEventListener('resize', _ => {sketch.onResize()}, false);
  document.addEventListener('keydown', onKeyDown, false);

  // dat.gui
  // datGui = new dat.GUI();
  // datGui.add(sketch, 'rendererType', Sketch.RendererTypes);
  // datGui.add(sketch, 'colorMode', Sketch.ColorModes);
}

// Start sketch
start();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getMouseCoordinates */
/* unused harmony export getDistance2d */
/* unused harmony export absMax */
/* unused harmony export createCanvasFullScreenBCR */
/* unused harmony export getAngleBetweenPoints */
/* unused harmony export bitwiseRound */
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

/***/ })
/******/ ]);