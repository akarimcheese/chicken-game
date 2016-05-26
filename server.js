var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userId = 0;
var userSocket = [];
var swerve = [];
var busy = [];
var scores = [];
var usersOn = 0;

app.get('/', function(reg, res){
	res.sendFile(__dirname + '/chicken.html');
});

io.on('connection', function(socket){
	usersOn++;
	var user = userId++;
	
	userSocket.push(socket);
	busy[user] = 0;
	scores[user] = 0;
	
	userSocket[user].emit('onon',user);
	userSocket[user].emit('userCount',usersOn);
	console.log(user + 'connected');
	console.log(socket);
	
	socket.on('match ready', function(msg){
		if (busy[user] == 0) {
			console.log(msg + ' is ready');
			opp = -1
		
			u = 0
			for (status of busy) {
			  if (status == 1 && u != user) {
				opp = u;
				break;
			  }
			  u++;
			}
		
			if (opp == -1) {
				console.log(msg + ': No one else available');
				busy[user] = 1;
			}
			else {
				console.log(msg + ': ' + opp + ' is available!');
				busy[user] = 2
				busy[opp] = 2
				swerve[user] = false;
				swerve[opp] = false;
				userSocket[user].emit('match start', opp);
				userSocket[opp].emit('match start', user);
			
				setTimeout(function() {
					if (swerve[user] && swerve[opp]) {
						uresult = 0;
						oresult = 0;
						console.log(user + ' and ' + opp + 'chickened out!');
					}
					else if (swerve[user]) {
						oresult = 1;
						uresult = -1;
						console.log(user + ' chickened out!');
					}
					else if (swerve[opp]) {
						uresult = 1;
						oresult = -1;
						console.log(opp + ' chickened out!');
					}
					else {
						uresult = -10;
						oresult = -10;
						console.log(user + ' and ' + opp + 'crashed!');
					}
					userSocket[user].emit('Result',uresult);
					userSocket[opp].emit('Result',oresult);
					scores[user] += uresult;
					scores[opp] += oresult;
					userSocket[user].emit('Score',scores[user]);
					userSocket[opp].emit('Score',scores[opp]);
					busy[user] = 0;
					busy[opp] = 0;
				},9000);
			
			}
		}
	});
	
	socket.on('swerve',function(){
		swerve[user] = true;
		console.log(user + ' wants to swerve ' + swerve[user]);
	});
	
	socket.on('stay',function(){
		swerve[user] = false;
		console.log(user + ' wants to stay ' + swerve[user]);
	});
	
	socket.on('disconnect', function() {
		busy[user] = -1;
		usersOn--;
		console.log(user + ' disconnected');
	})
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
