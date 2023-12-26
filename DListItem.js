'use strict';

var ItemWithDistance = require('./ItemWithDistance'),
  assert = require('./assert');

function DListItem(content){
  if ('undefined' === typeof content) {
    console.trace();
    throw new Error('Undefined content on DListItem');
  }
  this.next = null;
  this.prev = null;
  this.content = content;
  this.iterator = null;
}

DListItem.prototype.destroy = function(){
  this.unlinkAndReturnNext();
  this.iterator = null;
  this.content = null;
};

DListItem.prototype.linkAsPrev = function (item) {
  if (!item) {
    ItemWithDistance.set(this, 0);
    return;
  }
  if ('object' !== typeof item || !(item instanceof DListItem)){
    throw new Error('Item is not instance of DListItem');
  }
  ItemWithDistance.prevestItem(item);
  if (this.prev) {
    assert(this.prev.next === this);
    this.prev.next = ItemWithDistance.item();
  }
  ItemWithDistance.item().prev = this.prev;
  assert(item.next===null);
  item.next = this;
  this.prev = item;
};

DListItem.prototype.linkAsNext = function (item) {
  var iwd;
  if (!item) {
    ItemWithDistance.set(this, 0);
    return;
  }
  ItemWithDistance.nextestItem(item);
  if (this.next) {
    assert(this.next.prev === this);
    this.next.prev = ItemWithDistance.item();
  }
  ItemWithDistance.item().next = this.next;
  assert(item.prev===null);
  item.prev = this;
  this.next = item;
};

DListItem.prototype.unlinkAndReturnNext = function () {
  var ret = this.next;
  if (this.iterator) {
    if (this.iterator.reverse) {
      this.iterator.setTargetItem(this.prev);
    } else {
      this.iterator.setTargetItem(this.next);
    }
  }
  if (this.prev) {
    this.prev.next = this.next;
  }
  if (this.next) {
    assert(this.next.content !== null);
    this.next.prev = this.prev;
  }
  this.next = null;
  this.prev = null;
  return ret;
};

DListItem.prototype.setIterator = function (iterator) {
  //assert(iterator != null);
  assert('undefined' != typeof iterator);
  var ret = this.iterator;
  this.iterator = iterator;
  return ret;
};

module.exports = DListItem;
