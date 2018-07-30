/* Simple L-System implementation */
const apply = (rule, state) => {
  return state.split('').map(d => {
    return rule.hasOwnProperty(d) ? rule[d] : d;
  }).join('');
};

const rectangles = {
  start: 'F-F-F-F',
  angle: 90 / 180 * Math.PI,
  rule: {
    F: 'FF-F+F-F-FF',
  }
};

const penrose = {
  start: '[X]++[X]++[X]++[X]++[X]',
  angle: 36 / 180 * Math.PI,
  rule: {
    F: '',
    W: 'YF++ZF----XF[-YF----WF]++',
    X: '+YF--ZF[---WF--XF]+',
    Y: '-WF++XF[+++YF++ZF]-',
    Z: '--YF++++WF[+ZF++++XF]--XF',
  }
};

const hilbert = {
  start: 'A',
  angle: 90 / 180 * Math.PI,
  rule: {
    A: '+BF-AFA-FB+',
    B: '-AF+BFB+FA-',
  }
};

export default {
  apply,

  // Sample L-Systems
  rectangles,
  penrose,
  hilbert,
};