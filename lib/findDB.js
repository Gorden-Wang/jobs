/**
 * Created by gorden on 14-9-17.
 */


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
/*数据库连接信息host,port,user,pwd*/
var db_name = 'oHmTqbJBaMRenReMvYFs';                  // 数据库名，从云平台获取
var db_host = 'mongo.duapp.com';      // 数据库地址
var db_port = '8908';   // 数据库端口
var username = 'bk3KnCqXkyBf4euGlrln2h6K';                 // 用户名（API KEY）
var password = 'kVjxqnasn756MEmufVAIpdKM5ct3s8YC';// 密码(Secret KEY)

//var db_name = 'hr';                  // 数据库名，从云平台获取
//var db_host =  '127.0.0.1';      // 数据库地址
//var db_port =  '27017';   // 数据库端口
//var username = 'test';                 // 用户名（API KEY）
//var password = 'test';// 密码(Secret KEY)

var assert = require('assert');

var db = new Db(db_name, new Server(db_host, db_port, {}), {w: 1});


function FindDB() {

}

FindDB.prototype = {
    openDB: function (data, name, callback) {
        db.open(function (err, db) {
            db.authenticate(username, password, function (err, result) {
                if (err) {
                    db.close();
                    //res.end('Authenticate failed!');
                    console.log("authenticate failed")
                    return;
                }
                db.collection(name, callback);
            });
        });
    },
    findByKeyWords: function (dat, opt, callback) {
        var that = this;
        var data = {
            $or: [
                {'requirement': /HTML5/},
                {'description': /HTML5/}
            ],
            workLocation: /北京/ig
        };
        var option = {
            limit: 10,
            skip: 0,
            sort: [
                ['gmtModified', 'desc']
            ]
        };
        var t1 = that._findKey(dat || data, opt || option, 'hr', function (res) {
            callback(res);
        });
    },

    findByCompany: function (dat, opt, callback) {
        var that = this;
        console.log(dat);

        var data = {
            'from': dat.from,
            workLocation: /北京/ig
        };
        var option = {
            limit: 3,
            skip: 0,
            sort: [
                ['gmtModified', 'desc']
            ]
        };
        var t1 = that._findKey(dat || data, opt || option, 'hr', function (res) {
            callback(res);
        });
    },

    findOneByID: function (data, callback) {
        var that = this;

        that.openDB({}, 'hr', function (err, collection) {
            collection.findOne(data, function (err, item) {

                db.close();
                console.log(item);
                callback(item)

            })
        });
    },


    findAnyWay: function (dat, opt, callback) {
        var that = this;
        var data = {
//            $or: [
//                {'requirement': /HTML5/},
//                {'description': /HTML5/}
//            ],
//            workLocation : /北京/ig
        };
        var option = {
            limit: 10,
            skip: 0,
            sort: [
                ['gmtModified', 'desc']
            ]
        };

        if (dat && dat.keyWord) {
            var keyWords = dat.keyWord;

            console.log(keyWords);
            var arr = keyWords.split(" ");
            var res = "";
            for (var i = 0; i < arr.length; i++) {
                res = res + "(" + arr[i] + ")" + "|";
            }


            var reg = new RegExp(res.replace(/\|$/, ''), "ig");
            console.log(reg);
            data.$or = [
                {workLocation: reg},
                {requirement: reg},
                {description: reg},
                {name: reg}
            ];

            console.log(data);
        }
        console.log(opt || option);
        var t1 = that._findKey(data, opt || option, 'hr', function (res) {
            callback(res);
        });
    },

    _findKey: function (data, option, name, callback) {
        var that = this;
        var temp;
        that.openDB({}, name, function (err, collection) {

//            collection.find(data, option).toArray(function (err, items) {
//                db.close();
//                callback && callback(items);
//            });

            collection.find(data, option).toArray(function (err, items) {
                db.close();
                callback && callback(items);
            });
        });


        return temp
    }

}


module.exports = FindDB;


//var test = new FindDB();
//test.findAnyWay({keyWord:"html5 杭州"},null,function(res){
//    console.log(res);
//})

//test.findByKeyWords(null,null,function(res){
//    console.log(res);
//})