var noSleep = new NoSleep();

var inGameInit = function () {
    noSleep.enable();
    // Chrome solution
    document.keepScreenAwake = true;

    window.ondevicemotion = function(e) {
        var x = event.accelerationIncludingGravity.x,
            y = event.accelerationIncludingGravity.y,
            z = event.accelerationIncludingGravity.z;

        if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
            z = -z;
        }

        socket.emit('game:move', JSON.stringify({
            x: x,
            y: y,
            z: z
        }));

        // For tests only
        $('#mobile [data-page="game"] .coords').html(Math.floor(x) +':'+ Math.floor(y) +':'+ Math.floor(z));
    };

    $('#mobile [data-page="game"] p b').html('TAP SCREEN TO SHOOT MISSILES');
    Waves.attach('#mobile [data-page="game"]');
    Waves.init();


    $('#mobile [data-page="game"]').on('click', function () {
        socket.emit('game:fire');
    });
};


var inGameReset = function () {
    noSleep.disable();

    window.ondevicemotion = function () {};
    $('#mobile [data-page="game"]').off('click');
}


// Quand l'utilisateur meurt
socket.on('game:dead', function () {
    $('#mobile [data-page="game"] p b').html('YOU ARE DEAD, SORRY');
    inGameReset();
    window.navigator.vibrate(1000);
});
