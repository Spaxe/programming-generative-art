// Let us find order among chaos

const width = window.innerWidth/2,
      height = width / 3 * 1.5,
      N = width/2+1;
const ctx = initCanvas('#intro', width, height);
const coords = generateLineCoords(width, N);
const [coeffs, coeffs2] = generateCoefficients(N, scales=[0.1, 0.1]);
animate(drawCircles,
  [
    ctx, [0, height/2], coords
  ],
  (coords) =>
    coords.map( (coord, i) => {
      let newCoord = move(coord, coeffs[i], coeffs2[i]);
      return newCoord;
    }
  )
);