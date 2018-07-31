import L from './l-system.js';

// cache for the drawing funcs
let turtleCache = [];

// A new random seed every 5 seconds
let random = new alea(Math.random());
window.setInterval( () => {
  random = new alea(random());
}, 5000);

const clamp = (min, max, x) => {
  return Math.max(min, Math.min(max, x));
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const move = (p, v, a) => ([p[0]+v[0]+a[0], p[1]+v[1]+a[1]]);
const moveRadial = ([x, y], amount) => ([x * amount, y * amount]);

const initCanvas = (selector, width, height) => {
  const parent = document.querySelector(selector);
  const canvas = parent.querySelector('canvas') || document.createElement('canvas');
  // Make sure canvas reflect the device's pixel density
  const scale = window.devicePixelRatio;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  parent.appendChild(canvas);
  // Normalize coordinate system to use css pixels.
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  return ctx;
};

const generateRandomLine = (scales=[1, 1]) => {
  const R = () => random() - 0.5;
  return [
    [R() * scales[0], R() * scales[1]],
    [R() * scales[0], R() * scales[1]],
    [R() * scales[0], R() * scales[1]],
  ];
};

const generateLineCoords = (width, n) => {
  let coords = [];
  const gap = width / (n - 1);
  for (let i = 0; i < n; i++) {
    coords.push([i * gap, 0]);
  }
  return coords;
};

const generateCircleCoords = (radius, n) => {
  let coords = [];
  for (let i = 0; i < n; i++) {
    const cx = radius * Math.cos(Math.PI / n * 2 * i);
    const cy = radius * Math.sin(Math.PI / n * 2 * i);
    coords.push([ cx, cy ]);
  }
  return coords;
};

const generateCoefficients = (n, scales=[0.1, 0.1]) => {
  let coeffs = [];

  for (let i = 0; i < n; i++) {
    let dx = (random() - 0.5) * scales[0];
    let dy = (random() - 0.5) * scales[1];
    coeffs.push([dx, dy]);
  }
  return coeffs;
};

const generateAccumulatedCoefficients = (coeffs) => {
  let accumulateX = 0;
  let accumulateY = 0;

  return coeffs.map(([x, y]) => {
    accumulateX += x;
    accumulateY += y;
    return [accumulateX, accumulateY];
  });
};

const deepcopy = (x) => JSON.parse(JSON.stringify(x));

const loopAnimation = (ctx, [offsetX, offsetY], opacity, drawFunc, params, update, iterations=10000) => {
  let count = 0;
  let initialParams = deepcopy(params);

  // Stop the loop if the slide has changed
  const initialSlideState = Reveal.getIndices();
  const loop = (func) => {
    if (initialSlideState.h !== Reveal.getIndices().h) {
      return;
    } else {
      window.requestAnimationFrame(func);
    }
  };

  // Clear the canvas at first
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const callback = () => {
    drawFunc(ctx, [offsetX, offsetY], opacity, ...params);
    params = update(params);
    count++;
    if (count >= iterations) {
      window.setTimeout(() => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        count = 0;
        params = initialParams;
        loop(callback);
      }, 1000);
    } else {
      loop(callback);
    }
  };
  callback();
};

const circles = (ctx, [offsetX, offsetY], opacity, r, coords) => {
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.fill();
  }
  ctx.restore();
};

const circlesStroked = (ctx, [offsetX, offsetY], opacity, r, coords) => {
  ctx.save();
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.stroke();
  }
  ctx.restore();
};

const horizontalLineStroked = (ctx, [offsetX, offsetY], colour, coords) => {
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.strokeStyle = `${colour}` || 'white';
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  ctx.lineTo(coords[1][0], coords[1][1]);
  ctx.stroke();
  ctx.restore();
};

const linesStroked = (ctx, [offsetX, offsetY], colour, lines) => {
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.strokeStyle = `${colour}` || 'white';
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line[0][0], line[0][1]);
    line.slice(1).forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
  ctx.restore();
};

const paint = (ctx, scale, angleOffset, s, point, angle) => {
  switch (s) {
    case 'F':
    case 'G': // Some grammars have two drawing codes, like the dragon curve
      const [x, y] = [
        point[0] + Math.cos(angle) * scale,
        point[1] + Math.sin(angle) * scale,
      ];

      ctx.moveTo(point[0], point[1]);
      ctx.lineTo(x, y);

      point = [x, y];
      break;
    case '+':
      angle += angleOffset;
      break;
    case '-':
      angle -= angleOffset;
      break;
    case '[':
      turtleCache.push([point, angle]);
      break;
    case ']':
      [point, angle] = turtleCache.pop()
      ctx.moveTo(point[0], point[1]);
      break;
  }
  return [point, angle];
};

const generativeTurtle = (ctx, [offsetX, offsetY], colour, scale, angleOffset, state, length) => {
  let point = [0, 0];
  let angle = 0;

  ctx.save();
  ctx.beginPath();
  ctx.translate(offsetX, offsetY);
  ctx.strokeStyle = `${colour}` || 'white';
  state.substring(0, length).split('').forEach(st => [point, angle] = paint(ctx, scale, angleOffset, st, point, angle) );
  ctx.stroke();
  ctx.restore();
};

const setupSlide = (id, width, height, func) => {
  const ctx = initCanvas(`#${id}`, width, height);
  Reveal.addEventListener(id, () => { func(ctx, width, height) }, true);

  // Ensure only the current slide starts animation on refresh
  const thisSlideId = document.querySelector('section.present').getAttribute('data-state');
  if (thisSlideId && id === thisSlideId) {
    func(ctx, width, height);
  }
};

const getWindowWidth = () => window.innerWidth;
const getWindowHeight = () => window.innerHeight;

export default {
  // general
  clamp,
  shuffle,
  random,
  deepcopy,

  // transformation
  move,
  moveRadial,

  // setup
  setupSlide,
  initCanvas,

  // looping
  loopAnimation,

  // procedural generation
  generateRandomLine,
  generateLineCoords,
  generateCircleCoords,
  generateCoefficients,
  generateAccumulatedCoefficients,

  // drawing
  circles,
  circlesStroked,
  horizontalLineStroked,
  linesStroked,
  generativeTurtle,

  // window query
  getWindowWidth,
  getWindowHeight,
};