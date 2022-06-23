function createSafeIterator (inherit, mylib) {
  'use strict';

  var Iterator = mylib.Iterator;

  function SafeIterator (controller, item, errorcaption) {
    Iterator.call(this, controller, item);
    this.errorcaption = errorcaption || 'Error in SafeIterator';
  }
  inherit(SafeIterator, Iterator);
  SafeIterator.prototype.destroy = function () {
    this.errorcaption = null;
    Iterator.prototype.destroy.call(this);
  }
  SafeIterator.prototype.obtainStepResult = function (item) {
    try {
      return Iterator.prototype.obtainStepResult.call(this, item);
    } catch (e) {
      console.log(this.errorcaption+' :', e);
      return;
    }
  };

  mylib.SafeIterator = SafeIterator;
}
module.exports = createSafeIterator;