var pg = require("./../pgaccess")("localhost", "5432", "test", "dboperator", "test");

pg.multiResult([
  {"sql": "select * from public.test where id = :Id", "params": [
    {"key": "Id", "value": 1}
  ]}
]).then(function (data) {

}, function (err) {

});
