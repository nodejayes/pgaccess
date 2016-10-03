var Promise = require("promise");

module.exports = function () {
  function _promisehelp (cb, param) {
    return new Promise(function (resolve, reject) {
      try {
        param.resolve = resolve;
        param.reject = reject;
        resolve(cb(param));
      } catch (err) {
        reject(err);
      }
    });
  }

  return {
    "all": Promise.all,
    "new": _promisehelp
  };
};
