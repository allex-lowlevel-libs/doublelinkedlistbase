function createDListController (inherit) {
  'use strict';

  var iterators = require('./iterators')(inherit),
    ItemWithDistance = require('./ItemWithDistance'),
    ForwardItemSequence = require('./ForwardItemSequence'),
    assert = require('./assert');

  function DListController(myList){
    this.list = myList;
    this.traversing = null;
    this.pushes = null;
    this.shouldDestroy = null;
  }

  DListController.prototype.destroy = function(){
    var sd = this.shouldDestroy;
    this.shouldDestroy = null;
    this.pushes = null;
    this.traversing = null;
    if (this.list) {
      if (sd) {
        this.list.controller = null;
        this.list.destroy();
        this.list = null;
      }
    }
  };

  DListController.prototype.purge = function(){
    var t;
    this.traversing = true;
    while (this.list.length) {
      t = this.list.tail;
      this.remove(this.list.tail);
      t.destroy();
    }
    this.list.head = this.list.tail = null;
    this.list.length = 0;
    this.traversing = false;
    this.finalize();
  };

  DListController.prototype.finalize = function () {
    if (this.traversing) {
      return;
    }
    if (this.pushes) {
      this.pushes.addToBackOf(this.list);
      this.pushes.destroy();
      this.pushes = null;
    }
    this.destroy();
  };

  DListController.prototype.contains = function (item) {
    var tempitem;
    if (!item) {
      return false;
    }
    tempitem = this.list.head;
    if (!tempitem) {
      return false;
    }
    do {
      if (tempitem == item) { //check if === neccessery?
        return true;
      }
      tempitem = tempitem.next;
    } while (tempitem);
    return false;
  };

  DListController.prototype.addToBack = function(newItem, ignoretraversal){
    if (!newItem) {
      return;
    }
    if (this.traversing && !ignoretraversal) {
      if (!this.pushes) {
        this.pushes = new ForwardItemSequence();
      }
      this.pushes.add(newItem);
      return;
    };
    //assert(!this.contains(newItem));
    if (!this.list.head) {
      ItemWithDistance.nextestItem(newItem);
      this.list.head = newItem;
      this.list.tail = ItemWithDistance.item();
      this.list.length = (ItemWithDistance.distance()+1);
    } else {
      this.list.tail.linkAsNext(newItem);
      this.list.tail = ItemWithDistance.item();
      this.list.length += (ItemWithDistance.distance()+1);
    }
    this.finalize();
  };

  DListController.prototype.addToFront = function(newItem){
    if (newItem.prev) {
      console.trace();
      console.log(newItem);
      throw new Error('Cannot addToFront an item with a prev');
    }
    //TODO why?
    if (newItem.next) {
      console.trace();
      console.log(newItem);
      throw new Error('Cannot addToFront an item with a next');
    }
    if (!this.list.head) {
      this.list.head = this.list.tail = newItem;
      this.list.length = 1;
    } else {
      newItem.next = this.list.head;
      this.list.head.prev = newItem;
      this.list.head = newItem;
      this.list.length++;
    }
    this.finalize();
  };

  DListController.prototype.addAsPrevTo = function (item, prevtarget) {
    var tt;
    if (!item) {
      return;
    }
    if (!prevtarget) {
      return this.addToBack(item, true);
    }
    //assert(this.contains(prevtarget));
    prevtarget.linkAsPrev(item);
    if (prevtarget === this.list.head) {
      this.list.head = ItemWithDistance.item();
    }
    this.list.length += (ItemWithDistance.distance()+1);
    this.finalize();
  };

  DListController.prototype.remove = function(item){
    var next;
    if(item === null){
      throw new Error("Cannot remove null item");
    }
    //assert(this.check());
    if (item === this.list.tail) {
      assert(item.next==null);
      this.list.tail = item.prev;
      if (!this.list.tail) {
        this.list.head = null;
      }
    } else if (item === this.list.head) {
      assert(item.prev==null);
      this.list.head = item.next;
      if (!this.list.head) {
        this.list.tail = null;
      }
    } else {
      if (!(item.prev && item.next)) {
        if (this.list.length==0) {
          return null;
        }
        if (!this.contains(item)) {
          return null;
        }
        console.error('?!', item);
        assert(false);
      }
      ItemWithDistance.nextestItem(item);
      assert (ItemWithDistance.item() === this.list.tail); //list contains item
    }
    this.list.length--;
    next = item.unlinkAndReturnNext();
    assert (next !== item);
    if (next) {
      assert (next.content !== null);
    }
    //assert(this.check());
    //this.finalize();
    return next;
  };

  DListController.prototype.firstItemToSatisfy = function(func){
    var check=false, item = this.list.head;
    while(!check&&item){
      check = item.apply(func);
      if('boolean' !== typeof check){
        throw 'func needs to return a boolean value';
      }
      if(check){
        return item;
      }else{
        item = item.next;
      }
    }
    return item;
  };

  DListController.prototype.lastItemToSatisfy = function(func){
    var check, item = this.list.head, ret;
    while(item){
      check = item.apply(func);
      if('boolean' !== typeof check){
        throw 'func needs to return a boolean value';
      }
      if(!check){
        return ret;
      }else{
        ret = item;
        item = item.next;
      }
    }
    return ret;
  };

  DListController.prototype.drain = function (item) {
    var tempitem = this.list.head,
      nextitem;
    this.traversing = true;
    while (tempitem) {
      if (!this.list) {
        console.trace();
        console.log(this);
        process.exit(0);
      }
      nextitem = tempitem.next;
      this.remove(tempitem);
      tempitem.apply(item);
      tempitem.destroy();
      tempitem = nextitem;
    }
    this.traversing = false;
    this.finalize();
  };

  DListController.prototype.drainConditionally = function (item, destroyeditemcb) {
    var tempitem = this.list.head,
      calldicb = 'function' === typeof destroyeditemcb,
      nextitem,
      crit;
    this.traversing = true;
    while (tempitem) {
      nextitem = this.remove(tempitem);
      //assert(this.check());
      try {
        crit = tempitem.apply(item);
      } catch (e) {
        console.log('Error in DList.drainConditionally', e);
        crit = void 0;
      }
      if ('undefined' === typeof crit) {
        tempitem.destroy();
        if (calldicb) {
          destroyeditemcb(tempitem);
        }
      } else {
        this.addAsPrevTo(tempitem, nextitem);
        //assert(this.check());
      }
      tempitem = nextitem;
    }
    this.traversing = false;
    this.finalize();
  };

  DListController.prototype.traverse = function(item){
    var it;
    this.traversing = true;
    it = new iterators.Iterator(this, item);
    it.run();
    it.destroy();
    this.traversing = false;
    this.finalize();
  };

  DListController.prototype.traverseConditionally = function(func){
    var ret, it;
    this.traversing = true;
    it = new iterators.ConditionalIterator(this, func);
    ret = it.run();
    it.destroy();
    this.traversing = false;
    this.finalize();
    return ret;
  };

  DListController.prototype.traverseSafe = function(item, errorcaption){
    var it;
    this.traversing = true;
    it = new iterators.SafeIterator(this, item, errorcaption);
    it.run();
    it.destroy();
    this.traversing = false;
    this.finalize();
  };

  /*
  DListController.prototype.traverseReverse = function(func){
    var it = new Iterator(func, true); //reverse
    it.setTargetItem(this.list.tail);
    while(it.cb) {
      it.run();
      if(it.finished()) {
        break;
      }
      if (it.needsNext()) {
        it.setTargetItem(it.targetitem.prev);
      }
    }
    it = null;
  }

  DListController.prototype.traverseConditionallyReverse = function(func){
    var it = new Iterator(func, true), result;
    it.setTargetItem(this.tail);
    while(it.cb) {
      result = it.run();
      if('undefined' !== typeof result){
        it.destroy();
        it = null;
        return result;
      }
      if(it.finished()) {
        break;
      }
      if (it.needsNext()) {
        it.setTargetItem(it.targetitem.prev);
      }
    }
    it = null;
  };
  */

  DListController.prototype.check = function () {
    return true;
    /*
    var cnt = 0, i;
    if (!this.list) {
      return true;
    }
    i = this.list.head;
    while (i) {
      cnt++;
      i = i.next;
    }
    if (cnt !== this.list.length) {
      console.error('List is', cnt, 'long, but the length is reported as', this.list.length);
      i = this.list.head;
      while (i) {
        console.log(i.content);
        i = i.next;
      }
    }
    cnt = 0;
    i = this.list.tail;
    while (i) {
      cnt++;
      i = i.prev;
    }
    if (cnt !== this.list.length) {
      console.error('List is', cnt, 'long, but the length is reported as', this.list.length);
      i = this.list.tail;
      while (i) {
        console.log(i.content);
        i = i.prev;
      }
    }
    return cnt === this.list.length;
    */
  };

  return DListController;
}

module.exports = createDListController;
