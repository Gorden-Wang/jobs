/**
 * Created by gorden on 14-8-15.
 */

(function ($) {
    function index() {
    }

    index.prototype = {
        cacheDom: function () {
            var that = this;

            that.dom = {};
            that.dom.tplwrapper = $("#content");
            that.dom.tpl = $("#tpl");

        },
        cacheData: function () {
            var that = this;
            that.data = {};
            that.data.from = that.getRequestParam('from');
        },
        bindEvent: function () {
            var that = this;

        },
        init: function () {
            var that = this;
            that.addJuicerHelper();
            that.cacheDom();
            that.cacheData();
            that.fetchData();
        },
        bindUi: function (data) {
            var that = this;

            that.dom.tplwrapper.append(juicer(that.dom.tpl.html(),{data:data}));


        },
        fetchData: function () {
            var that = this;
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://batjobs.duapp.com/searchByKeyWord?callback=?&data=" + JSON.stringify(that.makeQueryObj('top10')),
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    that.bindUi(data);
                    console.log(data)

                },
                error:function(){
                    alert("服务器异常")
                }
            })
        },
        makeQueryObj: function (tag) {
            var that = this;
            var query = {};
            var option = {};
            if (tag == 'top10') {
                query = {

                };
                option = {
                    limit: 10,
                    skip: 0,
                    sort: [
                        ['gmtModified', 'desc']
                    ]
                }
            }
            return {type:"searchByKeyWord",query: query, option: option};
        },
        getRequestParam: function (param, uri) {
            var value;
            uri = uri || window.location.href;
            value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
            return value ? decodeURIComponent(value[1]) : value;
        },
        addJuicerHelper:function(){
            juicer.register('checkTime', function(time){
                var res;
                if(time && !isNaN(Number(time))){
                    //毫秒时间
                    var date = new Date(time);
                    res = date.getFullYear()+"-"+parseInt(parseInt(date.getMonth())+1)+"-"+date.getDate();
                }else{
                    res = time;
                }
                return res;
            });

            juicer.register('checkHc', function(hc){

                var res = hc == 0 ? '若干' : hc ;
                return res;

            });
        }

    }
    var index = new index();
    index.init();
})($);