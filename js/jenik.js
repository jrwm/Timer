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
var clocktimer;

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

function update() {
	if (mode == "JS") {
		JSTimer.html(formatTime(x.time()))
	} else if (mode == "PS") {
		PSTimer.html(formatTime(x.time()))
	}
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
}

////////////////////////
// INIT GENERAL
////////////////////////

var mode = "JS"
var scrambleButton = $(".scramble .refresh")

$(".tabs .jedno-slozeni a").click(function() {
	mode = "JS"
	scrambleButton.unbind()
	scrambleButton.click(fJSObnovit)
	fJSObnovit()
})

$(".tabs .prumer-z-peti-slozeni a").click(function() {
	mode = "PS"
	scrambleButton.unbind()
	scrambleButton.click(fPSObnovit)
	fPSObnovit()
})

function prependFullScreenButton()
{
	if ($(window).width() > 800) {
		return
	}
	$(".main").prepend('<a href="#" class="button-screen"></a>')
	$(".button-screen").click(function(){
		if (mode == "JS") {
			fJSStop()
		} else if (mode == "PS") {
			fPSStop()
		}
	})
}

function removeFullScreenButton()
{
	if ($(window).width() > 800) {
		return
	}
	$(".button-screen").remove()
}




////////////////////////
// INIT JEDNO SLOZENI
////////////////////////

var JSTimer = $("#jedno-slozeni .timer")
var JSObnovit = $("#jedno-slozeni .obnovit")
var JSStart = $("#jedno-slozeni .start")
var JSStop = $("#jedno-slozeni .stop")
var JSStatus = 0

function initJednoSlozeni() {
	JSStatus = 0
	JSTimer.html("00:00:000")
	JSObnovit.show()
	JSStop.hide()
	scrambleButton.click(fJSObnovit)
}

initJednoSlozeni()

function fJSStart() {
	JSStatus = 1
	reset()
	start()
	JSStart.hide()
	JSStop.show()
	prependFullScreenButton()
}

function fJSStop() {
	JSStatus = 2
	stop()
	JSStop.hide()
	JSObnovit.show()
	removeFullScreenButton()
}

function fJSObnovit() {
	generateScrambleAndApplyToHtml(ctype)
	JSStatus = 0
	reset()
	JSObnovit.show()
	JSStart.show()
	JSStop.hide()
}

JSStart.click(fJSStart)
JSStop.click(fJSStop)
JSObnovit.click(fJSObnovit)

////////////////////////
// INIT PET SLOZENI
////////////////////////

var PSTimer = $("#prumer-z-peti-slozeni .timer")
var PSObnovit = $("#prumer-z-peti-slozeni .obnovit")
var PSStart = $("#prumer-z-peti-slozeni .start")
var PSStop = $("#prumer-z-peti-slozeni .stop")
var PSDalsi = $("#prumer-z-peti-slozeni .dalsi")
var PSTimes = $("#prumer-z-peti-slozeni .times")
var PSResults = []
var PSStatus = 0

function initPetSlozeni()
{
	PSStatus = 0
	PSTimer.html("00:00:000")
	PSTimes.empty()
	PSObnovit.hide()
	PSStop.hide()
	PSDalsi.hide()
	PSTimes.hide()
	PSResults = []
}

initPetSlozeni()

function fPSStart() {
	PSStatus = 1
	reset()
	start()
	PSStart.hide()
	PSObnovit.show()
	PSStop.show()
	prependFullScreenButton()
}

function fPSStop() {
	PSStatus = 2
	stop()
	update()
	PSStop.hide()
	PSResults.push(x.time())
	PSShowResults()
	removeFullScreenButton()

	if (PSResults.length < 5) {
		PSDalsi.show()
	}
}

function fPSObnovit() {
	generateScrambleAndApplyToHtml(ctype)
	PSStatus = 0
	reset()
	PSResults = []
	PSObnovit.hide()
	PSDalsi.hide()
	PSStop.hide()
	PSTimes.hide()
	PSTimes.empty()
	PSStart.show()
}

function fPSDalsi() {
	generateScrambleAndApplyToHtml(ctype)
	PSStatus = 3
	reset()
	PSDalsi.hide()
	PSStart.show()
}

function PSShowResults() {
	var resultsCount = PSResults.length
	if (resultsCount == 0 ) {
		return
	}
	PSTimes.show()
	PSTimes.empty()
	var min = Math.min.apply(null, PSResults),
		max = Math.max.apply(null, PSResults);
	var average = 0;
	var countForAverage = 0
	for (var i = 0; i < resultsCount; i++) {
		var item = $("<li>" + formatTime(PSResults[i]) + "</li>")
		if (PSResults[i] == min) {
			item.addClass("best-time")
		} else if (PSResults[i] == max) {
			item.addClass("worst-time")
		} else {
			average += PSResults[i]
			countForAverage++
		}
		PSTimes.append(item)
	}
	if (resultsCount == 5) {
		average = Math.ceil(average / countForAverage)
		var item = $("<li>" + formatTime(average) + "</li>")
		item.addClass("score")
		PSTimes.append(item)
	}
}

PSStart.click(fPSStart)
PSStop.click(fPSStop)
PSObnovit.click(fPSObnovit)
PSDalsi.click(fPSDalsi)



////////////////////////
// SCRAMLE
////////////////////////

function scrambleToHtml(input)
{
	input = input.trim()
	var options = input.split(" ")
	$(".scramble li[class!='refresh']").remove()
	for (var i = 0; i < options.length; i++) {
		var item = options[i];
		if (item == "") {
			continue;
		}
		$(".scramble").prepend("<li>" + item + "</li>")
	}
}

$(".scramble li[class!='refresh']").remove()

////////////////////////
// SPACEBAR
////////////////////////

window.onkeydown = function(e) {
	if (e.keyCode == 32 //&& e.target == document.body
	 ) {
		e.preventDefault();
		if (mode == "JS") {
			if (JSStatus == 0) {
				fJSStart()
			} else if (JSStatus == 1) {
				fJSStop()
			} else if (JSStatus == 2) {
				fJSObnovit()
			}
		} else if (mode == "PS") {
			if (PSStatus == 0) {
				fPSStart()
			} else if (PSStatus == 1) {
				fPSStop()
			} else if (PSStatus == 2) {
				if (PSResults.length < 5) {
					fPSDalsi()
				} else {
					fPSObnovit()
				}
			} else if (PSStatus == 3) {
				fPSStart()
			}
		}
	}
};

////////////////////////
//
////////////////////////


function generateScrambleAndApplyToHtml(type) {
	ctype = type
	initvariables()
	var result = doScramble()
	scrambleToHtml(result)
}

function reinit()
{
	if (mode == "JS") {
		initJednoSlozeni()
	} else if (mode == "PS") {
		initPetSlozeni()
	}
}

function removeActiveInMenu()
{
	$(".sidebar .cubes li").each(function(){
		$(this).removeClass("active")
	})
}

function handleMenuLink(cubeType, element)
{
	removeActiveInMenu()
	element.addClass("active")
	reinit()
	generateScrambleAndApplyToHtml(cubeType)
}

$(".sidebar .cubes .cube-01").click(function() {
	handleMenuLink(1, $(this))
})

$(".sidebar .cubes .cube-02").click(function() {
	handleMenuLink(2, $(this))
})

$(".sidebar .cubes .cube-03").click(function() {
	handleMenuLink(3, $(this))
})

$(".sidebar .cubes .cube-04").click(function() {
	handleMenuLink(4, $(this))
})

$(".sidebar .cubes .cube-05").click(function() {
	handleMenuLink(5, $(this))
})

$(".sidebar .cubes .cube-06").click(function() {
	handleMenuLink(14, $(this))
})

$(".sidebar .cubes .cube-07").click(function() {
	handleMenuLink(15, $(this))
})

$(".sidebar .cubes .cube-08").click(function() {
	handleMenuLink(11, $(this))
})

$(".sidebar .cubes .cube-01").trigger("click")