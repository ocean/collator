import _ from 'lodash';

exports.remover = (input) => {
  const a = _.split(input, ' ');

  const c = _.remove(a, n => !(n === n.toUpperCase() && /[A-Z]/.test(n)));

  return _.join(c, ' ');
};
