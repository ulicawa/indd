if (!Array.prototype.indexOf) Array.prototype.indexOf = (function (Object, max, min) {
  "use strict";
  return function indexOf(member, fromIndex) {
    if (this === null || this === undefined) throw TypeError("Array.prototype.indexOf called on null or undefined");
    //省略
    return -1; // if the value was not found, then return -1
  };
})(Object, Math.max, Math.min);
