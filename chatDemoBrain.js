var socket = io.connect("http://localhost:8080");
var privateRecievers = [];  
  
socket.on('quit', function (data) {  
   status('Client ' + data.cid + ' quits!');
   if(data.conns.length != 0){
      refreshContacts(data.conns);
   }  
});  
  
socket.on('join', function (data) {  
   status('Client ' + data.cid + ' joins!');
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }  
});  
  
socket.on('broadcast', function (data) {
	if(data.sender == "Guest"){
       	$('#thread').append($('<div>').html('Guest' + data.cid + ' says:<br/>' + data.words));
   	}else
   	{
		    $('#thread').append($('<div>').html(data.sender + ' says:<br/>' + data.words));
    }
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }
});

socket.on('private', function (data) {
  if(data.sender == "Guest"){
        $('#thread').append($('<div>').html('Guest' + data.cid + ' says in private:<br/>' + data.words));
    }else
    {
        $('#thread').append($('<div>').html(data.sender + ' says in private:<br/>' + data.words));
    }
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }
});

function chat() {  
    var words = $('#text').val();
    var name = $('#nickname').val();
    if($.trim(name) == "")
    {
      name = "Guest";
    }

    console.log(privateRecievers);
    if($.trim(words)) {
      if(privateRecievers.length == 0){
          socket.emit('chat', {w: words,n:name});
      }else
      {
          socket.emit('private',{w:words,n:name,recievers:privateRecievers});
      }
        $('#text').val('');  
    }  
}  
  
function status(w) {  
    $('#status').html(w);  
}  

function refreshContacts(conns)
{
	var contactStr = "";
	for(var i=0;i<conns.length;i++)
	{
    var nickname = "" + conns[i].nickname;
    var cid = "" + conns[i].cid;
		contactStr = contactStr + '<a href = "#" class="userInfo" onclick="chosenUser(\'' + cid + '\',\'' + nickname + '\');">' + nickname + '</a><br/>';
	}

	$('#contactList').html(contactStr);
}

function chosenUser(cid,nickname)
{
    $('#private').append($('<div>').html('<a href="javascript:void(0)" id="private_'+ cid +'" onclick="deleteChosenUser(\'' + cid + '\');">To ' + nickname + '</a>'));
    privateRecievers[privateRecievers.length] = cid;
}

function deleteChosenUser(cid)
{
    var tagName = "private_" + cid;
    var element = document.getElementById(tagName);
    element.parentNode.removeChild(element);
    for(var i=0;i<privateRecievers.length;i++)
    {
        if(privateRecievers[i] == cid){privateRecievers.splice(i,1);}
    }
}

function initialize() {  
    $(document).delegate('textarea', 'keydown', function (evt) {  
            //console.info(evt.keyCode);  
            if(evt.keyCode == 13 && evt.ctrlKey) {  
                $('#send').focus().click();  
            }  
        });  
}  