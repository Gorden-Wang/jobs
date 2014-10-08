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
var baidu = new Baidu(1,400);
var Ali = require('../weblogic/ali.js');
var ali = new Ali();
//var db_name = 'hr';                  // 数据库名，从云平台获取
//var db_host =  '127.0.0.1';      // 数据库地址
//var db_port =  '27017';   // 数据库端口
//var username = 'test';                 // 用户名（API KEY）
//var password = 'test';// 密码(Secret KEY)

var db = new Db(db_name, new Server(db_host, db_port, {}), {w: 1});

function mongo(req, res) {

}


mongo.prototype = {

    openDB: function (data, name, callback) {
        db.open(function (err, db) {
            db.authenticate(username, password, function (err, result) {
                if (err) {
                    db.close();
                    console.log("authenticate failed")
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
//                        console.log("authenticate failed")
//                        return;
//                    }
//                    db.collection(name, callback);
//                });
//            });
//        });
    },
    sys: function () {
        var that = this;

        var  timeout = setTimeout(function(){
            db.close();
        },1000*1000);

        that.openDB({}, 'hr', function (err, collection) {
           //qq


            for(var i =0 ; i<200 ; i++){
                qq.createClient(i,function(listdata){
                    //拿到列表数据
                    for(var i =0 ; i< listdata.length-1 ; i++){
                        //检查每一条是否重复
                        var tempData = function(){return listdata[i]};

                        that.findOne(collection,tempData(),function(err,docs,data){
                            if(err){
                                console.log(err);
                                db.close();
                            }
                            if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                                //没有这条记录，插入这条记录，并且更新这条记录

                                that.insertOne(collection,data,function(err,docs,res){
                                    if (err) {
                                        console.log("insert error:" + err)
                                        return;
                                    }
                                    console.log("insert qq success");
                                    //插入成功，更新记录
                                    qq.getDetail(res,function(alldata){
                                        //更新数据
                                        collection.update({"id": res.id}, {$set: alldata}, function (err, docs) {
                                            if (err) {
                                                console.log("insert & update qq err:" + JSON.stringify(err));
                                            }

                                            console.log("update qq success");

                                        });

                                    });
                                });
                            }else{
                                //有这条记录，不插入，只更新这条时记录
                                qq.getDetail(data,function(alldata){
                                    //更新数据
                                    collection.update({"id": data.id}, {$set: alldata}, function (err, docs) {
                                        if (err) {
                                            console.log("update qq err:" + JSON.stringify(err));
                                        }

                                        console.log("not insert & update qq success");

                                    });

                                });
                            }
                        })
                    }


                });
            }

            //baidu sys
            //拿到4000列表


            for(var j =0 ; j<10 ; j++){
                baidu.createClient(j,function(listdata){
                    for(var i =0 ; i<listdata.length ; i++ ){
                        var tempData = function(){return listdata[i]};

                        that.findOne(collection,tempData(),function(err,docs,data){
                            if(err){
                                console.log(err);
                                db.close();
                            }
                            if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                                //没有这条记录，插入这条记录，并且更新这条记录

                                that.insertOne(collection,data,function(err,docs,res){
                                    if (err) {
                                        console.log("insert error:" + err)
                                        return;
                                    }
                                    console.log("insert baidu success");
                                    //插入成功，更新记录
                                    baidu.getDetail(res,function(alldata){
                                        //更新数据
                                        collection.update({"id": res.id}, {$set: alldata}, function (err, docs) {
                                            if (err) {
                                                console.log("insert & update baidu err:" + err);
                                                return;
                                            }

                                            console.log("update baidu success");

                                        });

                                    });
                                });
                            }else{
                                //有这条记录，不插入，只更新这条时记录
                                baidu.getDetail(data,function(alldata){
                                    //更新数据
                                    collection.update({"id": data.id}, {$set: alldata}, function (err, docs) {
                                        if (err) {
                                            console.log("update baidu err:" + JSON.stringify(err));
                                            return;
                                        }

                                        console.log("not insert baidu & update success");

                                    });

                                });
                            }
                        })
                    }
                });
            }

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

           for(var i =0 ;i <=4 ; i++){
               ali.createClient(i,function(data){
                for(var j =0 ; j<data.length;j++){
                    that.findOne(collection,data[j],function(err,docs,res){
                        if(err){
                            console.log("ali error");
                            return;
                        }
                        res.from="ali";
                        if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {
                            that.insertOne(collection,res,function(err,docs,res){
                                console.log("insert ali success")
                            });
                        }else{
                            collection.update({"id": res.id}, {$set: res}, function (err, docs) {
                                if (err) {
                                    console.log("update ali err:" + JSON.stringify(err));
                                }

                                console.log("not insert ali & update alidata success");

                            });
                        }
                    })
                }
               });
           }





        });







    },
    findOne:function(collection,data,callback){
        var that = this;
        collection.findOne({id:data.id},function(err,docs){
            temp.apply(this,[]);
            callback(err,docs,this.data);
        })

        var temp = function(){
            this.data = data;
        }
    },

    insertOne:function(collection,data,callback){
        collection.insert(data,function(err,docs,data){
            temp.apply(this,[]);
            callback(err,docs,this.data);
        });
        var temp = function(){
            this.data = data;
        }
    },
    testUpdate:function(coll,data,res){
        coll.update({"id": data.id}, {$set: res}, function (err, docs) {
            if (err) {
                console.log("insert & update baidu err:" + err);
                return;
            }

            console.log("update baidu success");

        });
    }


}


//var m = new mongo();

//m.sys();
module.exports = mongo;

