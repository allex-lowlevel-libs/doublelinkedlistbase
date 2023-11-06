function createListMixin (inherit) {
  'use strict';

  var ControllerCtor = require('./dlistcontrollercreator')(inherit);/*,
    assert = require('./assert');*/

  function ListMixin () {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.controller = null;
  }

  ListMixin.addMethods = function (ctor) {
    ctor.prototype.destroy = ListMixin.prototype.destroy;
    ctor.prototype.assureForController = ListMixin.prototype.assureForController;
    ctor.prototype.remove = ListMixin.prototype.remove;
    ctor.prototype.traverse = ListMixin.prototype.traverse;
    ctor.prototype.reduce = ListMixin.prototype.reduce;
    ctor.prototype.purge = ListMixin.prototype.purge;
  };

  ListMixin.prototype.destroy = function(){
    if (this.controller) {
      this.controller.shouldDestroy = true;
      return;
    }
    if (this.length) {
      this.purge();
      return;
    }
    this.container = null;
    this.length = null;
    this.tail = null;
    this.head = null;
  };

  ListMixin.prototype.assureForController = function () {
    if ('number' !== typeof this.length) {
      return false;
    }
    //assert('number' === typeof this.length);
    if (!this.controller) {
      this.controller = new ControllerCtor(this);
    }
    return true;
  };

  ListMixin.prototype.remove = function (item) {
    var ret;
    if (!item) {
      return;
    }
    /*
    if (item === null || 'object' !== typeof item || !(item instanceof DListItem)){
      throw new Error('Item is not instance of DListItem');
    }
    */
    ret = item.content;
    if (!this.assureForController()) {
      return;
    }
    this.controller.remove(item);
    item.destroy();
    return ret;
  };

  ListMixin.prototype.traverse = function (func) {
    if ('function' !== typeof func){
      throw new Error('First parameter is not a function.');
    }
    if (!this.assureForController()) {
      return;
    }
    this.controller.traverse(func);
  };

  function reducer (reduceobj, item) {
    try {
      reduceobj.seed = reduceobj.func(reduceobj.seed, item);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  ListMixin.prototype.reduce = function (func, seed) {
    var reduceobj, ret;
    if ('function' !== typeof func){
      throw new Error('First parameter is not a function.');
    }
    reduceobj = {func: func, seed: seed};
    this.traverse(reducer.bind(null, reduceobj));
    ret = reduceobj.seed;
    reduceobj = null;
    return ret;
  };

  ListMixin.prototype.purge = function () {
    if (!this.assureForController()) {
      return;
    }
    this.controller.shouldDestroy = true;
    this.controller.purge();
  };

  return ListMixin;
}
module.exports = createListMixin;