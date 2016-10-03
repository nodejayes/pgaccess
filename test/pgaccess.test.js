module.exports = {
  "setUp": function (cb) {
    this.pg = require("./../pgaccess")("localhost", "5432", "test", "dboperator", "test");
    this.query1 = "select * from public.test where id = :Id";
    this.query2 = "select * from public.test where message ~* :Message";
    this.params1 = [
      {"key": "Id", "value": 1}
    ];
    this.params2 = [
      {"key": "Message", "value": "a"}
    ];
    this.query1good = [
      {"id": 1, "message": "asdadsdas", "created": "2016-09-28", "active": true, "count": 2, "countp": 1.5}
    ];
    this.query2good = [
      {"id": 1, "message": "asdadsdas", "created": "2016-09-28", "active": true, "count": 2, "countp": 1.5},
      {"id": 2, "message": "sadasdsadsadsad", "created": "2016-09-29", "active": false, "count": 50, "countp": 2.5},
      {"id": 8, "message": "abcdefghijklmnopqrstuvw", "created": "2016-10-02", "active": true, "count": 80, "countp": 5.5}
    ];
    cb();
  },
  "tearDown": function (cb) {
    cb();
  },
  "checkRunCommand": function (test) {
    try {
      this.pg.runCommand(this.query1, this.params1).then(function (data) {
        test.ok(true, "execution ok");
      }, function (err) {
        test.ok(false, err);
      });
    } catch (err) {
      test.ok(false, err);
    } finally {
      test.done();
    }
  },
  "checkGetResult": function (test) {
    try {
      this.pg.getResult(this.query1, this.params1).then(function (data) {
        test.ok(true, "we have a result");
        for (var i = 0; i < query1good.length; i++) {
          test.deepEqual(data[i], query1good[i], "result " + i + " is wrong");
        }
      }, function (err) {
        test.ok(false, err);
      });
    } catch (err) {
      test.ok(false, err);
    } finally {
      test.done();
    }
  },
  "checkMultiCommand": function (test) {
    try {
      this.pg.multiCommand([
        {"sql": this.query1, "params": this.params1},
        {"sql": this.query2, "params": this.params2}
      ]);
    } catch (err) {
      test.ok(false, err);
    } finally {
      test.done();
    }
  },
  "checkMultiResult": function (test) {
    try {
      this.pg.multiResult([
        {"sql": this.query1, "params": this.params1},
        {"sql": this.query2, "params": this.params2}
      ]).then(function (data) {
        test.ok(data.length === 2, "not enough datasets");
        for (var i = 0; i < this.query1good.length; i++) {
          test.deepEqual(data[0][i], this.query1good[i], "result 0 - " + i + " is wrong");
        }
        for (var j = 0; j < this.query2good.length; j++) {
          test.deepEqual(data[1][j], this.query2good[j], "result 1 - " + j + " is wrong");
        }
      }, function (err) {
        test.ok(false, err);
      });
    } catch (err) {
      test.ok(false, err);
    } finally {
      test.done();
    }
  }
};
