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
            that.dom.searchWrapper = $(".searchwrapper");
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
                that.data.option.skip += 1;
                if( that.data.from == "top10"){
                    that.fetchData();
                }else if(that.data.from == "search"){
                    that.fetchData('search');
                }



            });

            that.dom.search.on('click', function () {
                var keyWords = that.dom.keyWordsInput.val();
                that.data.query.keyWord = keyWords;
                that.dom.tplwrapper.html("");
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
            that.dom.searchWrapper.css("display","-webkit-box");
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
            var searchApi = tag=='search'?'findAnyWay':'searchByKeyWord';
            $.ajax({
                type: "POST",
                data: "data={'type':'bd'}",
                url: "http://batjobs.duapp.com/"+searchApi+"?callback=?&data=" + JSON.stringify(that.makeQueryObj(tag || 'top10')),
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
            var searchApi = tag=='search'?'findAnyWay':'searchByKeyWord';
            if (tag == 'top10') {

            } else if (tag == 'search') {
                query = that.data.query;

            }
            return {type: searchApi, query: query, option: option};
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