'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

//  Keyboard input
var keys = {};
var oldKeys = {};
addEventListener("keydown", function (e) 
{
	if(!keys.hasOwnProperty(e.keyCode))
	{
		 // The key is newly down!
    	keys[e.keyCode] = true;
	}
}, false);

addEventListener("keyup", function (e) 
{
	if(keys.hasOwnProperty(e.keyCode))
	{
		 // The key is newly released!
    	delete keys[e.keyCode];
	}

}, false);

function input() {
	if ( keys[87] && !oldKeys[87]) {    //W
		console.log('W');
	}
	else if (keys[68] ) {   // D
		console.log('D');
	}

	else if ( keys[65] ) {    //A
		console.log('A');
	}
	if ( keys [83] ) {    //S
		console.log('S');
	}
}

var things = new Array();

var camX = 0;
var camY = 0;

function init() {

	//  Initialization code

	animFrame( recursiveAnim );
}

function update() {
	
	//  Update code
	for(var t  = 0 ; t < things.length; t++)
	{
		things[t].accelerationX = 0;
		things[t].accelerationY = 0;

		//  Handle velocity

		//  Handle position
	}

	input();

	//  Maintain camera
	//camX = cena.worldX;
	//camY = cena.worldY;
	oldKeys = $.extend( {}, keys );
}
function draw() {
	
	//  Draw code

	ctx.save();
	ctx.fillStyle = 'gray';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();
	
}





window.onload = init;
var animFrame = 
	window.requestAnimationFrame   			
    window.webkitRequestAnimationFrame    	
    window.mozRequestAnimationFrame    		
    window.oRequestAnimationFrame      		
    window.msRequestAnimationFrame     		
    null ;


var recursiveAnim = function() {
    update();
    draw();
    animFrame( recursiveAnim );
};
