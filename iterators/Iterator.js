'use strict';

var assert = require('../assert');

function Iterator (controller, item) {
  this.controller = controller;
  this.item = item;
  this.targetItem = null;
  this.iteratorFound = null;
  this.iteratorTarget = null;
  if (!(controller && controller.list && controller.list.head && controller.list.head.hasOwnProperty('content'))) {
    this.destroy();
    return;
  } else {
    this.setTargetItem(controller.list.head);
  }
}

Iterator.prototype.destroy = function () {
  this.iteratorTarget = null;
  this.iteratorFound = null;
  this.targetItem = null;
  this.item = null;
  this.controller = null;
};

Iterator.prototype.setTargetItem = function (item) {
  if (this.iteratorTarget) {
    this.iteratorTarget.setIterator(this.iteratorFound);
  }
  this.targetItem = item;
  this.iteratorTarget = item;
  this.iteratorFound = item ? item.setIterator(this) : null;
  this.checkTargetItem();
};

Iterator.prototype.run = function (conditionally) {
  var ret, item, sd;
  if (arguments.length > 0) {
    console.error('DList iterator does not accept any parameters in the run method');
    return;
  }
  if (!this.targetItem) {
    return;
  }
  while(this.targetItem) {
    item = this.targetItem;
    sd = item.isSelfDestroyable;
    if (sd) {
      this.targetItem = this.controller.remove(item);
    } else {
      this.targetItem = null;
    }
    ret = this.obtainStepResult(item);
    if (item === this.iteratorTarget) {
      this.iteratorTarget.setIterator(this.iteratorFound);
      this.iteratorTarget = null;
      if (!this.targetItem) {
        this.setTargetItem(item.next);
      }
    }
    if (sd) {
      item.destroy();
    }
    if (this.shouldFinishRun(ret)) {
      return ret;
    }
    this.checkTargetItem();
  }
  return ret;
};

Iterator.prototype.checkTargetItem = function () {
  if (this.targetItem) {
    assert(this.targetItem.content !== null);
  }
};

Iterator.prototype.obtainStepResult = function (item) {
  return item.apply(this.item);
};
Iterator.prototype.shouldFinishRun = function (runstepresult) {
  return false;
};


module.exports = Iterator;
