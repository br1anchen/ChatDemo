var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')

server.listen(8080);

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret:"brianchencomoyodemo",
    }));
});

var conns = {};

io.sockets.on('connection', function (socket) {  
        var cid = socket.id;  
        for(var ccid in conns) {  
            var soc = conns[ccid];  
            soc.emit('join', {cid: socket.id});  
        }  
        conns[cid] = socket;  
  
        socket.on('disconnect', function () {  
                delete conns[cid];  
                for(var cid in conns) {  
                    var soc = conns[cid];  
                    soc.emit('quit', {cid: cid});  
                }  
            });  
  
        socket.on('chat', function (data) {  
                data.cid = cid;  
                for(var ccid in conns) {  
                    var soc = conns[ccid];  
                    soc.emit('broadcast', data);  
                }  
            });  
});

app.get('/', function (req, res) {  
        res.sendfile(__dirname + '/chatDemo.html');  
    });
  
app.use('/', express.static(__dirname + '/'));

console.log('server start on http://localhost:8080'); 


