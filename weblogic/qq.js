/**
 * Created by gorden on 14-8-22.
 */


var http = require("http");
var $ = require("node-jquery");
var util = require("../lib/util");
var request = require("request");
util = new util();
//var d = new db();

function qq(page) {

    this.page = page;
    this.listData = [];


}

qq.prototype = {
    createClient: function (page, callback) {
        var that = this;
        that.data = [];
        request("http://hr.tencent.com/position.php?lid=&tid=&start=" + page * 10 || that.page * 10, function (error, res, body) {
            //that.findDetial(body, util.getRequestParam('postIdEnc', url));
            that.findDom1(body, callback);


        });
    },

    findDom1: function (data, callback) {
        var that = this;

        var tr = $(data).find(".tablelist").find('tr');


        var listArr = [];
        tr.each(function (i, v) {
            var tempObj = {};
            if (i == 0 || i == tr.length) {
                return
            } else {

                $(v).find("td").each(function (j, k) {
                    if (j == 0) {
                        tempObj.name = $(k).find("a").html();
                        tempObj.id = util.getRequestParam('id', $(k).find("a").attr("href"));
                        tempObj.url = $(k).find("a").attr("href");
                        return;
                    }

                    if (j == 1) {
                        tempObj.firstCategory = $(k).html();
                        return;
                    }

                    if (j == 2) {
                        tempObj.recruitNumber = $(k).html();
                        return;
                    }

                    if (j == 3) {
                        tempObj.workLocation = $(k).html();
                        return;
                    }

                    if (j == 4) {
                        tempObj.gmtModified = new Date(util.trim($(k).html())).getTime();

                        tempObj.from = 'qq';

                        return;
                    }
                });

                listArr.push(tempObj)


            }
        });

        callback(listArr);

    },

    getDetail: function (data, callback) {
        var that = this;

        request("http://hr.tencent.com/" + data.url, function (error, res, body) {
            temp.apply(this, []);
            that.findDetailDom1(body, this.data, callback);
        });

        var temp = function () {
            this.data = data;
        }
    },
    findDetailDom1: function (data, ordata, callback) {
        var that = this;
        var table = $(data).find(".tablelist ul");
        var temp = {id: ordata.id};
        $(table).each(function (i, v) {
            var tempStr = "";
            $(v).find('li').each(function (j, k) {
                tempStr += $(k).html() + "\n";
            });
            if (i == 0) {
                temp.description = tempStr;
            }
            if (i == 1) {
                temp.requirement = tempStr;
            }
        });

        callback(temp);
    },
    findDetail1: function (url, detailCallback) {
        var that = this;
        request("http://hr.tencent.com/" + url, function (error, res, body) {

        });
    }

}
console.log(qq);

module.exports = qq;

//var b = new qq();






