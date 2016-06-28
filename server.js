var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    var method = req.method;
    console.log(req.url, method);
    req.setEncoding('utf8');
    if (pathname == '/') {
        fs.createReadStream('./index.html').pipe(res);
    } else if (pathname == '/users') {
        switch (method) {
            case 'GET':
                var id = query.id;
                if (id) {
                    fs.readFile('./users.json', 'utf8', function (err, data) {
                        var users = JSON.parse(data);
                        var user = users.filter(function (item) {
                            return item.id == id;
                        })[0];
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({code: 'success', data: user}));
                    })
                } else {
                    fs.readFile('./users.json', 'utf8', function (err, data) {
                        var users = JSON.parse(data);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({code: 'success', data: users}));
                    })
                }
                break;
            case 'POST':
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    var user = querystring.parse(body);
                    fs.readFile('./users.json', 'utf8', function (err, data) {
                        var users = JSON.parse(data);
                        user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
                        users.push(user);
                        fs.writeFile('./users.json', JSON.stringify(users), 'utf8', function (err) {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({code: 'success', data: user}));
                        })
                    })
                });
                break;
            case 'PUT':
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    var user = querystring.parse(body);
                    console.log(user);
                    fs.readFile('./users.json', 'utf8', function (err, data) {
                        var users = JSON.parse(data);
                        users = users.map(function (item) {
                            if (item.id == user.id) {
                                Object.assign(item, user);
                            }
                            return item;
                        });
                        fs.writeFile('./users.json', JSON.stringify(users), 'utf8', function (err) {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({code: 'success', data: user}));
                        })
                    })
                });
                break;
            case 'DELETE':
                var id = query.id;
                fs.readFile('./users.json', 'utf8', function (err, data) {
                    var users = JSON.parse(data);
                    var users = users.filter(function (user) {
                        return user.id != id;
                    });
                    fs.writeFile('./users.json', JSON.stringify(users), 'utf8', function (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({code: 'success', data: {}}));
                    })

                })
                break;
        }

    } else {
        fs.exists('.' + pathname, function (exists) {
            if (exists) {
                fs.createReadStream('.' + pathname).pipe(res);
            } else {
                res.statusCode = 404;
                res.end('404');
            }
        })
    }
}).listen(9090);