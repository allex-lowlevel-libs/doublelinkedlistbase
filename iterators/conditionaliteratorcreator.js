function createConditionalIterator (inherit, mylib) {
  'use strict';

  var Iterator = mylib.Iterator;

  function ConditionalIterator (controller, item) {
    Iterator.call(this, controller, item);
  }
  inherit(ConditionalIterator, Iterator);
  ConditionalIterator.prototype.shouldFinishRun = function (runstepresult) {
    console.log(this.constructor.name, 'shouldFinishRun');
    return 'undefined' !== typeof runstepresult;
  };

  mylib.ConditionalIterator = ConditionalIterator;
}
module.exports = createConditionalIterator;