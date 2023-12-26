var ItemWithDistance = require('./ItemWithDistance');

function ForwardItemSequence () {
  this.anchor = null;
  this.farthest = null;
  this.distance = null;
}
ForwardItemSequence.prototype.destroy = function () {
  this.distance = null;
  this.farthest = null;
  this.anchor = null;
}
ForwardItemSequence.prototype.add = function (item) {
  if (!this.anchor) {
    this.anchor = item;
    this.farthest = item;
    this.distance = 0;
    return;
  }
  this.farthest.next = item;
  item.prev = this.farthest;
  ItemWithDistance.nextestItem(item);
  this.farthest = ItemWithDistance.item();
  this.distance += (ItemWithDistance.distance()+1);
};
ForwardItemSequence.prototype.addToBackOf = function (list) {
  if (list.tail) {
    list.tail.next = this.anchor;
    this.anchor.prev = list.tail;
    list.tail = this.farthest;
  } else {
    list.head = this.anchor;
    list.tail = this.farthest;
  }
  list.length += (this.distance+1);
};
module.exports = ForwardItemSequence;