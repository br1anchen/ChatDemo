var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')

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

/*socket.io configuration for heroku*/
io.configure(function () { 
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 2);
  io.set("close timeout",3);
});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('Listening on ' + port);
});

var conns = {};
var contactInfos = [];

io.sockets.on('connection', function (socket) {  
        var cid = socket.id;
        
        conns[cid] = {
            connSocket:socket,
            nickname:"Guest"+socket.id
        };

        contactInfos[contactInfos.length]={
            cid:socket.id,
            nickname:"Guest"+socket.id
        };

        console.log(conns);
        console.log(contactInfos);

        for(var userId in conns){   
            conns[userId].connSocket.emit('join', {cid: socket.id,recieverName:conns[userId].nickname,conns:contactInfos});
        }
        socket.on('disconnect', function () {
            for(var i=0;i<contactInfos.length;i++)
            {
                if(contactInfos[i].cid == socket.id){contactInfos.splice(i,1);}
            }

            for(var userId in conns){  
                conns[userId].connSocket.emit('quit', {cid: socket.id,quiter:conns[socket.id].nickname,conns:contactInfos});
            }
            delete conns[socket.id];  
        });  
  
        socket.on('chat', function (data) {  
            data.cid = socket.id;
            conns[socket.id].nickname = data.n;

            for(var i=0;i<contactInfos.length;i++)
            {
                if(contactInfos[i].cid==socket.id){contactInfos[i].nickname = data.n;}
            }

            for(var userId in conns){  
                conns[userId].connSocket.emit('broadcast', {cid:socket.id,words:data.w,sender:data.n,conns:contactInfos});
            }    
        });

        socket.on('private', function (data) {  
            //console.log(data.recievers);
            conns[socket.id].nickname = data.n;

            for(var i=0;i<contactInfos.length;i++)
            {
                if(contactInfos[i].cid==socket.id){contactInfos[i].nickname = data.n;}
            }

            for(var userId in conns){
                for(var i = 0;i<data.recievers.length;i++)
                {
                    if(conns[userId].connSocket.id == data.recievers[i])
                    {
                        conns[userId].connSocket.emit('private', {cid:socket.id,words:data.w,sender:data.n,reciever:'You',conns:contactInfos});
                        conns[socket.id].connSocket.emit('private', {cid:socket.id,words:data.w,sender:'You',reciever:conns[userId].nickname,conns:contactInfos});
                    }
                }
            }    
        });
});

app.get('/', function (req, res) {  
        res.sendfile(__dirname + '/chatDemo.html');  
    });
  
app.use('/', express.static(__dirname + '/'));

console.log('server start on http://localhost:' + port); 


