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

	if ( keys [87] && !oldKeys[87] ) {    //W

		for (var c =0 ; c < cover.length; c++) {
			if(doRectanglesOverlap(
				player.getCollisionRectangle(),
				cover[c].getPlayerCollisionRectangle()))
			{
				console.log("Was " + cover[c].tableStatus);
				console.log(player.getCollisionRectangle());
				console.log(cover[c].getPlayerCollisionRectangle());
				
				if(player.movable.pos.x <= cover[c].xPos)
				{
					cover[c].alterTableStatus(1);
				}
				else
				{
					cover[c].alterTableStatus(-1);
				}
				console.log("Now " + cover[c].tableStatus);
				console.log("- - -");
				break;
			}

		};
	}

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

		else if ( keys[65] ) {    //Aa
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
		if ( keys [80] ) {    //p
			if(gamePaused == true){
			gamePaused = false;
			resumeGame();
			console.log('Resume');
			}
			else if(gamePaused == false){
			console.log('Pause');
			gamePaused = true;
			pauseGame();
			draw
			}
		}
	}


}

var player = new Person(10,10,50);

var cover = new Array();
cover.push(new Cover(400,10,40,30,10,5));
cover.push(new Cover(250,10,40,30,10,5));
cover.push(new Cover(100,10,40,30,10,5));

var enemies = new Array();
 enemies.push(new Enemy(400,10,50));
// enemies.push(new Enemy(450,10,50));
enemies.push(new Enemy(450,10,50));

var bullets = new Array();

var lastTime = (+new Date);
var gamePaused = false;
var game = setTimeout(update,1000/30);
var camX = 0;
var camY = 0;
var now,fps, dt;
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

	now = (+new Date); 
	fps = 1000 / (now - lastTime);
	lastTime = now; 
	dt = 1/fps;

	for (var b = 0; b < bullets.length ; b++)
	{
		if(bullets[b].active){
			//  If its going off the map
			if(	bullets[b].movable.pos.x < -trainWidth 		|| 
				bullets[b].movable.pos.x > trainWidth  * 2 	||
				bullets[b].movable.pos.y < -trainHeight 	||
				bullets[b].movable.pos.y > trainHeight * 2) 
			{
				bullets[b].active = false;
				continue;
			}
			
			if(bullets[b].id == FACTION.ENEMY){
				
				//  Enemy killing player
				if(doRectanglesOverlap(
					bullets[b].getCollisionRectangle(),
					player.getCollisionRectangle()))
				{
					bullets[b].active = false;
				}
			}
			else
			{
				//  Player bullet
				for(var e = 0 ; e < enemies.length ; e++)
				{
					if(doRectanglesOverlap(
						bullets[b].getCollisionRectangle(),
						enemies[e].getCollisionRectangle()))
					{
						enemies[e].active = false;
						bullets[b].active = false;
						break;
					}
				};
			}

			//  Colliding with cover
			for (var c =0 ; c < cover.length; c++) 
			{	
				if(doRectanglesOverlap(
					bullets[b].getCollisionRectangle(),
					cover[c].getBulletCollisionRectangle()))
				{
					bullets[b].active = false;
				}
			};
		}
	};

	input();
	player.update(dt);
	player.movable.pos.x = Math.max(-15, Math.min(935, player.movable.pos.x));

	for (var i = bullets.length - 1; i >= 0; i--) {
		if(bullets[i].active) bullets[i].update(dt);
	};

	for(var e = 0 ; e < enemies.length; e++){
		if(enemies[e].active) enemies[e].update(dt);
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
	//ctx.globalAlpha = 0.25;
	ctx.save();
	ctx.fillStyle = 'gray';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();

	camX = player.movable.pos.x;
	camY = player.movable.pos.y;
	
	drawTrain(-40,10,camX,camY);
	
	player.render(ctx,camX,camY);
	
	for(var e = 0 ; e < enemies.length; e++){
		if(enemies[e].active)enemies[e].render(ctx,camX,camY);
	}
	
	for (var i = cover.length - 1; i >= 0; i--) {
		cover[i].render(ctx,camX,camY);
	};
	
	for (var i = bullets.length - 1; i >= 0; i--) {
		if(bullets[i].active) bullets[i].render(ctx,camX,camY);
	};
}
function pauseGame() {
		//pausedGame = true;
		gamePaused = true;
		cancelAnimationFrame(recursiveAnim);
		update();
  } 
function resumeGame(){
		//cancelAnimationFrame(this.animationID);
		gamePaused = false;
		//update();
		recursiveAnim();
		//this.sound.playBGAudio();
	}
function fillText(string, x, y, css, color) {
		ctx.save();
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	}
function drawPauseScreen(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		fillText("Click to Play",canvas.width/2,canvas.height/2,"40pt courier","white");
		ctx.restore();
		
	}
window.onblur = function(){
	console.log("blur at" + Date());
	pauseGame();
}
window.onfocus = function(){
	console.log("focus at" + Date());
	resumeGame();
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
	
	if(gamePaused){
		ctx.globalAlpha = 0.75;
		drawPauseScreen(ctx);
		return;
	}
	//ctx.globalAlpha = 1.0;
    draw();
    animFrame( recursiveAnim );
};
