var socket = io.connect("http://localhost:8080");  
  
socket.on('quit', function (data) {  
        status('Client ' + data.cid + ' quits!');  
    });  
  
socket.on('join', function (data) {  
        status('Client ' + data.cid + ' joins!');  
    });  
  
socket.on('broadcast', function (data) {
		if(data.n == "Guest"){
        	$('#thread').append($('<div>').html('Guest' + data.cid + ' says:<br/>' + data.w));
    	}else
    	{
    		$('#thread').append($('<div>').html(data.n + ' says:<br/>' + data.w));
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
  
function initialize() {  
    $(document).delegate('textarea', 'keydown', function (evt) {  
            //console.info(evt.keyCode);  
            if(evt.keyCode == 13 && evt.ctrlKey) {  
                $('#send').focus().click();  
            }  
        });  
}  