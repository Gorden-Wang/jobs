var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
/*数据库连接信息host,port,user,pwd*/
var db_name = 'oHmTqbJBaMRenReMvYFs';                  // 数据库名，从云平台获取
var db_host =  'mongo.duapp.com';      // 数据库地址
var db_port =  '8908';   // 数据库端口
var username = 'bk3KnCqXkyBf4euGlrln2h6K';                 // 用户名（API KEY）
var password = 'kVjxqnasn756MEmufVAIpdKM5ct3s8YC';// 密码(Secret KEY)
var assert = require('assert');

var db = new Db(db_name, new Server(db_host, db_port, {}), {w: 1});

function testMongo(req, res) {
    function test(err, collection) {
        collection.insert({a: 1}, function(err, docs) {
            if (err) {
                console.log(err);
                res.end('insert error');
                return;
            }

            console.log("aa")
            collection.count(function(err, count) {
                if (err) {
                    console.log(err);
                    res.end('count error');
                    return;
                }
                res.end('count: ' + count + '\n');
                db.close();
            });
        });
    }

    db.open(function(err, db) {
        db.authenticate(username, password, function(err, result) {
            if (err) {
                db.close();
                res.end('Authenticate failed!');
                return;
            }
            db.collection('test_insert', test);
        });
    });
}


function mongo(req, res) {

}



mongo.prototype = {

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

    insert: function (data,nextcallback) {
        var that = this;

        if(db){
            db.close();
        }

        that.openDB(data, 'hr', function (err, collection) {
            //先检查数据是否重复



            that.baiduCollection = collection;
            function check(i,data, coll, callback) {


                coll.findOne({id:data.id}, function (err, docs) {
                    if (err) {
                        console.log("findOne error :" + err)
                        return;
                    }


                    if (!!docs && !!docs.length && docs.length == 0 || docs == '' || docs == null) {

                        console.log(docs)


                        callback(i,data, coll);
                        return;
                    }

                    console.log("next call back start")

                    nextcallback;

                });
            }

            function insert(i,data, coll) {

                coll.insert(data, function (err, docs) {
                    if (err) {
                        console.log("insert error:" + err)
                        return;
                    }
                    console.log("insert success");

                    i && nextcallback;

                });
            }


            for (var i = 0; i < data.length; i++) {
                check(i==(data.length-1)?true:false,data[i], collection, insert);
            }
        });
    },


    find: function (data) {
        var that = this;
        console.log("next call back in")
        that.openDB(data, 'hr', function (err, collection) {
            collection.find(data).toArray(function (err, docs) {
                if (err) {
                    console.log("-----------------------" + err);
                    db.close();
                    return;
                }
                console.log(docs)

                db.close();
            });
        })
    },

    _update:function(id,data){
        var that = this;
        that.baiduCollection.update({"id": id}, {$set: data},function(err,docs){
            if(err){
                console.log("update err:"+JSON.stringify(err));
            }

            console.log(docs)

            console.log("update success");
        });
    }

}


//var m = new mongo();
//
//m.find();
module.exports = mongo;