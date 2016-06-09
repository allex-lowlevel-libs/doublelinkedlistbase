'use strict';
function ItemWithDistance (item, distance) {
  this.item = item;
  this.distance = distance;
}
ItemWithDistance.prototype.destroy = function () {
  this.distance = null;
  this.item = null;
};

ItemWithDistance.PrevestItem = function (item) {
  var retitem = item,
    retdistance = 0,
    pitem;
  while(retitem) {
    pitem = retitem.prev;
    if (!pitem) {
      return new ItemWithDistance(retitem, retdistance);
    }
    retitem = pitem;
    retdistance++;
  }
  return new ItemWithDistance(retitem, retdistance);
};

ItemWithDistance.NextestItem = function (item) {
  var retitem = item,
    retdistance = 0,
    nitem;
  while(retitem) {
    nitem = retitem.next;
    if (!nitem) {
      return new ItemWithDistance(retitem, retdistance);
    }
    retitem = nitem;
    retdistance++;
  }
  return new ItemWithDistance(retitem, retdistance);
};

module.exports = ItemWithDistance;
