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
            that.dom.search = $(".searchwrapper button");
            that.dom.keyWordsInput = $(".searchwrapper input");

        },
        cacheData: function () {
            var that = this;
            that.data = {};
            that.data.from = that.getRequestParam('from');
            that.data.page = 0;

            that.data.option = {
                limit: 10,
                skip: that.data.page || 0,
                sort: [
                    ['gmtModified', 'desc']
                ]
            };

            that.data.query = {};
        },
        bindEvent: function () {
            var that = this;

            that.dom.button.on('click', function () {
                that.data.page += 1;
                that.fetchData();

            });

            that.dom.search.on('click', function () {
                var keyWords = that.dom.keyWordsInput.val();


                var arr = keyWords.split(" ");
                var res = "";
                for (var i = 0; i < arr.length; i++) {
                    res = res + "(" + arr[i] + ")" + "|";
                }


                var reg = new RegExp(res.replace(/\|$/, ''), "ig");
                reg = /ali html5/ig;
                that.data.query.$or = [
                    {workLocation: '/ali html5/'},
                    {requirement: '/ali html5/'},
                    {description: '/ali html5/'},
                    {name: reg}
                ];

                console.log(that.data.query)
                that.fetchData('search');
            });
        },
        initTop10: function () {
            var that = this;
            that.bindEvent();
            that.fetchData();
        },
        initSearch: function () {
            var that = this;
            that.bindEvent();
        },
        init: function () {
            var that = this;
            that.addJuicerHelper();
            that.cacheDom();
            that.cacheData();
//            that.bindEvent();
//            that.fetchData();

            that.data.from == 'top10' ? that.initTop10() : that.initSearch();
        },
        bindUi: function (data) {
            var that = this;

            that.dom.tplwrapper.append(juicer(that.dom.tpl.html(), {data: data}));

            that.dom.footer.show();

        },
        fetchData: function (tag) {
            var that = this;
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://batjobs.duapp.com/searchByKeyWord?callback=?&data=" + JSON.stringify(that.makeQueryObj(tag || 'top10')),
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
        makeQueryObj: function (tag) {
            var that = this;
            var query = that.data.query || {};
            var option = that.data.option || {};
            if (tag == 'top10') {

            } else if (tag == 'search') {
                query = that.data.query;

            }
            return {type: "searchByKeyWord", query: query, option: option};
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