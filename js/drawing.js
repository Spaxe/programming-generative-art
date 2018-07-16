// Let us find order among chaos

/////////////////////////////////////////////////////////////////////////////
// circle
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = window.innerHeight/1.5;
  initCanvas('#circle', width, height);
})();

Reveal.addEventListener('circle', () => {
  const width = window.innerWidth,
        height = window.innerHeight/1.5,
        N = 1,
        scales = [10, 10];
  const ctx = initCanvas('#circle', width, height);
  const coords = [ [0, 0] ];

  loopAnimation(ctx, [width/2, height/2],
    circlesStroked,
    [height/4, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);

      return [ r,
        coords.map( (coord, i) =>
          move(coord, coeffs[i], [0, 0])
        )
      ];
    },
    0.95
  );
}, false);

/////////////////////////////////////////////////////////////////////////////
// line
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 3;
  initCanvas('#line', width, height);
})();

Reveal.addEventListener('line', () => {
  const width = window.innerWidth,
        height = width / 3,
        N = Math.round(width/20+1),
        scales = [0.2, 10];
  const ctx = initCanvas('#line', width, height);
  const coords = generateLineCoords(width, N);

  loopAnimation(ctx, [0, height/2],
    circlesStroked,
    [5, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);

      return [ r,
        coords.map( (coord, i) =>
          move(coord, coeffs[i], [0, 0])
        )
      ];
    },
    0.98
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// line - ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 3;
  initCanvas('#line-order', width, height);
})();

Reveal.addEventListener('line-order', () => {
  const width = window.innerWidth,
        height = width / 3,
        N = Math.round(width/20+1),
        scales = [0.1, 1];
  const ctx = initCanvas('#line-order', width, height);
  const coords = generateLineCoords(width, N);

  loopAnimation(ctx, [0, height/2],
    circlesStroked,
    [5, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);
      const coeffs2 = generateAccumulatedCoefficients(coeffs);
      return [ r,
        coords.map( (coord, i) =>
          move(coord, coeffs[i], coeffs2[i])
        )
      ];
    },
    0.99
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// line - ordered - more
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 2;
  initCanvas('#line-order-more', width, height);
})();

Reveal.addEventListener('line-order-more', () => {
  const width = window.innerWidth,
        height = width / 2,
        N = Math.round(width/5+1),
        scales = [0.1, 2];
  const ctx = initCanvas('#line-order-more', width, height);
  const coords = generateLineCoords(width, N);

  loopAnimation(ctx, [0, height/2],
    circlesStroked,
    [1, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);
      const coeffs2 = generateAccumulatedCoefficients(coeffs);
      return [ r,
        coords.map( (coord, i) =>
          move(coord, coeffs[i], coeffs2[i])
        )
      ];
    }
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// 2D ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 2;
  initCanvas('#line-order-2d', width, height);
})();

Reveal.addEventListener('line-order-2d', () => {
  const width = window.innerWidth,
        height = width / 2,
        N = Math.round(width/5+1),
        scales = [1.5, 1.5];
  const ctx = initCanvas('#line-order-2d', width, height);
  const coords = generateLineCoords(width, N);

  loopAnimation(ctx, [0, height/2],
    circlesStroked,
    [0.5, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);
      const coeffs2 = generateAccumulatedCoefficients(coeffs);
      return [ r,
        coords.map( (coord, i) =>
          move(coord, coeffs[i], coeffs2[i])
        )
      ];
    }
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// 2D ordered - 2 veolcities
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 2;
  initCanvas('#line-order-2d-small-step', width, height);
})();

Reveal.addEventListener('line-order-2d-small-step', () => {
  const width = window.innerWidth,
        height = width / 2,
        N = Math.round(width/5+1),
        scales = [0.3, 0.3],
        scales2 = [2.5, 2.5];
  const ctx = initCanvas('#line-order-2d-small-step', width, height);
  const coords = generateLineCoords(width, N);
  const coeffs = generateCoefficients(N, scales);
  const coeffs2 = generateAccumulatedCoefficients(coeffs);

  loopAnimation(ctx, [0, height/2],
    circlesStroked,
    [0.5, coords],
    ([r, coords]) => {
      const newCoeffs = generateCoefficients(N, scales2);

      return [ r,
        coords.map( (coord, i) => {
          let newCoord = move(coord, coeffs[i], coeffs2[i]);
          newCoord = move(newCoord, newCoeffs[i], [0, 0]);
          return newCoord;
        })
      ];
    }
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// circle ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 3;
  initCanvas('#circle-order', width, height);
})();

Reveal.addEventListener('circle-order', () => {
  const width = window.innerWidth,
        height = width / 3,
        N = Math.round(width/5+1),
        scales = [0.02, 0.02],
        scales2 = [2.5, 2.5];
  const ctx = initCanvas('#circle-order', width, height);
  const coords = generateCircleCoords(height / 3, N);

  loopAnimation(ctx, [width/2, height/2],
    circlesStroked,
    [0.5, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);
      const coeffs2 = generateAccumulatedCoefficients(coeffs);
      const newCoeffs = generateCoefficients(N, scales2);

      return [ r,
        coords.map( (coord, i) => {
          let newCoord = moveRadial(coord, 1.001);
          newCoord = move(newCoord, coeffs[i], coeffs2[i]);
          newCoord = move(newCoord, newCoeffs[i], [0, 0]);
          for (let w = 0; w < 50; w++) {
            newCoord = move(newCoord, coeffs[(N+i-w) % N], coeffs2[(N+i-w) % N]);
          }
          return newCoord;
        })
      ];
    }
  );
}, false);


/////////////////////////////////////////////////////////////////////////////
// generative geometry
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = window.innerHeight;
  initCanvas('#generative', width, height);
})();

Reveal.addEventListener('generative', () => {
  const width = window.innerWidth,
        height = window.innerHeight,
        scales = [width/14, height/14],
        coeffScales = [width/14, height/14];
  const ctx = initCanvas('#generative', width, height);
  const coords = generateRandomLine(scales);
  let trianglePoint = coords[0];

  loopAnimation(ctx, [width/2, height/2],
    generativeLines,
    [1, coords],
    ([thickness, coords]) => {

      const coeffs = generateCoefficients(coords.length, coeffScales);
      const movedCoords = move(coords[2], coeffs[0], coeffs[1]);
      let movedCoords2 = move(movedCoords, [0, 0], coeffs[2]);
      movedCoords2 = moveRadial(movedCoords2, 0.99);

      const S = random();

      if (S < 0.9) { // return to second previous path and form triangle

        let output = [ thickness,
          [
            coords[2],
            trianglePoint,
            movedCoords,
          ]
        ];
        trianglePoint = coords[0];
        return output;

      } else {

        trianglePoint = coords[0];
        return [ thickness,
          [
            coords[2],
            movedCoords,
            movedCoords2,
          ],
        ];

      }
    },
    0.9925
  );
}, false);