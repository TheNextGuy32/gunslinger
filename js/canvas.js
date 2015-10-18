'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var choochoo = new Train(-70, 10, 1250, 500);
var aestheticLeftCar = new Train(-1340, 10, 1250, 500);
var aestheticRightCar = new Train(1200, 10, 1250, 500);
var player = new Person(10,-75 + 10);
var cover = new Array();
var enemies = new Array();
var bullets = new Array();
var currentCarNum = 0;
var minCarNum = 0;
var maxCarNum = 10;

var lastTime = (+new Date);
var gamePaused = false;
var gameStart = false;
var gameEnd = false;
var game = setTimeout(update,1000/30);
var camX = 0;
var camY = 0;
var now,fps, dt;

var bulletsLeft = 6;
var bulletsPerClip = 6;
var hearts = 3;
var invincibilityDuration = 1;
var invincibilityTimer = 0;
var invincible = false;

function init() {
	animFrame( recursiveAnim );
	resetLevel();
}

function update() {
	if(gamePaused == true || gameStart == false || gameEnd == true)
	{
		return;
	}
	
	//Calculating dt
	now = (+new Date); 
	fps = 1000 / (now - lastTime);
	lastTime = now; 
	dt = 1/fps;
	
	for (var b = 0; b < bullets.length ; b++)
	{
		if(bullets[b].active){
			if(bullets[b].id == FACTION.ENEMY){
				
				if(!invincible)
				{
					//  Enemy killing player
					if(player.collider.intersects(bullets[b].collider))
					{
						var recoil = 5;
						if(bullets[b].movable.vel.x < 0) recoil = -recoil;

						if(hearts>0) hearts--;
						//Initiate invinceibility!
						invincible = true;

						if(hearts == 0)
						{
							gameEnd = true;
							hearts = 3;
							
						}

						player.movable.pos.x += recoil;
						bullets[b].active = false;
					}
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
			
			
			if(!choochoo.collider.intersects(bullets[b].collider))
			{
				bullets[b].active = false;
				continue;
			}
		}
	};

	input();
	player.update(dt);
	if(invincible) {
		invincibilityTimer+= dt;
		if(invincibilityTimer > invincibilityDuration)
		{
			invincibilityTimer = 0;	
			invincible = false;	
		}
	}
//	player.movable.pos.x = Math.max(-32, Math.min(1142, player.movable.pos.x));
	if(player.movable.pos.x <= (currentCarNum > minCarNum ? -128 : -15))
	{
		if(currentCarNum > minCarNum)
		{
			player.movable.pos.x += 1270;
			currentCarNum --;
			resetLevel();
		}
		else
		{
			player.movable.pos.x = -15;
		}
	}
	else if(player.movable.pos.x >= (currentCarNum < maxCarNum ? 1238 : 1120))
	{
		if(currentCarNum < maxCarNum)
		{
			player.movable.pos.x -= 1270;
			currentCarNum ++;
			resetLevel();
		}
		else
		{
			player.movable.pos.x = 1120;
		}
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

function drawUI (){
	ctx.save();
	if(!invincible) ctx.fillStyle = "red";
	else ctx.fillStyle = "blue";
	var heartWidth = 50;
	var heartHeight = 60;
	var heartMargin = 30;
	for(var h = 0 ; h < hearts ; h++){
		ctx.fillRect( 50 + (heartMargin*h) + (heartWidth*h), 30, heartWidth, heartHeight);
	}
	ctx.restore();

	ctx.save();
	var bulletWidth = 15;
	var bulletHeight = 30;
	var bulletMargin = 30;
	for(var h = 0 ; h < bulletsLeft ; h++){
		ctx.fillStyle = "black";
		ctx.fillRect( 50 + (bulletMargin*h) + (bulletWidth*h) + 3, 30 + heartHeight + 20 + 3, bulletWidth, bulletHeight);
		ctx.fillStyle = "#333333";
		ctx.fillRect( 50 + (bulletMargin*h) + (bulletWidth*h), 30 + heartHeight + 20, bulletWidth, bulletHeight);
	}
	ctx.restore();	
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
	if(currentCarNum > minCarNum)
	{
		aestheticLeftCar.render(ctx, camX, camY);
	}
	if(currentCarNum < maxCarNum)
	{
		aestheticRightCar.render(ctx, camX, camY);
	}
	
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

	drawUI();
}
function pauseGame() {
		//pausedGame = true;
		gamePaused = true;
		cancelAnimationFrame(recursiveAnim);
		//update();
  } 
  
function resumeGame(){
		//cancelAnimationFrame(this.animationID);
		gamePaused = false;
		update();
		recursiveAnim();
		//this.sound.playBGAudio();
	}
function startGame(){
		gameEnd = false;
		gameStart = true;
		update();
		recursiveAnim();
		//console.log("start game");
		resetGame();
	}
function endScreen(){
		gameEnd = true;
		cancelAnimationFrame(recursiveAnim());
		//update();
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
		fillText("Click to Resume",canvas.width/2,canvas.height/2,"40pt courier","white");
		ctx.restore();
	}
function drawStartScreen(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.globalAlpha = 0.75;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		fillText("Click Anywhere to Begin",canvas.width/2,canvas.height/2,"40pt courier","white");
		fillText("You Can Read How to Play Below this Game Window",canvas.width/2,canvas.height/2 + 80,"20pt courier","white");
		ctx.restore();
}
function drawEndScreen(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.globalAlpha = 0.75;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		fillText("Lost all Hearts",canvas.width/2,canvas.height/2,"40pt courier","red");
		fillText ("You made it through " + currentCarNum +  " rooms",canvas.width/2, canvas.height/2 + 60, "30pt Courier","white");
		fillText("Click Anywhere to Play Again",canvas.width/2,canvas.height/2 + 120,"20pt courier","white");
		ctx.restore();
}
function resetLevel()
{
	//Reset bullets and player, create new arrays for cover & enemies
	for (var b = 0; b < bullets.length ; b++)
	{
		bullets[b].active = false;
	}
	cover = new Array();
	enemies = new Array();
	
	//Fill arrays - should be changed to be more level-specific in the future

	var coverWidth = 80, coverHeight = 60;
	for(var i = Math.random()*4+1; i > 0; i --)
	{
		var xPos, posIsAcceptable;
		do
		{
			posIsAcceptable = true;
			xPos = Math.random()*900+100;
			console.log(xPos);
			for(var c = 0; c < cover.length; c++)
			{
				if(Math.abs(cover[c].xPos-xPos) < coverWidth+5)
				{
					posIsAcceptable = false;
				}
			}
		}while(!posIsAcceptable);
		cover.push(new Cover(xPos,-coverHeight/2+10,coverWidth,coverHeight,20,10));
	}
	for(var i = Math.random()*3; i > 0; i--)
	{
		var temp = new Enemy(0, -75+10);
		temp.movable.pos.x = player.movable.pos.x + Math.random()*500+500;
		if(temp.movable.pos.x <= -128)
		{
			temp.movable.pos.x += 1270;
		}
		else if(temp.movable.pos.x >= 1238)
		{
			temp.movable.pos.x -= 1270;
		}
		enemies.push(temp);
	}
}
function resetGame()
{
	player.movable.pos.x = 10;
	currentCarNum = 0;
	hearts = 3;
	bulletsLeft = bulletsPerClip;
	resetLevel();
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

	if(gameEnd){
		drawEndScreen(ctx);
		return;
	}
	if(gamePaused){
		drawPauseScreen(ctx);
		return;
	}
	if(gameStart == false){
		drawStartScreen(ctx);
		return;
	}update();
	//ctx.globalAlpha = 1.0;
    draw();
    animFrame( recursiveAnim );
};
