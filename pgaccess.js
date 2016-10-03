var pgacc   = require("./build/Release/pgaccess");
var sqlinj  = require("./module/sqlinjectiondetector")();
var promise = require("./module/promisehelper.js")();

module.exports = function (host, port, dbname, user, passwd, applname) {
  pgacc.setConnectionString(
    (host === "localhost" ? "127.0.0.1" : host),
    port.toString(),
    dbname, user, passwd, applname);

  function _run(sql, params) {
    pgacc.runCommand(sqlinj.setParameter(sql, params));
  }

  function _Result(sql, params) {
    var data = pgacc.getResult(sqlinj.setParameter(sql, params));
    if (typeof data === typeof undefined || data === "") {
      data = "[]";
    }
    return JSON.parse(data);
  }

  function _asyncResult (param) {
    return _Result(param.sql, param.params);
  }

  function _asyncRun(param) {
    return _run(param.sql, param.params);
  }

  function _logError(err) {
    console.error(err);
  }

  return {
    "getResult": function (sql, params) {
      return promise.new(_asyncResult, {
        "sql": sql,
        "params": params
      });
    },
    "multiResult": function (commands) {
      var querys = [];
      for (var i = 0; i < commands.length; i++) {
        querys.push(promise.new(_asyncResult, {
          "sql": commands[i].sql,
          "params": commands[i].params
        }));
      }
      return Promise.all(querys);
    },
    "runCommand": function (sql, params) {
      return promise.new(_asyncRun, {
        "sql": sql,
        "params": params
      }).then(function () {}, _logError);
    },
    "multiCommand": function (commands) {
      for (var i = 0; i < commands.length; i++) {
        promise.new(_asyncRun, {
          "sql": commands[i].sql,
          "params": commands[i].params
        }).then(function () {}, _logError);
      }
    }
  };
};
