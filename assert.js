'use strict';
function assert(thingy) {
  if (thingy!==true) {
    console.trace();
    throw Error("Assertion Error");
  }
}

module.exports = assert;
