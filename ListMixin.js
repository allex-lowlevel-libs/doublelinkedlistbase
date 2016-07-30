'use strict';

var ControllerCtor = require('./DList'),
  assert = require('./assert');

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
  assert('number' === typeof this.length);
  if (!this.controller) {
    this.controller = new ControllerCtor(this);
  }
};

ListMixin.prototype.remove = function (item) {
  var ret;
  if (!item) {
    return;
  }
  if (item === null || 'object' !== typeof item || !(item instanceof DListItem)){
    throw new Error('Item is not instance of DListItem');
  }
  ret = item.content;
  this.assureForController();
  this.controller.remove(item);
  item.destroy();
  return ret;
};

ListMixin.prototype.traverse = function (func) {
  if ('function' !== typeof func){
    throw new Error('First parameter is not a function.');
  }
  this.assureForController();
  this.controller.traverse(func);
};

ListMixin.prototype.purge = function () {
  this.assureForController();
  this.controller.shouldDestroy = true;
  this.controller.purge();
};


module.exports = ListMixin;
