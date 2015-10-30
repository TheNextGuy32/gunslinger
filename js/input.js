//  Keyboard input
var keys = {};
var oldKeys = {};
addEventListener("keydown", function (e) 
{
	//...why are we doing it this way???
	//what's wrong with a simple flip?
	if(!keys.hasOwnProperty(e.keyCode))
	{
		 // The key is newly down!
    	keys[e.keyCode] = true;
		
		//And now a few lines for things we want to happen on initial keypress frame only.
		
		switch(e.keyCode)
		{
		case 73:	//I
			debugMode = !debugMode;
			break;
		case 75:	//K
			resetGame();
			break;
		
		case 80:	//Esc
		case 27:	//P
			gamePaused = !gamePaused;
			if(gamePaused)
			{
				pauseGame();
			}
			else
			{
				resumeGame();
			}
			break;
		case 82:	//R
			playEffect(2);
			bulletsLeft = bulletsPerClip;
			player.canShoot = false;
			player.shootTimer = -0.6;
			break;
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
	if(!gameStart || gameEnd) {
		startGame();
		if(gameEnd)
		{
			bgAudio.currentTime = 0;
		}
		return;
	}
	if(player.canShoot)
	{
		if(bulletsLeft > 0)
		{
			playEffect(0);
			player.fireBullet();
			bulletsLeft --;
		}
	}
});

addEventListener("mousemove",function(e) {
	var mouse = new Vector(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
	var delta = new Vector(0, 0);

	delta.x = mouse.x - worldToScreen(player.movable.pos.x,camX,ctx.canvas.width);
	//delta.x = player.facing*Math.abs(delta.x);
	
	delta.y = mouse.y - worldToScreen(player.movable.pos.y,camY,ctx.canvas.height);
	
	//console.log(mouse.x + "," + mouse.y + "; " + player.movable.px + "," + player.movable.py);
	player.gunDir = delta;
});

function input()
{
//	//Debug level-reset key: I
//	if(keys[73])
//	{
//		resetLevel();
//	}
	if ( keys [87] && !oldKeys[87] ) {    //W

		for (var c =0 ; c < cover.length; c++) {
			if(player.collider.intersects(cover[c].collider))
			{
				playEffect(1);
				
				if(player.movable.pos.x <= cover[c].xPos)
				{
					cover[c].alterTableState(Math.PI / 2);
				}
				else
				{
					cover[c].alterTableState(-Math.PI / 2);
				}
				break;
			}

		}
	}
	
	if ( keys [83] ) {    //S
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
			player.facing = FACING.RIGHT;
			player.movement = MOVEMENT.WALKING;
		}

		else if ( keys[65] ) {    //Aa
			player.facing = FACING.LEFT;
			player.movement = MOVEMENT.WALKING;
		}
		
		
		if ( keys [16] ) {    //Shift
			if(player.movement == MOVEMENT.WALKING)
			{
				player.movement = MOVEMENT.RUNNING;
			}
		}

	}
}