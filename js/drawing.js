// Let us find order among chaos

/////////////////////////////////////////////////////////////////////////////
// circle
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = window.innerHeight/1.2,
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
})();

/////////////////////////////////////////////////////////////////////////////
// line
/////////////////////////////////////////////////////////////////////////////
(() => {
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
})();


/////////////////////////////////////////////////////////////////////////////
// line - ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
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
})();


/////////////////////////////////////////////////////////////////////////////
// line - ordered - more
/////////////////////////////////////////////////////////////////////////////
(() => {
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
})();


/////////////////////////////////////////////////////////////////////////////
// 2D ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
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
})();


/////////////////////////////////////////////////////////////////////////////
// 2D ordered - 2 veolcities
/////////////////////////////////////////////////////////////////////////////
(() => {
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
})();


/////////////////////////////////////////////////////////////////////////////
// circle ordered
/////////////////////////////////////////////////////////////////////////////
(() => {
  const width = window.innerWidth,
        height = width / 2,
        N = Math.round(width/5+1),
        scales = [0.02, 0.02];
  const ctx = initCanvas('#circle-order', width, height);
  const coords = generateCircleCoords(height / 3, N);

  loopAnimation(ctx, [width/2, height/2],
    circlesStroked,
    [0.5, coords],
    ([r, coords]) => {
      const coeffs = generateCoefficients(N, scales);
      const coeffs2 = generateAccumulatedCoefficients(coeffs);
      return [ r,
        coords.map( (coord, i) => {
          let newCoord = move(coord, coeffs[i], coeffs2[i]);
          for (let w = 0; w < 50; w++) {
            newCoord = move(newCoord, coeffs[(N+i-w) % N], coeffs2[(N+i-w) % N]);
          }
          return newCoord;
        })
      ];
    }
  );
})();