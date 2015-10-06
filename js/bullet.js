

var bulletSpeed = 500;

function Bullet(factionID, x, y, vx, vy, collisionRadius) 
{
	this.id = factionID;
	this.movable = new Movable(x,y,10);
	this.movable.vx = vx;
	this.movable.vy = vy;
	this.animation = new Animation(x,y,10);
	
	this.r = collisionRadius;

	this.update = function(dt)
	{
		//  Movable updating

		this.movable.update(dt);

		//  Animation updating
		this.animation.worldX = this.movable.px;
		this.animation.worldY = this.movable.py;

		this.animation.update(dt);
	};

	this.getCollisionRectangle = function()
	{
		return {
	        	x:this.movable.px-2.5,
	        	y:this.movable.py-2.5,
	        	w:5,
	        	h:5};
	}

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