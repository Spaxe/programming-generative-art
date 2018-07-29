/* Simple L-System implementation
*/
const apply = (rule, state) => {
  return state.split('').map(d => {
    return rule.hasOwnProperty(d) ? rule[d] : d;
  }).join('');
};

export default {
  apply
};