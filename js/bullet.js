
var bulletSpeed = 12000;

var FACTION =  
Object.seal({
	PLAYER:0,
	ENEMY:1	
});

function Bullet(factionID, x, y, ax, ay) 
{
	this.id = factionID;
	this.movable = new Movable(x,y,10);
	this.movable.accel.x = ax * bulletSpeed;
	this.movable.accel.y = ay * bulletSpeed;
	this.collider = new BoundingBox(new Vector(x,y),new Vector(5,5));
	this.animation = new Animation(x,y,10);
	
	this.active = true;

	this.update = function(dt)
	{
		//  Movable updating
		this.movable.update(dt);
		this.collider.update(this.movable.pos.sub(this.collider.dims));

		//  Animation updating
		this.animation.worldX = this.movable.pos.x;
		this.animation.worldY = this.movable.pos.y;

		this.animation.update(dt);
	};

    this.render = function(ctx,cx,cy)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.pos.x - cx + (ctx.canvas.width/2);
        var sy = this.movable.pos.y - cy + (ctx.canvas.height/2);
        
        ctx.save();
        
        ctx.fillstyle = "black";
        ctx.fillRect(sx-this.collider.dims.x,sy-this.collider.dims.y / 2
		,this.collider.dims.x,this.collider.dims.y);

        ctx.restore();
    };
}