#include <nan.h>
#include <node.h>
#include <iostream>
#include <pqxx/pqxx>

using namespace std;
using namespace pqxx;

namespace PostgresAccess {
  string _cs = "";

  result executeContext(string sql)
  {
      connection cnn(_cs);
      if (cnn.is_open()) {
          nontransaction query(cnn);
          result data(query.exec(sql));
          cnn.disconnect();
          return data;
      }
  }

  void setConnectionString(const Nan::FunctionCallbackInfo<v8::Value>& args) {
    try {
      if (args.Length() < 5) {
        // No Good Connection String
      }
      v8::String::Utf8Value host(args[0]->ToString());
      v8::String::Utf8Value port(args[1]->ToString());
      v8::String::Utf8Value dbname(args[2]->ToString());
      v8::String::Utf8Value user(args[3]->ToString());
      v8::String::Utf8Value passwd(args[4]->ToString());
      v8::String::Utf8Value appl(args[5]->ToString());

      _cs = "hostaddr=" + string(*host) + " port=" + string(*port) +
            " dbname=" + string(*dbname) + " user=" + string(*user) +
            " password=" + string(*passwd) +
            " application_name=" + (args.Length() > 5 ?
              string(*appl) :
              "NodeJs Addon PgAccess") + ";";
    args.GetReturnValue().Set(Nan::New(_cs.c_str()).ToLocalChecked());
    } catch (const exception) {
    }
  }

  void runCommand(const Nan::FunctionCallbackInfo<v8::Value>& args) {
    try {
      v8::String::Utf8Value param1(args[0]->ToString());
      executeContext(string(*param1));
      args.GetReturnValue().Set(Nan::New("true").ToLocalChecked());
    } catch (const exception) {
      args.GetReturnValue().Set(Nan::New("false").ToLocalChecked());
    }
  }

  void getJsonResult(const Nan::FunctionCallbackInfo<v8::Value>& args) {
    string jsonstr = "";
    try {
      v8::String::Utf8Value param1(args[0]->ToString());
      result data = executeContext("select cast('[' || string_agg(row_to_json((jsondata))::text, ',') || ']' as json) from (" + string(*param1) + ") jsondata");
      for (result::const_iterator c = data.begin(); c != data.end(); c++) {
        jsonstr = c[0].as<string>();
      }
    } catch (const exception) {
    }
    args.GetReturnValue().Set(Nan::New(jsonstr.c_str()).ToLocalChecked());
  }

  void init(v8::Local<v8::Object> exports) {
    exports->Set(Nan::New("setConnectionString").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(setConnectionString)->GetFunction());
    exports->Set(Nan::New("getResult").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(getJsonResult)->GetFunction());
    exports->Set(Nan::New("runCommand").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(runCommand)->GetFunction());
  }

  NODE_MODULE(pgaccess, init);
}
