// Let us find order among chaos

/////////////////////////////////////////////////////////////////////////////
// circle
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'circle',
  getWindowWidth(),
  getWindowHeight()/1.5,

  (ctx, width, height) => {
    const N = 1,
          scales = [10, 10];
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
});

/////////////////////////////////////////////////////////////////////////////
// line
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'line',
  getWindowWidth(),
  getWindowWidth()/3,

  (ctx, width, height) => {
    const N = Math.round(width/20+1),
          scales = [0.2, 10];
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
});


/////////////////////////////////////////////////////////////////////////////
// line - ordered
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'line-order',
  getWindowWidth(),
  getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/20+1),
          scales = [0.1, 1];
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
});


/////////////////////////////////////////////////////////////////////////////
// line - ordered - more
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'line-order-more',
  getWindowWidth(),
  getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/5+1),
          scales = [0.1, 2];
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
});


/////////////////////////////////////////////////////////////////////////////
// 2D ordered
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'line-order-2d',
  getWindowWidth(),
  getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/5+1),
          scales = [1.5, 1.5];
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
});


/////////////////////////////////////////////////////////////////////////////
// 2D ordered - 2 veolcities
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'line-order-2d-small-step',
  getWindowWidth(),
  getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/5+1),
          scales = [0.3, 0.3],
          scales2 = [2.5, 2.5];
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
});


/////////////////////////////////////////////////////////////////////////////
// circle ordered
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'circle-order',
  getWindowWidth(),
  getWindowWidth()/3,

  (ctx, width, height) => {
    const N = Math.round(width/5+1),
          scales = [0.02, 0.02],
          scales2 = [2.5, 2.5];
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
});


/////////////////////////////////////////////////////////////////////////////
// generative geometry
/////////////////////////////////////////////////////////////////////////////
setupSlide(
  'generative',
  getWindowWidth(),
  getWindowHeight(),

  (ctx, width, height) => {
    const scales = [width/14, height/14],
          coeffScales = [width/14, height/14];
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
});