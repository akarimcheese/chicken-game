var socket = io();
var user = -1;
var swerve = false;
var inMatch = false;

$('#getMatch').click(function(){
    socket.emit('match ready', user);
    $('#currentAction').text('Current action: Stay');
    swerve = false;
    $('#player-car-back').css("left","400px");
    $('#player-car-top').css("left","400px");
    $('#player-car-back').css("transform","rotate(0deg)");
    $('#player-car-top').css("transform","rotate(0deg)");
    $('#player-car-back').css("-o-transform","rotate(0deg)");
    $('#player-car-top').css("-o-transform","rotate(0deg)");
    $('#player-car-back').css("-moz-transform","rotate(0deg)");
    $('#player-car-top').css("-moz-transform","rotate(0deg)");
    $('#player-car-back').css("-webkit-transform","rotate(0deg)");
    $('#player-car-top').css("-webkit-transform","rotate(0deg)");
    $('#opp-container').css("left","400px");
    $('#opp-car-top').css("margin-left","0px");
    $('#opp-car').css("transform","rotate(0deg)");
    $('#opp-car-top').css("transform","rotate(0deg)");
    $('#opp-car').css("-o-transform","rotate(0deg)");
    $('#opp-car-top').css("-o-transform","rotate(0deg)");
    $('#opp-car').css("-moz-transform","rotate(0deg)");
    $('#opp-car-top').css("-moz-transform","rotate(0deg)");
    $('#opp-car').css("-webkit-transform","rotate(0deg)");
    $('#opp-car-top').css("-webkit-transform","rotate(0deg)");
    $('#opp-container').removeClass('unleash');
    $('#getMatch').text('Waiting...');
    return false;
});

$('#swerve').click(function(){
    if (!swerve) {
        $('#currentAction').text('Current action: Swerve');
        socket.emit('swerve','');
        swerve = true;
    }
    return false;
});

$('#stay').click(function(){
    if (swerve) {
        $('#currentAction').text('Current action: Stay');
        socket.emit('stay','');
        swerve = false;
    }
    return false;
});

socket.on('onon', function(msg) {
        user = parseInt(msg);
        $('#GUI').text('Your User ID is ' + msg);
});

socket.on('userCount', function(msg) {
        $('#pop').text('Users online: ' + msg);
});

socket.on('Score', function(msg) {
        $('#score').text('Score: ' + msg);
});

socket.on('Result', function(msg) {
        if (parseInt(msg) == -1) {
            $('#player-car-back').css("left","-=100");
            $('#player-car-top').css("left","-=100");
            $('#currentAction').text('You chickened out!');
        } else if (parseInt(msg) == 0) {
            $('#player-car-back').css("left","-=100");
            $('#player-car-top').css("left","-=100");
            $('#opp-container').css("left","+=100");
            $('#opp-car-top').css("margin-left","+=100");
            $('#currentAction').text('Both of you chickened out!');
        } else if (parseInt(msg) == 1) {
            $('#opp-container').css("left","+=100");
            $('#opp-car-top').css("margin-left","+=100");
            $('#currentAction').text('You won!');
        } else if (parseInt(msg) == -10) {
            setTimeout (function () {
                $('#player-car-back').css("-webkit-transform","rotate(45deg)");
                $('#player-car-top').css("-webkit-transform","rotate(45deg)");
                $('#player-car-back').css("-o-transform","rotate(45deg)");
                $('#player-car-top').css("-o-transform","rotate(45deg)");
                $('#player-car-back').css("-moz-transform","rotate(45deg)");
                $('#player-car-top').css("-moz-transform","rotate(45deg)");
                $('#player-car-back').css("transform","rotate(45deg)");
                $('#player-car-top').css("transform","rotate(45deg)");

                $('#opp-car').css("-webkit-transform","rotate(-45deg)");
                $('#opp-car-top').css("-webkit-transform","rotate(-45deg)");
                $('#opp-car').css("-o-transform","rotate(-45deg)");
                $('#opp-car-top').css("-o-transform","rotate(-45deg)");
                $('#opp-car').css("-moz-transform","rotate(-45deg)");
                $('#opp-car-top').css("-moz-transform","rotate(-45deg)");
                $('#opp-car').css("transform","rotate(-45deg)");
                $('#opp-car-top').css("transform","rotate(-45deg)");
                $('#currentAction').text('You crashed!');
            }, 500);
        }
}); 

socket.on('match start', function(msg) {
        inMatch = true;
        $('#GUI').text('Your User ID is ' + user + ', your opponent is ' + msg);
        $('#road-yellow').removeClass('pause');
        $('#opp-car').removeClass('pause');
        $('#redbloop').removeClass('pause');
        $('#bluebloop').removeClass('pause');
        $('#opp-car-top').removeClass('pause');

        setTimeout( function(){ 
            $('#opp-container').addClass('unleash');
            inMatch = false;
            setTimeout( function() {
                $('#road-yellow').addClass('pause');
                $('#opp-car').addClass('pause');
                $('#redbloop').addClass('pause');
                $('#bluebloop').addClass('pause');
                $('#opp-car-top').addClass('pause');
                $('#getMatch').text('Ready');
                $('#GUI').text('Your User ID is ' + user);
            }, 1000);
          }  , 9000 );
});