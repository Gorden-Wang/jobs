var qs = require("querystring");


function util() {

}

util.prototype = {
    getPath: function (req) {
        var that = this,
            _arr = req.url.split("?");

        return _arr[0];
    },
    getParam: function (req) {
        var that = this,
            _arr = req.url.split("?");
        return qs.parse(_arr[1]);
    },
    getJSONPName: function (req) {
        var that = this;
        return that.getParam(req).callback
    },
    makeJSONP: function (name, data) {
        return name + "(" + JSON.stringify(data) + ")";
    },
    router: function (data, callback) {
        if (data !== {}) {
            var _data = JSON.parse(data.data).type;

            console.log(_data);

            if (_data == "bd") {
                var b = require("../weblogic/baidu");
                var c = new b({}, {keyword: data.data.keyword || "", location: data.data.location || "", page: data.data.page || 1});
                c.createClient(callback);
            }
            if (_data == "al") {
                var a = require("../weblogic/ali");
                var c = new a({}, {keyword: data.data.keyword || "", location: data.data.location || "", page: data.data.page || 1});
                c.createClient(callback);
            }
        } else {
            console.log("aaa")
        }
    }


}

module.exports = util;