$("#jedno-slozeni .timer").html("00:00:00")

$(".start").click(function(){

	if (running) {
		stop()
	} else {
		reset()
		start()
	}


})

var	clsStopwatch = function() {
	// Private vars
	var	startAt	= 0;	// Time of last start / resume. (0 if not running)
	var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

	var	now	= function() {
		return (new Date()).getTime();
	};

	// Public methods
	// Start or resume
	this.start = function() {
		startAt	= startAt ? startAt : now();
	};

	// Stop or pause
	this.stop = function() {
		// If running, update elapsed time otherwise keep it
		lapTime	= startAt ? lapTime + now() - startAt : lapTime;
		startAt	= 0; // Paused
	};

	// Reset
	this.reset = function() {
		lapTime = startAt = 0;
	};

	// Duration
	this.time = function() {
		return lapTime + (startAt ? now() - startAt : 0);
	};
};

var x = new clsStopwatch();
var $time;
var clocktimer;
var running = false

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	update();
}

function update() {
	$("#jedno-slozeni .timer").html(formatTime(x.time()))
}

function start() {
	clocktimer = setInterval("update()", 1);
	running = true
	x.start();
}

function stop() {
	x.stop();
	running = false
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
}

function makeScramble()
{
	var options = ["L", "R", "U", "D", "F", "B", "L’", "R’", "U’", "D’", "F’", "B’", "L2", "R2", "U2", "D2", "F2", "B2"];
	$(".scramble li[class!='refresh']").remove()
	for (var i = 0; i < 20; i++) {
		var item = options[Math.floor(Math.random() * options.length)];
		$(".scramble").prepend("<li>" + item + "</li>")
	}
}

makeScramble()



$(".scramble .refresh").click	(function() {
	makeScramble()
})