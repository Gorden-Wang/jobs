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
    var staticpath = path.match(/^\/www\/(.*)\?{0,1}.*/);

    staticpath && (staticpath = staticpath[1]);

    if (staticpath) {
        //静态资源请求
        util.findStatic(staticpath,function(data){


            res.writeHead(200, {"Content-Type": "text/"+getBack(staticpath)});
            console.log(data);
            res.end(data);
        });
    } else {
        //接口调用
        if (JSON.stringify(param) != "{}") {
            util.router(param, function (resdata) {
                res.writeHead(200, {"Content-Type": "text/html"})
                res.end(util.makeJSONP(JSONP, resdata))
            });
        }
    }


    function getBack(path){
        var temp = path.split(".").pop();

        var res = "";
        switch (temp){
            case 'css' :
                res = 'text/css';
                break;
            case 'js' :
                res = 'application/x-javascript';
                break;
            case 'png' :
                res = 'image/png';
                break;
            case 'jpeg':
                res = 'image/jpeg';
                break;
            case 'html':
                res = 'text/html';
                break;

        }

        return res;
    }

});

server.listen(18080, function () {
    console.log("listenning");
});

//var sysInstance = new sys();
//
//sysInstance.init();

console.log("server start")
