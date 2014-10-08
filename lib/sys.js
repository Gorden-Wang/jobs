/**
 * Created by gorden on 14-9-15.
 */

var Baidu = require('../weblogic/baidu.js');
var Ali = require('../weblogic/ali.js');
var Qq = require('../lib/qqdb.js');
//var baidu = new Baidu(1);


function sys() {

}

sys.prototype = {
    init: function () {
        var baidu = new Baidu(1, 4000);
        var ali = new Ali();
        var qq = new Qq();


        baidu.createClient(call);

        function call(res) {
            util.console.log(res);
        }


        ali.createClient(1, call);


        setTimeout(function () {
            ali.createClient(2, call);

            setTimeout(function () {
                ali.createClient(3, call);

                setTimeout(function () {
                    ali.createClient(4, call);
                    setTimeout(function () {
                        ali.createClient(5, call);
                    }, 10000)

                }, 10000)


            }, 10000)

        }, 10000);


        qq.sys();


//        var interval;
//        setTimeout(function () {
//            util.console.log(qq.data.length);
//            interval = setInterval(function () {
//                var temp = qq.data.pop()();
//
//                qq.data.length == 0 && clearInterval(interval);
//
//            }, 10000);
//
//        }, 20000);
    }
}

module.exports = sys;


