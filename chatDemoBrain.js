var socket = io.connect("http://limitless-peak-5260.herokuapp.com/",{'sync disconnect on unload' : true});
var privateRecievers = [];
var defaultId = ""; 
  
socket.on('quit', function (data) {  
    status(data.quiter + ' quits!');
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }  
});  
  
socket.on('join', function (data) {  
    status('Client ' + data.cid + ' joins!');
    defaultId = data.recieverId;
    $('#defaultName').html('Welcome:'+ data.recieverName);
    $('#yourName').hide();
    $('#defaultName').show();
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }  
});  
  
socket.on('broadcast', function (data) {
		$('#thread').append($('<div>').html(data.sender + ' says:<br/>' + data.words));
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }
});

socket.on('private', function (data) {
    $('#thread').append($('<div>').html(data.sender + ' says in private to ' + data.reciever + ':<br/>' + data.words));
    if(data.conns.length != 0){
      refreshContacts(data.conns);
   }
});

function chat() {  
    var words = $('#text').val();
    var name = $('#nickname').val();
    
    if($.trim(name) == "")
    {
      name = "Guest" + defaultId;
      $('#yourName').hide();
      $('#defaultName').show();
    }else
    {
      $('#yourName').show();
      $('#defaultName').hide();
      $('#yourName').html('Welcome:'+ name);  
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
		contactStr = contactStr + '<a href="javascript:void(0)" class="userInfo" onclick="chosenUser(\'' + cid + '\',\'' + nickname + '\');">' + nickname + '</a><br/>';
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