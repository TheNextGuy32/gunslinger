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

addEventListener("mousedown",function(e) {
	if(player.canShoot){
		//advising helper function(s?) to convert between world and screen space
		//to make mouse interaction simpler
		//I have added one
		//good job me
		//tbd
		var bulletVel = player.gunDir.copy();
		bulletVel.setMag(500);
		
		var bulletStart = bulletVel.copy();
		bulletStart.setMag(25);
		bulletStart.y -= 25;
		//console.log(mouse.x + "," + mouse.y + "; " + player.movable.px + "," + player.movable.py);
		var b = new Bullet(0,player.movable.pos.x+bulletStart.x,player.movable.pos.y+bulletStart.y,bulletVel.x,bulletVel.y,30);
		b.id = FACTION.PLAYER;
		bullets.push(b);
		player.canShoot = false;
		player.firing = true;
	}
});

addEventListener("mousemove",function(e) {
	var mouse = new Vector(0, 0);
	var delta = new Vector(0, 0);
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	delta.x = mouse.x - worldToScreen(player.movable.pos.x,camX,ctx.canvas.width);
	delta.x = player.facing*Math.abs(delta.x);
	delta.y = mouse.y - worldToScreen(player.movable.pos.y-35,camY,ctx.canvas.height);
	//console.log(mouse.x + "," + mouse.y + "; " + player.movable.px + "," + player.movable.py);
	player.gunDir = delta;
});

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

	
		/*if ( keys [32] ) {    //Space
			//console.log('Space');
			// Bullet
			if(player.canShoot){
				var b = new Bullet(0,player.movable.px,player.movable.py-35,30);
				b.facing = player.facing;
				bullets.push(b);
				player.canShoot = false;
			}

		}*/
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

var enemies = new Array();
 enemies.push(new Enemy(400,10,50));
// enemies.push(new Enemy(450,10,50));
enemies.push(new Enemy(450,10,50));

var bullets = new Array();

var lastTime = (+new Date);

var camX = 0;
var camY = 0;

function init() {
	animFrame( recursiveAnim );
}

function doRectanglesOverlap(r1, r2)
{
	return !(r2.x > r1.x + r1.w || 
           r2.x+r2.w < r1.x || 
           r2.y > r1.y + r1.h ||
           r2.y + r2.h < r1.y);
}

function update() {
	//Calculating dt
	var now,fps, dt;
	now = (+new Date); 
	fps = 1000 / (now - lastTime);
	lastTime = now; 
	dt = 1/fps;
	
	var currentBulletDestroyed;
	for (var b = 0; b < bullets.length ; b++)
	{
		currentBulletDestroyed = false;
		if(bullets[b].movable.pos.x < -trainWidth || 
		bullets[b].movable.pos.x > trainWidth * 2 ||
		bullets[b].movable.pos.y < -trainHeight ||
		bullets[b].movable.pos.y > trainHeight * 2) {
			bullets.splice(b,1);//non optimal, we should probably have recycled bullets
			b--;
			continue;
		}
		if(bullets[b].id == FACTION.ENEMY){
			//  Enemy killing player
			if(doRectanglesOverlap(bullets[b].getCollisionRectangle(),player.getCollisionRectangle()))
			{
				//Player is on godmode.
				bullets.splice(b, 1);
				continue;
				//console.log("Player");
			}
		}
		else{
			//  Player killing enemy
			// for loop through enemies
			for(var e = 0 ; e < enemies.length ; e++)
			{
				if(doRectanglesOverlap(bullets[b].getCollisionRectangle(),enemies[e].getCollisionRectangle()))
				{
					console.log("Enemy");
					enemies.splice(e, 1);
					bullets.splice(b, 1);
					currentBulletDestroyed = true;
					break;
				}
			}
		}
		if(currentBulletDestroyed)
		{
			continue;
		}

		
		//  Colliding with cover
		for (var c =0 ; c < cover.length; c++) {
			if(doRectanglesOverlap(bullets[b].getCollisionRectangle(),cover[c].getCollisionRectangle()))
				{
					//console.log("cover");
				}
		};
	};

	input();
	player.update(dt);
	player.movable.pos.x = Math.max(-15, Math.min(935, player.movable.pos.x));

	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].update(dt);
	};

	for(var e = 0 ; e < enemies.length; e++){
		enemies[e].update(dt);
	}

	oldKeys = $.extend( {}, keys );
}

var trainWidth = 1000;
var trainHeight = 200;

function drawTrain(x,y,cx,cy)
{
	var wheelRadius = 20;
	var wheelSpacing = 300;
	var sx = x - cx + (ctx.canvas.width/2);
    var sy = y - cy + (ctx.canvas.height/2);

	ctx.save();
	
	//Train Car (Brown Background)
	var trainBackgroundGradient = ctx.createLinearGradient(sx, sy-trainHeight, sx, sy);
	trainBackgroundGradient.addColorStop(0, "#2b1d0e");
	trainBackgroundGradient.addColorStop(1, "#8b5d2e");
	ctx.fillStyle = trainBackgroundGradient;
	ctx.fillRect(sx,sy-200,1000,200);
	
	//Train Wheels
	var trainWheelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, wheelRadius);
	trainWheelGradient.addColorStop(0, "#333333");
	trainWheelGradient.addColorStop(1, "#000000");
	ctx.fillStyle = trainWheelGradient;
	ctx.save();
	ctx.translate(sx+wheelRadius, sy+wheelRadius);
	for(var i = wheelRadius; i < trainWidth; i += wheelSpacing)
	{
		ctx.beginPath();
		ctx.arc(0, 0, wheelRadius, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
		ctx.translate(wheelSpacing, 0);
	}
	ctx.restore();

	//Train Rail
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, sy+wheelRadius*1.9, ctx.canvas.width, 5);
	ctx.restore();
}

function worldToScreen(coord,camCoord,ctxDim) {
	//sloppy and one dimensional for now, will refine after revamp to object "vectors"
	return coord - camCoord + ctxDim / 2;
}

function draw() {
	
	ctx.save();
	ctx.fillStyle = 'gray';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();

	camX = player.movable.pos.x;
	camY = player.movable.pos.y;
	
	drawTrain(-40,10,camX,camY);
	
	player.render(ctx,camX,camY);
	
	for(var e = 0 ; e < enemies.length; e++){
		enemies[e].render(ctx,camX,camY);
	}
	
	for (var i = cover.length - 1; i >= 0; i--) {
		cover[i].render(ctx,camX,camY);
	};
	
	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].render(ctx,camX,camY);
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
