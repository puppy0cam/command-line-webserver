var yu = module.exports = {};
var fs = require('fs');

yu.argumentFixer = function(cmd) {
	var x = []
	var x1 = []
	x1[0] = cmd
	x[0] = cmd
	x1[1] = x[0].slice(0)
	x[1] = x[0].slice(0, x[0].search(" "))
	x1[x1.length] = x1[x1.length-1].slice(1+x1[x1.length-1].search(" "))
	x[x.length] = x1[x1.length-1].slice(0, x1[x1.length-1].search(" "))
	while(x[x.length-1] !== x[x.length-2]) {
		x1[x1.length] = x1[x1.length-1].slice(1+x1[x1.length-1].search(" "))
		x[x.length] = x1[x1.length-1].slice(0, x1[x1.length-1].search(" "))
	}
	delete x[x.length-1]
	x.length = x.length-1
	x[x.length-1] = x1[x1.length-1]
	delete x1
	return x.slice(1)
}
yu.messages = [];
yu.commandFilter = function(cmd) {
	var args = yu.argumentFixer(cmd);
	if (args[0] === "command1") { //defines a command
		//insert your code here
		var reply = "the first command was run!" //set the variable reply to be what the client see's as the response!
		return reply
	} else if(args[0] === "command2") { //defines another command
		//insert your code here
		var reply = "the second command was run!" //set the variable reply to be what the client see's as the response!
		return reply
	} else if(args[0] === "command3") { //defines another command
		//insert your code here
		var reply = "the third command was run!" //set the variable reply to be what the client see's as the response!
		return reply
	} else if(args[0] === "command4") { //defines another command
		//insert your code here
		var reply = "the fourth command was run!" //set the variable reply to be what the client see's as the response!
		return reply
	} else {
		return "ERROR: command: "+ args[0] + " not found"
	}
}
fs.readFile("./log.log", "utf-8", function(err, data){if(data !== undefined){yu.messages = JSON.parse(data);}});

yu.app = require('express')();
yu.http = require('http').Server(yu.app);
yu.io = require('socket.io')(yu.http);

yu.app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

yu.io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		yu.io.emit('chat message', msg);
		yu.messages[yu.messages.length] = { 'time': Date(), 'message': msg, 'response': yu.commandFilter(msg) }
		yu.io.emit('chat message', yu.commandFilter(msg));
		fs.writeFile("./log.log", JSON.stringify(yu.messages));
	});
});

yu.http.listen(3000, function(){
	console.log('listening on *:3000');
});

yu.io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
	});
});
