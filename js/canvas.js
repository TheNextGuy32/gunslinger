'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var choochoo = new Train(-70, 10, 1250, 500);
var aestheticLeftCar = new Train(-1340, 10, 1250, 500);
var aestheticRightCar = new Train(1200, 10, 1250, 500);
var player = new Person(10,-75 + 10); //Does changing the y value actually do anything?
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
				if(player.collider.intersects(bullets[b].collider))
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
						if(enemies[e].collider.intersects(bullets[b].collider))
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
				if(cover[c].collider.intersects(bullets[b].collider))
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
		if(bullets[i].active) 
			bullets[i].update(dt);
	};//is there a reason we work backwards here, but not for the other one?

	for(var e = 0 ; e < enemies.length; e++){
		if(enemies[e].active) 
			enemies[e].update(dt);
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
	player.movable.pos = new Vector(10, -75 + 10);
	cover = new Array();
	enemies = new Array();
	
	//Fill arrays - should be changed to be more level-specific in the future
	var coverWidth = 80, coverHeight = 60;
	cover.push(new Cover(800,-coverHeight / 2 + 10,coverWidth,coverHeight,20,10));
	cover.push(new Cover(400,-coverHeight / 2 + 10,coverWidth,coverHeight,20,10));
	cover.push(new Cover(100,-coverHeight / 2 + 10,coverWidth,coverHeight,20,10));
	enemies.push(new Enemy(400,-75 + 10));
	enemies.push(new Enemy(450,-75 + 10));
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
