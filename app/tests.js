
require('babel-core/register')({
  presets: [ 'es2015', 'stage-2'],
  // plugins: ["transform-async-to-generator"]
});
require('babel-polyfill');

require('./client/utils/tests');
require('./client/modules/nine/utils/tests');
require('./client/modules/ttt/utils/tests');
require('./client/modules/border/utils/tests');
