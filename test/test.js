var expect = require('chai').expect,
  Checks = require('allex_checkslowlevellib'),
  Inherit = require('allex_inheritlowlevellib')(Checks.isFunction,Checks.isString).inherit,
  DList = require('..')(Inherit),
  List = DList.Mixin,
  Item = DList.Item;
