module.exports = function () {

  function _getFull(val, len) {
    var preaf = "";
    var innerValue = val.toString();
    var diff = len - innerValue.length;
    if (diff < 1) {
      return innerValue;
    }
    for (var i = diff; i > 0; i--) {
      preaf += "0";
    }
    return preaf + innerValue;
  }

  function _escapeString (val) {
    return val.replace("'", "''");
  }

  function _getSafeSqlString (val) {
    var strParameter = escapeString(val.toString());
    if (typeof val === typeof true) {
      strParameter = val ? "TRUE" : "FALSE";
    } else if (typeof val === typeof "") {
      strParameter = "'" + strParameter + "'";
    } else if (typeof val === typeof new Date()) {
      strParameter = "'" + getFull(val.getFullYear(), 4) + "-" +
                     getFull(val.getMonth() + 1, 2) + "-" +
                     getFull(val.getDate(), 2) + " " +
                     getFull(val.getHours(), 2) + ":" +
                     getFull(val.getMinutes(), 2) + ":" +
                     getFull(val.getSeconds(), 2) + "'";
    } else if (val === null) {
      strParameter = "NULL";
    } else if (typeof val === typeof []) {
      var tmp = [];
      for (var i = 0; i < val.length; i++) {
        tmp.push(getSafeSqlString(val[i]));
      }
      strParameter = "ARRAY[" + tmp.join(",") + "]";
    }
    return strParameter;
  }

  function _setParameter(sql, params) {
    if (typeof params !== typeof []) {
      return sql;
    }
    var result = sql;
    for (var i = 0; i < params.length; i++) {
      if (typeof params[i] === typeof undefined ||
          params[i] === null ||
          typeof params[i].key === typeof undefined || params[i].value === typeof undefined) {
        continue;
      }
      var key = params[i].key;
      var value = getSafeSqlString(params[i].value);
      result = result.replace(":" + key, value);
    }
    return result;
  }

  return {
    "setParameter": _setParameter
  };
};
