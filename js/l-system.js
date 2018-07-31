import utils from './utils.js';

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

const dragon = {
  start: 'F',
  angle: 90 / 180 * Math.PI,
  rule: {
    F: 'F+G+',
    G: '-F-G',
  }
};

const dragon_kinda = {
  start: 'F',
  angle: 60 / 180 * Math.PI,
  rule: {
    F: '+F+G++F++G+G+F+',
    G: '-F-G--F--G-G-F-',
  }
};

const gosper = {
  start: 'F',
  angle: 60 / 180 * Math.PI,
  rule: {
    F: 'F+G++G-F--FF-G+',
    G: '-F+GG++G+F--F-G',
  }
};

// Randomly mutate a rule
const mutate = rule => {
  const newRule = utils.deepcopy(rule);
  const mutateKey = utils.shuffle(Object.keys(newRule))[0];
  const original = newRule[mutateKey].substring(0).split('');
  const mutateIndex = Math.floor(utils.random() * original.length);
  const mutateTarget = utils.shuffle(original)[0];
  if (original[mutateIndex] !== '['
   && original[mutateIndex] !== ']'
   && mutateTarget !== '['
   && mutateTarget !== ']') {
    original[mutateIndex] = mutateTarget;
    newRule[mutateKey] = original.join('');
  }
  return newRule;
};

export default {
  apply,
  mutate,

  // Sample L-Systems
  rectangles,
  penrose,
  hilbert,
  dragon,
  dragon_kinda,
  gosper,
};