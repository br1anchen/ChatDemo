var socket = io.connect("http://localhost:8080");  
  
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

function chat() {  
    var words = $('#text').val();
    var name = $('#nickname').val();  
    if($.trim(words)) {
    	if($.trim(name)){  
        	socket.emit('chat', {w: words,n:name});
        }else
        {
        	socket.emit('chat',{w:words,n:"Guest"});
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
		contactStr = contactStr + "<a data-name=\""+ nickname + " data-cid=\""+ cid +"\">" + nickname + "</a><br/>";
	}

	$('#contactList').html(contactStr);
}

function initialize() {  
    $(document).delegate('textarea', 'keydown', function (evt) {  
            //console.info(evt.keyCode);  
            if(evt.keyCode == 13 && evt.ctrlKey) {  
                $('#send').focus().click();  
            }  
        });  
}  