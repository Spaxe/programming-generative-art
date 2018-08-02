// Let us find order among chaos
import utils from './utils.js';
import L from './l-system.js';

/////////////////////////////////////////////////////////////////////////////
// Cover
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'cover-slide',
  utils.getWindowWidth(),
  utils.getWindowHeight()/5,

  (ctx, width, height) => {
    let state = L.penrose.start;
    let rule = L.penrose.rule;
    for (let i = 0; i < 4; i++) {
      state = L.apply(rule, state);
    }
    const speed = 100;
    const scale = 10;

    utils.loopAnimation(ctx, [width/2, height/10], 'rgb(255, 189, 74, 0.05)',
      utils.generativeTurtle,
      [scale, L.penrose.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      1000
    );
});

/////////////////////////////////////////////////////////////////////////////
// Knowledge
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'knowledge',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    ctx.save();
    ctx.font = `${width/50}px 'Montserrat', 'Open Sans', sans-serif`;
    ctx.translate(width/2, height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('Knowledge + Tools', -width/4, 0);
    ctx.textAlign = 'right';
    ctx.fillText('Uncertainty', width/4, 0);

    ctx.lineWidth = width / 400;
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(-width/22, -width/150);
    ctx.lineTo(width/9, -width/150);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
);


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
      500
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
      400
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
      400
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
      1000
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
      },
      1000
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
      },
      500
    );
});


/////////////////////////////////////////////////////////////////////////////
// Divergent
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'divergent',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    const N = 125;
    const M = 50;
    const scales = [0.1, 0.1];
    const lines = [];
    for (let i = 0; i < M; i++) {
      const generatedLine = utils.generateLineCoords(width * 0.8, N).map(coord => {
        return utils.move(coord, [0, 5 * i], [0, 0]);
      });
      lines.push(generatedLine);
    }

    let coeffs = [];
    for (let i = 0; i < M; i++) {
      coeffs.push(utils.generateCoefficients(N, scales));
    }

    let accumCoeffs = [];
    for (let i = 0; i < M; i++) {
      accumCoeffs.push(utils.generateAccumulatedCoefficients(coeffs[i]));
    }

    utils.loopAnimation(ctx, [width/10, height/3], 'rgb(255, 255, 255, 0.02)',
      utils.linesStroked,
      [lines],
      ([lines]) => {

        lines = lines.map((line, i) => {
          return line.map((coords, j) => {
            return utils.move(coords, coeffs[i][j], accumCoeffs[i][j]);
          });
        });

        return [
          lines
        ];
      },
      250
    );
});

/////////////////////////////////////////////////////////////////////////////
// Shepherding on circle
/////////////////////////////////////////////////////////////////////////////
// utils.setupSlide(
//   'circle-order',
//   utils.getWindowWidth(),
//   utils.getWindowWidth()/3,

//   (ctx, width, height) => {
//     const N = Math.round(width/3+1),
//           scales = [0.01, 0.01],
//           scales2 = [0.05, 0.05];
//     const coords = utils.generateCircleCoords(height / 3, N);

//     utils.loopAnimation(ctx, [width/2, height/2], 0.125,
//       utils.circlesStroked,
//       [0.5, coords],
//       ([r, coords]) => {
//         const coeffs = utils.generateCoefficients(N, scales);
//         const coeffs2 = utils.generateAccumulatedCoefficients(coeffs);
//         const newCoeffs = utils.generateCoefficients(N, scales2);

//         return [ r,
//           coords.map( (coord, i) => {
//             let newCoord = utils.moveRadial(coord, 1.000);
//             newCoord = utils.move(newCoord, coeffs[i], coeffs2[i]);
//             newCoord = utils.move(newCoord, newCoeffs[i], [0, 0]);
//             for (let w = 0; w < 100; w++) {
//               newCoord = utils.move(newCoord, coeffs[(N+i-w) % N], coeffs2[(N+i-w) % N]);
//             }
//             return newCoord;
//           })
//         ];
//       },
//       500
//     );
// });


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-1',
  utils.getWindowWidth()/2,
  utils.getWindowHeight()/2,

  (ctx, width, height) => {
    let state = L.rectangles.start;
    const speed = 1;
    const scale = 100;

    utils.loopAnimation(ctx, [width/3.5, height/2.5], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles 2
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-2',
  utils.getWindowWidth()/2,
  utils.getWindowHeight()/3,

  (ctx, width, height) => {
    let state = L.rectangles.start;
    let state2 = L.apply(L.rectangles.rule, state);
    const speed = 1;
    const scale = 50;

    utils.loopAnimation(ctx, [width/4, height/2], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );

    utils.loopAnimation(ctx, [width/4, height/2], 'rgb(255, 189, 74, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state2, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles 3
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-3',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    let state2 = L.rectangles.start;
    for (let i = 0; i < 1; i++) {
      state2 = L.apply(L.rectangles.rule, state2);
    }
    let state3 = L.rectangles.start;
    for (let i = 0; i < 2; i++) {
      state3 = L.apply(L.rectangles.rule, state3);
    }
    const speed = 100;
    const scale = 25;

    utils.loopAnimation(ctx, [width/1.75, height/2.5], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state2, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );

    utils.loopAnimation(ctx, [width/1.75, height/2.5], 'rgb(255, 189, 74, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state3, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles 4
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-4',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    let state3 = L.rectangles.start;
    for (let i = 0; i < 2; i++) {
      state3 = L.apply(L.rectangles.rule, state3);
    }
    let state4 = L.rectangles.start;
    for (let i = 0; i < 3; i++) {
      state4 = L.apply(L.rectangles.rule, state4);
    }
    const speed = 100;
    const scale = 25;

    utils.loopAnimation(ctx, [width/1.75, height/2.5], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state3, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );

    utils.loopAnimation(ctx, [width/1.75, height/2.5], 'rgb(255, 189, 74, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state4, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles 5
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-5',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    let state4 = L.rectangles.start;
    for (let i = 0; i < 3; i++) {
      state4 = L.apply(L.rectangles.rule, state4);
    }
    let state5 = L.rectangles.start;
    for (let i = 0; i < 4; i++) {
      state5 = L.apply(L.rectangles.rule, state5);
    }
    const speed = 250;
    const scale = 10;

    utils.loopAnimation(ctx, [width/2.5, height/1.5], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state4, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );

    utils.loopAnimation(ctx, [width/2.5, height/1.5], 'rgb(255, 189, 74, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state5, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles 6
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-6',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    let state5 = L.rectangles.start;
    for (let i = 0; i < 4; i++) {
      state5 = L.apply(L.rectangles.rule, state5);
    }
    let state6 = L.rectangles.start;
    for (let i = 0; i < 5; i++) {
      state6 = L.apply(L.rectangles.rule, state6);
    }
    const speed = 10000;
    const scale = 10;

    utils.loopAnimation(ctx, [width/2.5, height/1.5], 'rgba(255, 255, 255, 0.5)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state5, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );

    utils.loopAnimation(ctx, [width/2.5, height/1.5], 'rgb(255, 189, 74, 0.5)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state6, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      10000
    );
});


/////////////////////////////////////////////////////////////////////////////
// L-Systems: Rectangles
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'rectangles-mutate',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    let state = L.rectangles.start;
    let rule = L.rectangles.rule;
    for (let i = 0; i < 4; i++) {
      rule = L.mutate(rule);
      state = L.apply(rule, state);
    }
    const speed = 100;
    const scale = 10;

    utils.loopAnimation(ctx, [width/2, height/2], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [scale, L.rectangles.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      1000
    );
});


/////////////////////////////////////////////////////////////////////////////
// Hilbert
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'hilbert',
  utils.getWindowWidth(),
  utils.getWindowHeight() / 1.2,

  (ctx, width, height) => {
    // apply the rule N times
    let state = L.hilbert.start;
    for (let i = 0; i < 7; i++) {
      state = L.apply(L.hilbert.rule, state);
    }
    const speed = 500;

    utils.loopAnimation(ctx, [(width - 650)/2, (height - 650)/2], 'rgba(255, 255, 255, 0.1)',
      utils.generativeTurtle,
      [5, L.hilbert.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      150
    );
});


/////////////////////////////////////////////////////////////////////////////
// Penrose
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'penrose',
  utils.getWindowWidth(),
  utils.getWindowHeight() / 1.2,

  (ctx, width, height) => {
    // apply the rule N times
    let state = L.penrose.start;
    for (let i = 0; i < 5; i++) {
      state = L.apply(L.penrose.rule, state);
    }
    const speed = 700;

    utils.loopAnimation(ctx, [width/2, height/2], 'rgba(255, 255, 255, 0.25)',
      utils.generativeTurtle,
      [28, L.penrose.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      150
    );
});


/////////////////////////////////////////////////////////////////////////////
// Dragon curve
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'dragon-curve',
  utils.getWindowWidth(),
  utils.getWindowHeight() / 1.2,

  (ctx, width, height) => {
    // apply the rule N times
    let state = L.dragon.start;
    for (let i = 0; i < 10; i++) {
      state = L.apply(L.dragon.rule, state);
    }
    const speed = 100;

    utils.loopAnimation(ctx, [width/2, height/4], 'rgb(255, 189, 74, 0.5)',
      utils.generativeTurtle,
      [10, L.dragon.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      150
    );
});

/////////////////////////////////////////////////////////////////////////////
// Dragon curve - mutated
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'dragon-curve-mutate',
  utils.getWindowWidth(),
  utils.getWindowHeight(),

  (ctx, width, height) => {
    // apply the rule N times
    let state = L.dragon_kinda.start;
    let rule = L.dragon_kinda.rule;
    for (let i = 0; i < 6; i++) {
      rule = L.mutate(rule);
      state = L.apply(rule, state);
    }
    const speed = 400;

    utils.loopAnimation(ctx, [width/2, height/2], 'rgb(255, 189, 74, 0.5)',
      utils.generativeTurtle,
      [5, L.dragon_kinda.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      150
    );
});


/////////////////////////////////////////////////////////////////////////////
// Cover - End
/////////////////////////////////////////////////////////////////////////////
utils.setupSlide(
  'end-slide',
  utils.getWindowWidth(),
  utils.getWindowHeight()/5,

  (ctx, width, height) => {
    let state = L.gosper.start;
    let rule = L.gosper.rule;
    for (let i = 0; i < 4; i++) {
      state = L.apply(rule, state);
    }
    const speed = 100;
    const scale = 10;

    utils.loopAnimation(ctx, [width/1.7, height/10], 'rgb(255, 189, 74, 0.05)',
      utils.generativeTurtle,
      [scale, L.gosper.angle, state, 0],
      ([scale, angleOffset, state, length]) => {
        // Find the next drawing state for smooth drawing animation
        return [scale, angleOffset, state, length+speed];
      },
      1000
    );
});