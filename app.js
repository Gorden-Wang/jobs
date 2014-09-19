var http = require("http");
var url = require("url");
var qs = require("querystring");
var util = require("./lib/util");
var db = require("./lib/db");
var sys = require('./lib/sys.js');

util = new util();

var server = http.createServer(function (req, res) {
    var path = util.getPath(req);
    var param = util.getParam(req);
    var JSONP = util.getJSONPName(req);
    if (JSON.stringify(param) != "{}") {
        console.log(param);

        util.router(param, function (resdata) {

            console.log(resdata);
            res.writeHead(200, {"Content-Type": "text/html"});

            db = new db(req,res);

            db.insert(resdata);

            res.end(util.makeJSONP(JSONP, resdata))
        });


       // db = new db(req,res);


    }

});

server.listen(18080, function () {
    console.log("listenning");
});

var sysInstance = new sys();

sysInstance.init();

console.log("server start")
