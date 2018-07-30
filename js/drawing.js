// Let us find order among chaos
import utils from './utils.js';
import L from './l-system.js';

/////////////////////////////////////////////////////////////////////////////
// Randomly stamp circles
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'circle',
  utils.getWindowWidth(),
  utils.getWindowHeight()/1.5,

  (ctx, width, height) => {
    const N = 1,
          scales = [ 5, 5 ];
    const coords = [ [0, 0] ];

    utils.loopAnimation(ctx, [width/2, height/2], 0.125,
      utils.circlesStroked,
      [height/4, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);

        return [ r,
          coords.map( (coord, i) =>
            utils.move(coord, coeffs[i], [0, 0])
          )
        ];
      },
      0.98
    );
});


/////////////////////////////////////////////////////////////////////////////
// Directional randomness
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'line',
  utils.getWindowWidth(),
  utils.getWindowWidth()/3,

  (ctx, width, height) => {
    const N = Math.round(width/20+1),
          scales = [0.2, 10];
    const coords = utils.generateLineCoords(width, N);

    utils.loopAnimation(ctx, [0, height/2], 0.125,
      utils.circlesStroked,
      [5, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);

        return [ r,
          coords.map( (coord, i) =>
            utils.move(coord, coeffs[i], [0, 0])
          )
        ];
      },
      0.975
    );
});


/////////////////////////////////////////////////////////////////////////////
// Shepherding random numbers
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'line-order',
  utils.getWindowWidth(),
  utils.getWindowWidth()/3,

  (ctx, width, height) => {
    const N = Math.round(width/20+1),
          scales = [0.1, 1.5];
    const coords = utils.generateLineCoords(width, N);

    utils.loopAnimation(ctx, [0, height/2], 0.125,
      utils.circlesStroked,
      [5, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);
        const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);
        return [ r,
          coords.map( (coord, i) =>
            utils.move(coord, coeffs[i], coeffs2[i])
          )
        ];
      },
      0.98
    );
});


/////////////////////////////////////////////////////////////////////////////
// More shepherding random numbers
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'line-order-more',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    const N = Math.round(width/3+1),
          scales = [0.1, 1];
    const coords = utils.generateLineCoords(width, N);

    utils.loopAnimation(ctx, [0, height/2], 0.125,
      utils.circlesStroked,
      [0.75, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);
        const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);
        return [ r,
          coords.map( (coord, i) =>
            utils.move(coord, coeffs[i], coeffs2[i])
          )
        ];
      },
      0.99
    );
});


/////////////////////////////////////////////////////////////////////////////
// Shepherding in 2D
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'line-order-2d',
  utils.getWindowWidth(),
  utils.getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/3+1),
          scales = [1, 1];
    const coords = utils.generateLineCoords(width, N);

    utils.loopAnimation(ctx, [0, height/2], 0.125,
      utils.circlesStroked,
      [0.5, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);
        const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);
        return [ r,
          coords.map( (coord, i) =>
            utils.move(coord, coeffs[i], coeffs2[i])
          )
        ];
      }
    );
});


/////////////////////////////////////////////////////////////////////////////
// Two random volecities in 2D
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'line-order-2d-small-step',
  utils.getWindowWidth(),
  utils.getWindowWidth()/2,

  (ctx, width, height) => {
    const N = Math.round(width/5+1),
          scales = [0.3, 0.3],
          scales2 = [2.5, 2.5];
    const coords = utils.generateLineCoords(width, N);
    const coeffs = utils.generateCoefficients(N, scales);
    const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);

    utils.loopAnimation(ctx, [0, height/2], 0.25,
      utils.circlesStroked,
      [0.5, coords],
      ([r, coords]) => {
        const newCoeffs = utils.generateCoefficients(N, scales2);

        return [ r,
          coords.map( (coord, i) => {
            let newCoord = utils.move(coord, coeffs[i], coeffs2[i]);
            newCoord = utils.move(newCoord, newCoeffs[i], [0, 0]);
            return newCoord;
          })
        ];
      }
    );
});


/////////////////////////////////////////////////////////////////////////////
// Shepherding on circle
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'circle-order',
  utils.getWindowWidth(),
  utils.getWindowWidth()/3,

  (ctx, width, height) => {
    const N = Math.round(width/3+1),
          scales = [0.01, 0.01],
          scales2 = [0.05, 0.05];
    const coords = utils.generateCircleCoords(height / 3, N);

    utils.loopAnimation(ctx, [width/2, height/2], 0.125,
      utils.circlesStroked,
      [0.5, coords],
      ([r, coords]) => {
        const coeffs = utils.generateCoefficients(N, scales);
        const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);
        const newCoeffs = utils.generateCoefficients(N, scales2);

        return [ r,
          coords.map( (coord, i) => {
            let newCoord = utils.moveRadial(coord, 1.000);
            newCoord = utils.move(newCoord, coeffs[i], coeffs2[i]);
            newCoord = utils.move(newCoord, newCoeffs[i], [0, 0]);
            for (let w = 0; w < 100; w++) {
              newCoord = utils.move(newCoord, coeffs[(N+i-w) % N], coeffs2[(N+i-w) % N]);
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
utils.setupSlide(
  'penrose',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    utils.loopAnimation(ctx, [width/2, height/2], 0.25,
      utils.generativeTurtle,
      [L.penrose.angle, L.penrose.start],
      ([angleOffset, state]) => {
        if (state.length > 10000) {
          return [angleOffset, state];
        }
        return [angleOffset, L.apply(L.penrose.rule, state)];
      },
      0.9999
    );
});