/**
 * Created by gorden on 14-8-15.
 */

(function ($) {
    function index() {
    }

    index.prototype = {
        cacheDome: function () {
            var that = this;
            that.button = $("#test");
            that.button1 = $("#test1");
            that.button2 = $("#test2");

        },
        bindEvent: function () {
            var that = this;
            that.button.on("click", function () {
                that.fetchData();
            });
            that.button1.on("click", function () {
                that.fetchAliData();
            });
            that.button2.on("click", function () {
                //that.fetchData();
            })
        },
        init: function () {
            var that = this;
            that.cacheDome();
            that.bindEvent();
        },
        fetchData: function () {
            var that = this;
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://batjobs.duapp.com/search?callback=?&data=" + that.makePost("bd", "java", "beijing", "1"),
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    console.log(data);

                }
            })
        },
        fetchAliData: function () {
            var that = this;
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://batjobs.duapp.com/search?callback=?&data=" + that.makePost("al", "java", "beijing", "1"),
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    console.log(data);

                }
            })
        },
        makePost: function (type, keyword, location, page) {
            var param = {
                "type": type,
                "keyword": keyword,
                "location": location,
                "page": page
            }

            return JSON.stringify(param);
        }
    }


    function callback() {
        console.log("aaa")
    }

    var index = new index();
    index.init();
})($);