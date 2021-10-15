module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'consistent-return': 0,
    'no-shadow': 'no',
  },
};
