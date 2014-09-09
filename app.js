var http = require("http");
var url = require("url");
var qs = require("querystring");
var util = require("./lib/util");

util = new util();
var server = http.createServer(function (req, res) {
    var path = util.getPath(req);
    var param = util.getParam(req);
    var JSONP = util.getJSONPName(req);
    if (JSON.stringify(param) != "{}") {
        util.router(param, function (resdata) {

            console.log(resdata)
            res.writeHead(200, {"Content-Type": "text/html"})
            res.end(util.makeJSONP(JSONP, resdata))
        });
    }

});

server.listen(18080, function () {
    console.log("listenning");
});

console.log("server start")
