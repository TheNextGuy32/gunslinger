var FACING =  
{
	LEFT:-1,
	RIGHT:1	
}

var MOVEMENT =  
{
	STANDING:0,
	WALKING: 1,
	RUNNING: 2,
	SLIDING: 3,
	CROUCHING: 4
}

var walkSpeed = 200;
var runSpeed = 300;

function Person(x, y, collisionRadius) 
{
	this.movable = new Movable(x,y,10);
	this.animation = new Animation(x,y,10);

	this.facing = FACING.LEFT;
	this.movement = MOVEMENT.STANDING;

	this.canShoot = true;
	this.shootCooldown = 1;
	this.shootTimer = 0;
	this.firing = false;
	
	this.fillStyle = "black";

	this.r = collisionRadius;

	this.updateShoot = function(dt) {
		if(!this.canShoot){
			this.shootTimer += dt;
			if(this.shootTimer > this.shootCooldown)
			{
				this.canShoot = true;
				this.shootTimer = 0;
			}
		}
	}
	
	this.update = function(dt)
	{
		this.updateShoot(dt);

		//  Movable updating
		var velocity = 0;
		if(this.movement == MOVEMENT.WALKING || this.movement == MOVEMENT.SLIDING )
		{
			velocity = walkSpeed;			
		}
		else if(this.movement == MOVEMENT.RUNNING)
		{
			velocity = runSpeed;
		}
		if(this.facing == FACING.LEFT)
		{
			velocity = -velocity;
		}
		this.movable.vx = velocity;

		this.movable.update(dt);

		//  Animation updating
		this.animation.worldX = this.movable.px;
		this.animation.worldY = this.movable.py;

		this.animation.update(dt);
	};

	this.getCollisionRectangle = function()
	{
		if(this.movement != MOVEMENT.CROUCHING){
	        return {
	        	x:this.movable.px-25,
	        	y:this.movable.py-50,
	        	w:50,
	        	h:50};
	    }
	    else
	    {
	    	return {
	        	x:this.movable.px-25,
	        	y:this.movable.py-25,
	        	w:50,
	        	h:50};
	    }
	}

    this.render = function(ctx,cx,cy)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = worldToScreen(this.movable.px,cx,ctx.canvas.width);
        var sy = worldToScreen(this.movable.py,cy,ctx.canvas.height);
        
        ctx.save();
        
        ctx.fillStyle = this.fillStyle;
        if(this.movement != MOVEMENT.CROUCHING){
	        ctx.fillRect(sx-25,sy-50,50,50);
	    }
	    else
	    {
	    	ctx.fillRect(sx-25,sy-25,50,25);
	    }

        ctx.restore();
    };
}