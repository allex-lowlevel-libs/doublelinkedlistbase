function createDListBase (inherit) {
  'use strict';

  return {
    Mixin: require('./listmixincreator')(inherit),
    Item: require('./DListItem')
  };
}
module.exports = createDListBase;
