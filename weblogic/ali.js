/**
 * Created by gorden on 14-8-22.
 */


var http = require("http");
var $ = require("node-jquery");

function ali(option, query) {
    var that = this;
    this.clientParam = {};
    this.clientParam.host = "job.alibaba.com";
    this.clientParam.path = '/zhaopin/socialPositionList/doList.json';
    this.clientParam.method = "POST";

    this.queryParam = {};
    this.queryParam.workPlaceCode = "";
    this.queryParam.keyWord = "html5";


    this.query = {
        pageSize: 10,
        keyWord: query.keyword,
        location: query.location,
        pageIndex: query.page
    };


    this.option = {
        host: this.clientParam.host,
        path: this.clientParam.path,
        method: this.clientParam.method,
        headers: {

            'Content-Length': JSON.stringify(that.query).length
        }
    };


}

ali.prototype = {
    createClient: function (callback) {
        var that = this;
        var req = http.request(that.option, function (res) {
            console.log(that.option)

            res.setEncoding("utf8");
            var html = "";
            res.on("data", function (data) {
                html += data;
            });
            res.on("end", function (data) {
                that.data = data;

                callback(html);
            })

        });

        req.write(JSON.stringify(that.query));
        req.end();
    },

    getList: function (data) {
        console.log(data)

    }
}


module.exports = ali;

//var a = new ali({}, {keyword: "java" || "", location: "北京" || "", page: 1 || 1});

//a.createClient();


