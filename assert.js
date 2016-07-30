'use strict';
function assert(thingy) {
  //TODO check if thingy is boolean
  if (thingy!==true) {
    console.trace();
    throw Error("Assertion Error");
  }
}

module.exports = assert;
