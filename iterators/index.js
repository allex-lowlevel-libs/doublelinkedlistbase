function createIterators(inherit) {
  'use strict';
  var mylib = {};

  mylib.Iterator = require('./Iterator');
  require('./conditionaliteratorcreator')(inherit, mylib);
  require('./safeiteratorcreator')(inherit, mylib);

  return mylib;
}
module.exports = createIterators;