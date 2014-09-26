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
            that.cacheDom();
            that.cacheData();
            that.fetchData();
        },
        bindUi: function () {
            var that = this;


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
                    console.log(data);

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
            return {query: query, option: option};
        },
        getRequestParam: function (param, uri) {
            var value;
            uri = uri || window.location.href;
            value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
            return value ? decodeURIComponent(value[1]) : value;
        },

    }
    var index = new index();
    index.init();
})($);