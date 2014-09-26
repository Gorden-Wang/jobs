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
            that.dom.footer = $("footer");
            that.dom.button = $("#findMore");

        },
        cacheData: function () {
            var that = this;
            that.data = {};
            that.data.from = that.getRequestParam('from');
            that.data.page = 0;
        },
        bindEvent: function () {
            var that = this;

            that.dom.button.on('click', function () {
                that.data.page += 1;

                that.fetchData();

            });


        },
        init: function () {
            var that = this;
            that.addJuicerHelper();
            that.cacheDom();
            that.cacheData();
            that.bindEvent();
            that.fetchData();
        },
        bindUi: function (data) {
            var that = this;

            that.dom.tplwrapper.append(juicer(that.dom.tpl.html(), {data: data}));

            that.dom.footer.show();

        },
        fetchData: function () {
            var that = this;
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://localhost:18080/findOneById?callback=?&data=" + JSON.stringify(that.makeQueryObj('top10')),
                dataType: "jsonp",
                jsonp: "callback",
                success: function (data) {
                    that.bindUi(data);
                    console.log(data)

                },
                error: function () {
                    alert("服务器异常")
                }
            })
        },
        makeQueryObj: function () {
            var that = this;
            var query = {};
            var option = {};
            query = {
                id:that.getRequestParam('id')
            };
            return {type: "findOneById", query: query, option: option};
        },
        getRequestParam: function (param, uri) {
            var value;
            uri = uri || window.location.href;
            value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
            return value ? decodeURIComponent(value[1]) : value;
        },
        addJuicerHelper: function () {
            juicer.register('checkTime', function (time) {
                var res;
                if (time && !isNaN(Number(time))) {
                    //毫秒时间
                    var date = new Date(time);
                    res = date.getFullYear() + "-" + parseInt(parseInt(date.getMonth()) + 1) + "-" + date.getDate();
                } else {
                    res = time;
                }
                return res;
            });

            juicer.register('checkHc', function (hc) {

                var res = hc == 0 ? '若干' : hc;
                return res;

            });
        }

    }
    var index = new index();
    index.init();
})($);