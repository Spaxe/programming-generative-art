const random = Math.random;

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

const initCanvas = (selector, width=600, height=300) => {
  const parent = document.querySelector(selector);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  parent.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  return ctx;
};

const generateLineCoords = (width, n) => {
  let coords = [];
  n = clamp(2, width, n);
  const gap = width / (n - 1);
  for (let i = 0; i < n; i++) {
    coords.push([i * gap, 0]);
  }
  return coords;
};

const generateCoefficients = (n, scales=[0.1, 0.1]) => {
  let accumulateX = 0;
  let accumulateY = 0;
  let coeffs = [];
  let coeffs2 = [];
  n = Math.max(n, 2);

  for (let i = 0; i < n; i++) {
    let dx = (random() - 0.5) * scales[0];
    let dy = (random() - 0.5) * scales[1];
    coeffs.push([dx, dy]);
    accumulateX = accumulateX + dx;
    accumulateY = accumulateY + dy;
    coeffs2.push([accumulateX, accumulateY]);
  }
  return [coeffs, coeffs2];
};

const animate = (func, params, update, maxIterations=500, iteration=0) => {
  const callback = () => {
    func.apply(null, params);
    let coords = params[params.length-1];
    params[params.length-1] = update(coords);
    iteration++;
    if (iteration < maxIterations) {
      window.requestAnimationFrame(callback);
    }
  };
  callback();
};

const circle = (ctx, [x, y], r, fill) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI, true);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
};


const drawMap = (shape, shapeParams, context, [offsetX, offsetY], coords) => {
  coords.forEach(([x, y]) => {
    shape(context, [x+offsetX, y+offsetY], ...shapeParams);
  });
};

const drawCircles = (...args) => {
  return drawMap(circle, [0.5, 'white'], ...args);
};