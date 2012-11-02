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
        conns[cid] = socket;
        for(var userId in conns){   
            conns[userId].emit('join', {cid: socket.id});
        }
        socket.on('disconnect', function () { 
            for(var userId in conns){  
                conns[userId].emit('quit', {cid: socket.id});
            }
            delete conns[socket.id];  
        });  
  
        socket.on('chat', function (data) {  
            data.cid = socket.id;    
            for(var userId in conns){  
                conns[userId].emit('broadcast', data);
            }    
        });  
});

app.get('/', function (req, res) {  
        res.sendfile(__dirname + '/chatDemo.html');  
    });
  
app.use('/', express.static(__dirname + '/'));

console.log('server start on http://localhost:8080'); 


