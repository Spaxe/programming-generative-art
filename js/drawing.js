// Let us find order among chaos

const width = window.innerWidth,
      height = width / 3,
      N = width/2+1,
      scales = [0.05, 0.05];
const ctx = initCanvas('#intro', width, height);
const coords = generateLineCoords(width, N);

const coeffs = generateCoefficients(N, scales);
const coeffs2 = generateAccumulatedCoefficients(coeffs);

startAnimation(ctx, [0, height/2], circles, [0.5, coords],
  ([r, coords]) => {
    const newCoeffs = generateCoefficients(N, scales);
    const newCoeffs2 = generateAccumulatedCoefficients(newCoeffs);

    return [
      r,
      coords.map( (coord, i) => {
        let newCoord = move(coord, coeffs[i], coeffs2[i]);
        newCoord = move(newCoord, newCoeffs[i], newCoeffs2[i]);
        return newCoord;
      })
    ];
  }
);