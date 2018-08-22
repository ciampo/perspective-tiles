import Sketch from './sketch.js';

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
  sketch = new Sketch(document.getElementById('root'), {});
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
