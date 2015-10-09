
var bulletSpeed = 12000;

function Bullet(factionID, x, y, ax, ay, collisionRadius) 
{
	this.id = factionID;
	this.movable = new Movable(x,y,10);
	this.movable.accel.x = ax * bulletSpeed;
	this.movable.accel.y = ay * bulletSpeed;
	this.animation = new Animation(x,y,10);
	
	this.r = collisionRadius;

	this.update = function(dt)
	{
		//  Movable updating

		this.movable.update(dt);

		//  Animation updating
		this.animation.worldX = this.movable.pos.x;
		this.animation.worldY = this.movable.pos.y;

		this.animation.update(dt);
	};

	this.getCollisionRectangle = function()
	{
		return {
	        	x:this.movable.pos.x-2.5,
	        	y:this.movable.pos.y-2.5,
	        	w:5,
	        	h:5};
	}

    this.render = function(ctx,cx,cy)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.pos.x - cx + (ctx.canvas.width/2);
        var sy = this.movable.pos.y - cy + (ctx.canvas.height/2);
        
        ctx.save();
        
        ctx.fillstyle = "black";
        ctx.fillRect(sx-2.5,sy-2.5,5,5);

        ctx.restore();
    };
}