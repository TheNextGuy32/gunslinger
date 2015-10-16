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
		
		if(e.keyCode == 27)
		{
			if(gamePaused)
			{
				resumeGame();
			}
			else
			{
				pauseGame();
			}
		}
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
	if(gamePaused) {
		resumeGame();
		return;
	}
	if(player.canShoot){
		player.fireBullet();
	}
});

addEventListener("mousemove",function(e) {
	var mouse = new Vector(0, 0);
	var delta = new Vector(0, 0);
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	delta.x = mouse.x - worldToScreen(player.movable.pos.x,camX,ctx.canvas.width);
	//delta.x = player.facing*Math.abs(delta.x);
	delta.y = mouse.y - worldToScreen(player.movable.pos.y-35,camY,ctx.canvas.height);
	//console.log(mouse.x + "," + mouse.y + "; " + player.movable.px + "," + player.movable.py);
	player.gunDir = delta;
});

function input()
{
	//Debug level-reset key: K
	if(keys[75])
	{
		resetLevel();
	}

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
		if ( keys [16] ) {    //Shift
			//console.log('Shift');
			//  Run
		}
	}


}

var choochoo = new Train(-70, 10, 1250, 500);
var aestheticLeftCar = new Train(-1340, 10, 1250, 500);
var aestheticRightCar = new Train(1200, 10, 1250, 500);
var player = new Person(10,10,50); //Does changing the y value actually do anything?
var cover = new Array();
var enemies = new Array();
var bullets = new Array();

var lastTime = (+new Date);
var gamePaused = false;
var game = setTimeout(update,1000/30);
var camX = 0;
var camY = 0;
var now,fps, dt;
function init() {
	animFrame( recursiveAnim );
	resetLevel();
}

function doRectanglesOverlap(r1, r2)
{
	return !(r2.x > r1.x + r1.w || 
           r2.x+r2.w < r1.x || 
           r2.y > r1.y + r1.h ||
           r2.y + r2.h < r1.y);
}

function update() {
	if(gamePaused)
		return;
	
	//Calculating dt
	now = (+new Date); 
	fps = 1000 / (now - lastTime);
	lastTime = now; 
	dt = 1/fps;
	
	for (var b = 0; b < bullets.length ; b++)
	{
		if(bullets[b].active){
			//  If its going off the map
			if(	bullets[b].movable.pos.x < -30	|| 
				bullets[b].movable.pos.x > 1135 	||
				bullets[b].movable.pos.y < -1*choochoo.height	||
				bullets[b].movable.pos.y > choochoo.height * 2) 
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
					var recoil = 5;
					if(bullets[b].movable.vel.x < 0) recoil = -recoil;

					player.movable.pos.x += recoil;
					bullets[b].active = false;
				}
			}
			else
			{
				//  Player bullet
				for(var e = 0 ; e < enemies.length ; e++)
				{
					if(enemies[e].active)
					{
						if(doRectanglesOverlap(
							bullets[b].getCollisionRectangle(),
							enemies[e].getCollisionRectangle()))
						{
							//temporary
							var recoil = -5;
							if(bullets[b].movable.vel.x < 0) recoil = -recoil;

							enemies[e].movable.pos.x += recoil;
							enemies[e].active = false;
							bullets[b].active = false;
							break;
						}
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
//	player.movable.pos.x = Math.max(-32, Math.min(1142, player.movable.pos.x));
	if(player.movable.pos.x <= -128)
	{
		player.movable.pos.x += 1270;
	}
	else if(player.movable.pos.x >= 1238)
	{
		player.movable.pos.x -= 1270;
	}

	for (var i = bullets.length - 1; i >= 0; i--) {
		if(bullets[i].active) bullets[i].update(dt);
	};

	for(var e = 0 ; e < enemies.length; e++){
		if(enemies[e].active) enemies[e].update(dt);
	}

	oldKeys = $.extend( {}, keys );
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
	camY = player.movable.pos.y-200;
	
	choochoo.render(ctx, camX, camY);
	aestheticLeftCar.render(ctx, camX, camY);
	aestheticRightCar.render(ctx, camX, camY);
	
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
		ctx.globalAlpha = 0.75;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		fillText("Click to Play",canvas.width/2,canvas.height/2,"40pt courier","white");
		ctx.restore();
		
	}
	
function resetLevel()
{
	//Reset bullets and player, create new arrays for cover & enemies
	for (var b = 0; b < bullets.length ; b++)
	{
		bullets[b].active = false;
	}
	player.movable.pos = new Vector(10, 10);
	cover = new Array();
	enemies = new Array();
	
	//Fill arrays - should be changed to be more level-specific in the future
	cover.push(new Cover(800,10,80,60,20,10));
	cover.push(new Cover(400,10,80,60,20,10));
	cover.push(new Cover(100,10,80,60,20,10));
	enemies.push(new Enemy(400,10,50));
	enemies.push(new Enemy(450,10,50));
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
		drawPauseScreen(ctx);
		return;
	}
	//ctx.globalAlpha = 1.0;
    draw();
    animFrame( recursiveAnim );
};
