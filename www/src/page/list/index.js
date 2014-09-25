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
            that.dom.top10 = $(".top10wrapper");
            that.dom.hunt = $(".huntwrapper");
            that.dom.donate = $(".donatewrapper");

        },
        bindEvent: function () {
            var that = this;

        },
        init: function () {
            var that = this;
            that.cacheDom();
            that.bindUi();
        },
        bindUi:function(){
          var that = this;

          setTimeout(function(){
              that.dom.top10.removeClass('initStateLeft');
              setTimeout(function(){
                  that.dom.hunt.removeClass('initStateRight');
                  setTimeout(function(){
                      that.dom.donate.removeClass('initStateBottom');
                  },500)
              },500)
          },500);

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