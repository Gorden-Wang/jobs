/**
 * Created by gorden on 14-8-22.
 */


var http = require("http");
var $ = require("node-jquery");
var db = require("../lib/db");
var util = require("../lib/util");
var request = require("request");
util = new util();
var d = new db();

function baidu(page, rowSize, location, keyword, query) {
    var that = this;
    this.clientParam = {};
    this.clientParam.host = "talent.baidu.com";
    this.clientParam.path = '/baidu/web/templet1000/index/corpwebPosition1000baidu!getPostListByConditionBaidu';
    this.clientParam.method = "GET";

    this.queryParam = {};
    this.queryParam.workPlaceCode = "";
    this.queryParam.keyWord = "";


    this.query = {
        brandCode: 1,
        positionType: "",
        releaseTime: 0,
        trademark: 0,
        useForm: 0,
        recruitType: 2,
        lanType: 0,
        "pc.currentPage": (query && query.page) || page || "",
        "pc.rowSize": rowSize || 10,
        workPlaceCode: (query && query.location) || location || "",
        keyWord: (query && query.keyword ) || keyword || "",
        keyWordV: (query && query.keyword) || keyword || ""
    };

    this.clientParam.path += "?" + (function () {
        var temp = "";
        for (var i in that.query) {
            temp = temp + i + "=" + that.query[i] + "&"
        }


        return temp.replace(/&$/, "");
    })();


    this.option = {
        host: this.clientParam.host,
        path: this.clientParam.path,
        method: this.clientParam.method
    };


}

baidu.prototype = {
    createClient: function (callback) {
        var that = this;
        var req = http.request(this.option, function (res) {
            res.setEncoding("utf8");
            var html = "";
            res.on("data", function (data) {
                html += data.replace(/\n/g, "");
            });
            res.on("end", function (data) {
                var result = that.findDom(html);
                that.insertList(result);

                console.log("==========================")

                console.log(that.query['pc.currentPage']);

                console.log("==========================")
                callback(result);
            })

        });

        req.write(JSON.stringify(that.query));


        req.end();
    },

    findDom: function (data) {
        var data = data.replace(/\n/g, "");
        var trs = $(data).find("body #hrs_joblistTable tbody tr");
        var resData = {}, tempArr = [];
        $.each(trs, function (i, v) {

            var job = {}, temp;
            $.each($(v).find("td"), function (j, k) {
                temp = $(k).html();
                if (j == 0) {
                    //title:
                    job.title = util.trim($(k).find("a").html());
                    job.href = $(k).find("a").attr("href");
                    job.id = util.getRequestParam('postIdEnc', job.href);


                    return;
                }
                if (j == 1) {
                    job.qulity = util.trim($(k).find("font").html());
                    return;
                }
                if (j == 2) {
                    job.location = util.trim($(k).find("span").html());
                    return;
                }
                if (j == 3) {
                    job.gmtModified = new Date(util.trim(temp)).getTime();
                    return;
                }

            });

            tempArr.push(job);

        });

        resData.joblist = tempArr;

        //console.log(resData);


        return resData;

    },

    insertList: function (data) {
        d.insert(data.joblist, this.hackBaiduDetail(data));

        //this.hackBaiduDetail(data);
    },

    hackBaiduDetail: function (data) {
        var that = this;
        var arr = data.joblist;
        if (arr) {
            for (var i = 0; i < arr.length; i++) {

                that.createDetailR(arr[i].href);
            }


        }
    },
    createDetailR: function (url) {
        var that = this;

        request("http://" + that.clientParam.host + url, function (error, res, body) {
            that.findDetial(body.replace(/<br>/ig, '</br>'), util.getRequestParam('postIdEnc', url));
        });


    },

    findDetial: function (html, id) {
        var that = this;


        var job = {};
        var jobinfo = {};
        var html = $(html);
        var job = $(html).find("body .hrs_jobInfo dd");
        $(job).each(function (i, v) {

            if (i == 0) {
                jobinfo.departmentName = util.trim($(v).html().trim());
            }
            if (i == 1) {
                jobinfo.workLocation = util.trim($(v).find("font").html().trim());
            }
            if (i == 2) {
                jobinfo.recruitNumber = util.trim($(v).html().trim());
            }
            if (i == 3) {
                jobinfo.firstCategory = util.trim($(v).find("font").html().trim());
            }
        });

        jobinfo.description = $(html).find(".hrs_jobDuty div").html().trim().replace(/\r\n/,'<br/>').replace(/\n/,'<br/>').replace(/\r/,'<br/>');

        jobinfo.requirement = $(html).find(".hrs_jobRequire div").html().trim().replace(/\r[\n]/,'<br/>').replace(/\n/,'<br/>');

        jobinfo.from = 'baidu';

        jobinfo && d._update(id, jobinfo);
    }
}


module.exports = baidu;


