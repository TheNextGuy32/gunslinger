var FACING =  
{
	LEFT:0,
	RIGHT:1	
}

var MOVEMENT =  
{
	STANDING:0,
	WALKING: 1,
	RUNNING: 2,
	SLIDING: 3
}

var walkSpeed = 50;
var runSpeed = 100;

function Person(x, y, collisionRadius) 
{
	this.movable = new Movable(x,y,10);
	this.animation = new Animation(x,y,10);

	this.facing = FACING.LEFT;
	this.movement = MOVEMENT.STANDING;

	this.update = function(dt)
	{
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

    this.render = function(ctx,cx,cy)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.px - cx + (ctx.canvas.width/2);
        var sy = this.movable.py - cy + (ctx.canvas.height/2);
        
        ctx.save();
        
        ctx.fillstyle = "black";
        ctx.fillRect(sx,sy,50,50);


        ctx.restore();
    };
}