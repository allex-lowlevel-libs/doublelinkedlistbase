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
    return new ItemWithDistance(this, 0);
  }
  if ('object' !== typeof item || !(item instanceof DListItem)){
    throw new Error('Item is not instance of DListItem');
  }
  var iwd = ItemWithDistance.PrevestItem(item);
  if (this.prev) {
    assert(this.prev.next === this);
    this.prev.next = iwd.item;
  }
  iwd.item.prev = this.prev;
  assert(item.next===null);
  item.next = this;
  this.prev = item;
  return iwd;
};

DListItem.prototype.linkAsNext = function (item) {
  if (!item) {
    return new ItemWithDistance(this, 0);
  }
  if ('object' !== typeof item || !(item instanceof DListItem)){
    throw new Error('Item is not instance of DListItem');
  }
  var iwd = ItemWithDistance.NextestItem(item);
  if (this.next) {
    assert(this.next.prev === this);
    this.next.prev = iwd.item;
  }
  iwd.item.next = this.next;
  assert(item.prev===null);
  item.prev = this;
  this.next = item;
  return iwd;
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
  //TODO check instanceof Iterator, dont know about undefined/null?
  var ret = this.iterator;
  this.iterator = iterator;
  return ret;
};

DListItem.prototype.linkAsNext = function (item) {
  var iwd;
  if (!item) {
    return new ItemWithDistance(this, 0);
  }
  if ('object' !== typeof item || !(item instanceof DListItem)){
    throw new Error('Item is not instance of DListItem');
  }
  iwd = ItemWithDistance.NextestItem(item);
  if (this.next) {
    this.next.prev = iwd.item;
  }
  iwd.item.next = this.next;
  item.prev = this;
  this.next = item;
  return iwd;
};

module.exports = DListItem;
