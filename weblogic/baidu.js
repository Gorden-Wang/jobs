/**
 * Created by gorden on 14-8-22.
 */


var http = require("http");
var $ = require("node-jquery");

 function baidu(option,query) {
    var that = this;
    this.clientParam = {};
    this.clientParam.host = "talent.baidu.com";
    this.clientParam.path = '/baidu/web/templet1000/index/corpwebPosition1000baidu!getPostListByConditionBaidu';
    this.clientParam.method = "GET";

    this.queryParam = {};
    this.queryParam.workPlaceCode = "";
    this.queryParam.keyWord = "html5";



    this.query ={
        positionType:"",
        brandCode:1,
        releaseTime:0,
        trademark:0,
        useForm:0,
        recruitType:2,
        lanType:0,
        "pc.currentPage":query.page || "",
        "pc.rowSize":10,
        workPlaceCode:query.location || "",
        keyWord:query.keyword || "",
        keyWordV:query.keyword || ""
    };

    this.clientParam.path += "?"+ (function(){
       var temp = "";
        for(var i in that.query){
            temp = temp + i+"="+that.query[i]+"&"
        }


        return temp.replace(/&$/,"");
    })();

     console.log(this.clientParam.path)




    this.option = {
        host:this.clientParam.host,
        path:this.clientParam.path,
        method:this.clientParam.method
    };


}

baidu.prototype = {
    createClient: function (callback) {
        var that = this;
        var req = http.request(this.option, function (res) {
            res.setEncoding("utf8");
            var html="";
            res.on("data",function(data){
                html+=data.replace(/\n/g,"");
            });
            res.on("end",function(data){
                callback (that.findDom(html));
            })

        });

        req.write(JSON.stringify(that.query));
        req.end();
    },

    findDom:function(data){
        var data = data.replace(/\n/g,"");
        var trs = $(data).find("body #hrs_joblistTable tbody tr");
        var resData = {},tempArr = [];
        console.log(trs.length)
        $.each(trs,function(i,v){

            var job = {},temp;
            $.each($(v).find("td"),function(j,k){
                temp = $(k).html();
                if(j==0){
                    //title:
                    job.title = $(k).find("a").html();
                    job.href = $(k).find("a").attr("href");

                    return;
                }
                if(j==1){
                    job.qulity = $(k).find("font").html();
                    return;
                }
                if(j==2){
                    job.location = $(k).find("span").html();
                    return;
                }
                if(j==3){
                    job.data = temp;
                    return;
                }

            });

            tempArr.push(job);

        });

        resData.joblist = tempArr;

        console.log(resData)

        return resData;

    }
}


module.exports = baidu;

//var b = new baidu();

//b.createClient();


