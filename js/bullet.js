

var bulletSpeed = 500;

function Bullet(factionID, x, y, collisionRadius) 
{
	this.id = factionID;
	this.movable = new Movable(x,y,10);
	this.animation = new Animation(x,y,10);

	this.facing = FACING.LEFT;

	this.update = function(dt)
	{
		//  Movable updating
		var velocity = bulletSpeed;
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
        ctx.fillRect(sx-2.5,sy-2.5,5,5);


        ctx.restore();
    };
}