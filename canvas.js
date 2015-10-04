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
		//console.log('W');
	}

	if((keys[68] && keys[65]) || (!keys[68] && !keys[65]) )
	{
		//  Do nothing when pushing both diretions
		environment.getPlayer().movement = MOVEMENT.STANDING;
	}
	else if (keys[68] ) {   // D
		//console.log('D');
		environment.getPlayer().facing = FACING.RIGHT;
		environment.getPlayer().movement = MOVEMENT.WALKING;
	}

	else if ( keys[65] ) {    //A
		//console.log('A');
		environment.getPlayer().facing = FACING.LEFT;
		environment.getPlayer().movement = MOVEMENT.WALKING;
	}
	if ( keys [83] ) {    //S
		//console.log('S');
	}
}

var environment = new Environment(ctx.canvas.width, ctx.canvas.height);
var camX = 0;
var camY = 0;

function init() {
	//  Initialization code
	
	var player = new Person(10,10,50);
	environment.init(player);
	
	animFrame( recursiveAnim );
}

function update() {
	
	//  Update code
	// for(var t  = 0 ; t < things.length; t++)
	// {
	// 	things[t].accelerationX = 0;
	// 	things[t].accelerationY = 0;

	// 	//  Handle velocity

	// 	//  Handle position
	// }

	input();
	environment.update(0.025);
//	player.update(0.025);

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

	camX = environment.getPlayer().movable.px;
	//camY = player.movable.py;
	environment.render(ctx, camX, camY);
//	player.render(ctx,camX,camY);
	
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
