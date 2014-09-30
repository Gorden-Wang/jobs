/**
 * Created by gorden on 14-8-22.
 */


var http = require("http");
var $ = require("node-jquery");
var alidb = require('../lib/alidb.js');
var db = new alidb();
var request = require("request");


function ali(page,size,query) {
    var that = this;
    this.clientParam = {};
    this.clientParam.host = "job.alibaba.com";
    this.clientParam.path = '/zhaopin/socialPositionList/doList.json';
    this.clientParam.method = "POST";

    this.queryParam = {};
    this.queryParam.workPlaceCode = "";
    this.queryParam.keyWord = "html5";


    this.query = {
        pageSize: size || 10,
        keyWord: (query && query.keyword) || '',
        location: (query && query.location) || '',
        pageIndex: (query && query.page) || page || 0
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
    createClient: function (page,callback) {
        var that = this;
        request('http://job.alibaba.com/zhaopin/socialPositionList/doList.json?pageSize=4000&pageIndex='+page, function (error, res, body) {
            callback(JSON.parse(body));
        });
       // http://job.alibaba.com/zhaopin/socialPositionList/doList.json?pageSize=4000&pageIndex=1
    },

    insertDB:function(res){
        var that = this;

        console.log(res.returnValue.datas.length)

        db.insert(res.returnValue.datas);
    },

    getList: function (data) {
        console.log(data)
    }
}


module.exports = ali;

//var a = new ali({}, {keyword: "java" || "", location: "北京" || "", page: 1 || 1});

//a.createClient();


