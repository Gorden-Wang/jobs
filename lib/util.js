var qs = require("querystring");
var db = require('./findDB.js');
var fs = require('fs');
var dbdriver = new db();
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
    getRequestParam: function (param, uri) {
        var value;
        uri = uri || window.location.href;
        value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
        return value ? decodeURIComponent(value[1]) : value;
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
            var query = JSON.parse(data.data.query);
            var option = data.data.option;
            var _data = query.type;


            if (_data == 'searchByKeyWord') {
                dbdriver.findByKeyWords(query, option, function (result) {
                    callback(result);
                });
            }

            if (_data == 'findOneById') {
                dbdriver.findOneByID(query, function (result) {
                    callback(result);
                });
            }


        } else {
            console.log("aaa")
        }
    },
    filterHTML: function (data) {
        return data.replace(/<(\S*?) [^>]*>.*?<\/\1>|<.*? \/>/, '').replace(" ", "").replace(/\n/, '');
    },
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "").replace(/\n/, '');
    },
    findStatic:function(pa,callback){
        var that = this;

        fs.readFile("./www/src/"+pa,{encoding: 'utf-8'},function(err,data){
            if(err){
                //TODO error
            }

            callback(data);
        })
    }


}

module.exports = util;