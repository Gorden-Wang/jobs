/**
 * Created by gorden on 14-9-29.
 */


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
/*数据库连接信息host,port,user,pwd*/
var db_name = 'oHmTqbJBaMRenReMvYFs';                  // 数据库名，从云平台获取
var db_host = 'mongo.duapp.com';      // 数据库地址
var db_port = '8908';   // 数据库端口
var username = 'bk3KnCqXkyBf4euGlrln2h6K';                 // 用户名（API KEY）
var password = 'kVjxqnasn756MEmufVAIpdKM5ct3s8YC';// 密码(Secret KEY)
var assert = require('assert');
var Qq = require("../weblogic/qq.js");
var qq = new Qq();
var Baidu = require('../weblogic/baidu.js');
var baidu = new Baidu(1, 400);
var Ali = require('../weblogic/ali.js');
var ali = new Ali();
var util = require('./util.js');
util = new util();
//var db_name = 'hr';                  // 数据库名，从云平台获取
//var db_host =  '127.0.0.1';      // 数据库地址
//var db_port =  '27017';   // 数据库端口
//var username = 'test';                 // 用户名（API KEY）
//var password = 'test';// 密码(Secret KEY)

var db = new Db(db_name, new Server(db_host, db_port, {}), {w: 1});

function mongo(sysAll) {
    this.sysAll = sysAll;
}


mongo.prototype = {

    openDB: function (data, name, callback) {
        db.open(function (err, db) {
            db.authenticate(username, password, function (err, result) {
                if (err) {
                    db.close();
                    util.console.log("authenticate failed")
                    return;
                }
                db.collection(name, callback);
            });
        });

//        db.on("close",function(){
//            db.open(function (err, db) {
//                db.authenticate(username, password, function (err, result) {
//                    if (err) {
//                        db.close();
//                        util.console.log("authenticate failed")
//                        return;
//                    }
//                    db.collection(name, callback);
//                });
//            });
//        });
    },
    sys: function () {
        var that = this;

        var timeout = setTimeout(function () {
            db.close();
            //全部更新15分钟关闭，部分：8分钟
        }, that.sysAll ? 1000 * 60 * 15 : 1000 * 60 * 8);

        that.openDB({}, 'hr', function (err, collection) {
            //qq
            for (var i = 0; i < (that.sysAll ? 200 : 50); i++) {
                qq.createClient(i, function (listdata) {
                    //拿到列表数据
                    for (var i = 0; i < listdata.length - 1; i++) {
                        //检查每一条是否重复
                        var tempData = function () {
                            return listdata[i]
                        };

                        that.findOne(collection, tempData(), function (err, docs, data) {
                            if (err) {
                                util.console.log("qq insert error" + err);
//                                db.close();
                            }
                            if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                                //没有这条记录，插入这条记录，并且更新这条记录

                                that.insertOne(collection, data, function (err, docs, res) {
                                    if (err) {
                                        util.console.log("insert error:" + err)
                                        return;
                                    }
                                    util.console.log("insert qq success");
                                    //插入成功，更新记录
                                    qq.getDetail(res, function (alldata) {
                                        //更新数据
                                        collection.update({"id": res.id}, {$set: alldata}, function (err, docs) {
                                            if (err) {
                                                util.console.log("insert & update qq err:" + JSON.stringify(err));
                                            }

                                            util.console.log("update qq success");

                                        });

                                    });
                                });
                            } else {
                                //有这条记录，不插入，只更新这条时记录
                                qq.getDetail(data, function (alldata) {
                                    //更新数据
                                    collection.update({"id": data.id}, {$set: alldata}, function (err, docs) {
                                        if (err) {
                                            util.console.log("update qq err:" + JSON.stringify(err));
                                        }

                                        util.console.log("not insert & update qq success");

                                    });

                                });
                            }
                        })
                    }


                });
            }

            //baidu sys
            //拿到4000列表

            setTimeout(function () {
                for (var j = 0; j < (that.sysAll ? 10 : 1); j++) {
                    baidu.createClient(j, function (listdata) {
                        for (var i = 0; i < listdata.length; i++) {
                            var tempData = function () {
                                return listdata[i]
                            };

                            that.findOne(collection, tempData(), function (err, docs, data) {
                                if (err) {
                                    util.console.log(err);
                                    db.close();
                                }
                                if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                                    //没有这条记录，插入这条记录，并且更新这条记录

                                    that.insertOne(collection, data, function (err, docs, res) {
                                        if (err) {
                                            util.console.log("insert error:" + err)
                                            return;
                                        }
                                        util.console.log("insert baidu success");
                                        //插入成功，更新记录
                                        baidu.getDetail(res, function (alldata) {
                                            //更新数据
                                            collection.update({"id": res.id}, {$set: alldata}, function (err, docs) {
                                                if (err) {
                                                    util.console.log("insert & update baidu err:" + err);
                                                    return;
                                                }

                                                util.console.log("update baidu success");

                                            });

                                        });
                                    });
                                } else {
                                    //有这条记录，不插入，只更新这条时记录
                                    baidu.getDetail(data, function (alldata) {
                                        //更新数据
                                        collection.update({"id": data.id}, {$set: alldata}, function (err, docs) {
                                            if (err) {
                                                util.console.log("update baidu err:" + JSON.stringify(err));
                                                return;
                                            }

                                            util.console.log("not insert baidu & update success");

                                        });

                                    });
                                }
                            })
                        }
                    });
                }
                //全部更新4分钟后执行，部分：2分钟
            }, that.sysAll ? 1000 * 60 * 4 : 1000 * 60 * 2);


//废弃方法
//            baidu.createClient(function(listdata){
//
//                for(var i =0 ; i<listdata.length ; i++ ){
//                    var tempData = function(){return listdata[i]};
//
//                    that.findOne(collection,tempData(),function(err,docs,data){
//                        if(err){
//                            console.log(err);
//                            db.close();
//                        }
//                        if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
//                            //没有这条记录，插入这条记录，并且更新这条记录
//
//                            that.insertOne(collection,data,function(err,docs,res){
//                                if (err) {
//                                    console.log("insert error:" + err)
//                                    return;
//                                }
//                                console.log("insert baidu success");
//                                //插入成功，更新记录
//                                baidu.getDetail(res,function(alldata){
//                                    //更新数据
//                                    collection.update({"id": res.id}, {$set: alldata}, function (err, docs) {
//                                        if (err) {
//                                            console.log("insert & update baidu err:" + err);
//                                            return;
//                                        }
//
//                                        console.log("update baidu success");
//
//                                    });
//
//                                });
//                            });
//                        }else{
//                            //有这条记录，不插入，只更新这条时记录
//                            baidu.getDetail(data,function(alldata){
//                                //更新数据
//                                collection.update({"id": data.id}, {$set: alldata}, function (err, docs) {
//                                    if (err) {
//                                        console.log("update baidu err:" + JSON.stringify(err));
//                                        return;
//                                    }
//
//                                    console.log("not insert baidu & update success");
//
//                                });
//
//                            });
//                        }
//                    })
//                }
//            });


            //阿里
            setTimeout(function () {
                for (var i = 0; i <= (that.sysAll ? 4 : 1); i++) {
                    ali.createClient(i, function (data) {
                        for (var j = 0; j < data.length; j++) {
                            that.findOne(collection, data[j], function (err, docs, res) {
                                if (err) {
                                    util.console.log("ali error");
                                    return;
                                }
                                res.from = "ali";
                                if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                                    that.insertOne(collection, res, function (err, docs, res) {
                                        util.console.log("insert ali success")
                                    });
                                } else {
                                    collection.update({"id": res.id}, {$set: res}, function (err, docs) {
                                        if (err) {
                                            util.console.log("update ali err:" + JSON.stringify(err));
                                        }

                                        util.console.log("not insert ali & update alidata success");

                                    });
                                }
                            })
                        }
                    });
                }
                //全部更新4分钟后执行，部分：2分钟
            }, that.sysAll ? 1000 * 60 * 10 : 1000 * 60 * 5);
        });
    },
    findOne: function (collection, data, callback) {
        var that = this;
        var temp = function () {
            this.data = data;
        };
        collection.findOne({id: data.id}, function (err, docs) {
            temp.apply(this, []);
            callback(err, docs, this.data);
        });


    },

    insertOne: function (collection, data, callback) {
        var temp = function () {
            this.data = data;
        };
        collection.insert(data, function (err, docs, data) {
            temp.apply(this, []);
            callback(err, docs, this.data);
        });

    },
    testUpdate: function (coll, data, res) {
        coll.update({"id": data.id}, {$set: res}, function (err, docs) {
            if (err) {
                util.console.log("insert & update baidu err:" + err);
                return;
            }

            util.console.log("update baidu success");

        });
    }


}


//var m = new mongo(true);

//m.sys();
module.exports = mongo;

