const id = x => x;
let random = new alea(Math.random());
window.setInterval( () => {
  random = new alea(Math.random());
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

const loopAnimation = (ctx, [offsetX, offsetY], opacity, drawFunc, params, update, fade=0.992) => {
  let energy = 1;
  let exhaust = 0.001;
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
    energy *= fade;
    if (energy < exhaust) {
      window.setTimeout(() => {
        ctx.beginPath();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        energy = 1;
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
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.fill();
  }
};

const circlesStroked = (ctx, [offsetX, offsetY], opacity, r, coords) => {
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.stroke();
  }
};

const generativeLines = (ctx, [offsetX, offsetY], opacity, thickness, coords) => {
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
  ctx.beginPath();

  const randomShape = random();

  if (randomShape < 0.1) { // draw nothing

  } else if (randomShape < 0.2) { // draw a thick line
    ctx.lineWidth = thickness * 5;
    ctx.moveTo(offsetX + coords[0][0], offsetY + coords[0][1]);
    ctx.lineTo(offsetX + coords[1][0], offsetY + coords[1][1]);
    ctx.stroke();
    ctx.lineWidth = thickness;
    ctx.lineTo(offsetX + coords[2][0], offsetY + coords[2][1]);
    ctx.stroke();
  } else if (randomShape < 0.225) {  // draw a circle
    ctx.lineWidth = thickness;
    ctx.arc(offsetX+coords[2][0], offsetY+coords[2][1], Math.max(random() * 50, 10), 0, 2*Math.PI, true);
    ctx.stroke();
  } else {  // draw ... a line
    ctx.lineWidth = thickness;
    ctx.moveTo(offsetX + coords[0][0], offsetY + coords[0][1]);
    ctx.lineTo(offsetX + coords[1][0], offsetY + coords[1][1]);
    ctx.lineTo(offsetX + coords[2][0], offsetY + coords[2][1]);
    ctx.stroke();
  }

};

const setupSlide = (id, width, height, func) => {
  const ctx = initCanvas(`#${id}`, width, height);
  Reveal.addEventListener(id, () => { func(ctx, width, height) }, false);
};

const getWindowWidth = () => window.innerWidth;
const getWindowHeight = () => window.innerHeight;