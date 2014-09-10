var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
/*数据库连接信息host,port,user,pwd*/
var db_name = 'oHmTqbJBaMRenReMvYFs';                  // 数据库名，从云平台获取
var db_host =  'mongo.duapp.com';      // 数据库地址
var db_port =  '8908';   // 数据库端口
var username = 'bk3KnCqXkyBf4euGlrln2h6K';                 // 用户名（API KEY）
var password = 'kVjxqnasn756MEmufVAIpdKM5ct3s8YC';                 // 密码(Secret KEY)

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


module.exports = testMongo;