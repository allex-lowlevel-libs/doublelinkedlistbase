'use strict';

var _item;
var _distance;

function PrevestItem (item) {
  var retitem = item,
    retdistance = 0,
    pitem;
  while(retitem) {
    pitem = retitem.prev;
    if (!pitem) {
      set(retitem, retdistance);
      return;
    }
    retitem = pitem;
    retdistance++;
  }
  set(retitem, retdistance);
};

function NextestItem (item) {
  var retitem = item,
    retdistance = 0,
    nitem;
  while(retitem) {
    nitem = retitem.next;
    if (!nitem) {
      set(retitem, retdistance);
      return;
    }
    retitem = nitem;
    retdistance++;
  }
  set(retitem, retdistance);
};

function set (item, distance) {
  _item = item;
  _distance = distance;
}

function getItem () {
  return _item;
}

function getDistance () {
  return _distance;
}

module.exports = {
  nextestItem: NextestItem,
  prevestItem: PrevestItem,
  set: set,
  item: getItem,
  distance: getDistance
};
