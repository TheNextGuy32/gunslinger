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
	if ( keys [83] ) {    //S
		//console.log('S');
		//Slide
		player.movement = MOVEMENT.CROUCHING;
	}

	else {

		if((keys[68] && keys[65]) || (!keys[68] && !keys[65]) )
		{
			//  Do nothing when pushing both diretions
			player.movement = MOVEMENT.STANDING;
		}
		else if (keys[68] ) {   // D
			//console.log('D');
			player.facing = FACING.RIGHT;
			player.movement = MOVEMENT.WALKING;
		}

		else if ( keys[65] ) {    //A
			//console.log('A');
			player.facing = FACING.LEFT;
			player.movement = MOVEMENT.WALKING;
		}

	
		if ( keys [32] ) {    //Space
			//console.log('Space');
			// Bullet
			if(player.canShoot){
				var b = new Bullet(0,player.movable.px,player.movable.py-35,30);
				b.facing = player.facing;
				bullets.push(b);
				player.canShoot = false;
			}

		}
		if ( keys [16] ) {    //Shift
			//console.log('Shift');
			//  Run
		}
	}


}

var player = new Person(10,10,50);

var cover = new Array();
cover.push(new Cover(200,10,30,30,40));//xPos, yPos, width, height, collisionRadius
cover.push(new Cover(500,10,30,80,40));

var bullets = new Array();

var lastTime = (+new Date);

var camX = 0;
var camY = 0;

function init() {

	animFrame( recursiveAnim );
}

function update() {
	//Calculating dt
	var now,fps, dt;
	now = (+new Date); 
	fps = 1000 / (now - lastTime);
	lastTime = now; 
	dt = 1/fps;
	
	
	// for (var i = bullets.length - 1; i >= 0; i--) {
	// 	if(bullets[i].id == 1){
	// 		//  Enemy killing player
	// 		if(Math.abs(bullets[i].x - player.x) < (bullets[i].r/2) + (player.r/2))
	// 		{
	// 			console.log("Player!");
	// 		}
	// 	}
	// 	else{
	// 		//  Player killing enemy
	// 		// for loop through enemies
	// 	}

	// 	//  Colliding with cover
	// 	for (var c =0 ; c < cover.length; c++) {
	// 		if(Math.abs(bullets[i].x - cover[q].x) < 
	// 			(bullets[i].r/2) + (cover[q].r/2))
	// 		{
	// 			console.log("cOVER!");
	// 		}
	// 	};
	// };

	input();
	player.update(dt);

	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].update(dt);
	};

	oldKeys = $.extend( {}, keys );
}
function drawTrain(x,y,cx,cy)
{
	var sx = x - cx + (ctx.canvas.width/2);
    var sy = y - cy + (ctx.canvas.height/2);

	ctx.save();

	ctx.fillStyle = "white";
	ctx.fillRect(sx,sy-200,1000,200);

	ctx.restore();
}
function draw() {
	
	ctx.save();
	ctx.fillStyle = 'gray';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();

	camX = player.movable.px;
	camY = player.movable.py;
	
	drawTrain(-40,10,camX,camY);

	player.render(ctx,camX,camY);

	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].render(ctx,camX,camY);
	};
	
	for (var i = cover.length - 1; i >= 0; i--) {
		cover[i].render(ctx,camX,camY);
	};
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
