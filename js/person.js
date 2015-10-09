var FACING =  
Object.seal({
	LEFT:-1,
	RIGHT:1	
});

var MOVEMENT =  
Object.seal({
	STANDING:0,
	WALKING: 1,
	RUNNING: 2,
	SLIDING: 3,
	CROUCHING: 4
});

const walkSpeed = 200;
const runSpeed = 300;

function Person(x, y, collisionRadius) 
{
	this.movable = new Movable(x,y,10);
	this.animation = new Animation(x,y,10);

	this.width = 50;
	this.height = 50;
	
	this.facing = FACING.LEFT;
	this.movement = MOVEMENT.STANDING;

	this.canShoot = true;
	this.shootCooldown = 0.5;
	this.shootTimer = 0;
	this.firing = false;
	this.gunDir = {x:0,y:0};
	
	this.fillStyle = "lightgrey";

	this.r = collisionRadius;

	this.updateShoot = function(dt) {
		if(!this.canShoot){
			this.shootTimer += dt;
			if(this.shootTimer > this.shootCooldown)
			{
				this.canShoot = true;
				this.firing = false;
				this.shootTimer = 0;
			}
		}
	}
	
	this.update = function(dt)
	{
		this.updateShoot(dt);

		//  Movable updating
		var velocity = 0;
		switch(this.movement) {
		case MOVEMENT.WALKING:
		case MOVEMENT.SLIDING:
			velocity = walkSpeed;			
			break;
		case MOVEMENT.RUNNING:
			velocity = runSpeed;
			break;
		}//this could probably be simplified into an array of speeds
		velocity *= this.facing;
		
		this.movable.vel.x = velocity;
		this.movable.update(dt);

		//  Animation updating
		this.animation.worldX = this.movable.pos.x;
		this.animation.worldY = this.movable.pos.y;

		this.animation.update(dt);
	};
	
	this.getDisp = function() {
		var disp = {};
		disp.x = this.width / 2;
		disp.y = 0;
		disp.w = this.width;
		disp.h = 0;
		switch(this.movement) {
		case MOVEMENT.CROUCHING:
			disp.y = this.height / 2;
			disp.h = this.height / 2;
			break;
		default:
			disp.y = this.height;
			disp.h = this.height;
			break;
		}
		return disp;
	}

	this.getCollisionRectangle = function()
	{
		var disp = this.getDisp();
	    return { x:this.movable.pos.x - disp.x, y:this.movable.pos.y - disp.y
		, w: disp.w, h: disp.h };
	}

    this.render = function(ctx,camX,camY)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = worldToScreen(this.movable.pos.x,camX,ctx.canvas.width);
        var sy = worldToScreen(this.movable.pos.y,camY,ctx.canvas.height);
        
        ctx.save();
        ctx.fillStyle = this.fillStyle;
		
        var disp = this.getDisp();
		ctx.save();
		ctx.translate(sx,sy);
	    ctx.fillRect(-disp.x,-disp.y,disp.w,disp.h);
		
		ctx.translate(0,-disp.y / 2);
		//var rot = Math.sqrt(Math.pow(this.gunDir.x,2) + Math.pow(this.gunDir.y,2));
		//rot = Math.acos(this.gunDir.x / rot);
		var rot = Math.atan(this.gunDir.y / this.gunDir.x);
		rot = (this.gunDir.x >= 0) ? rot : Math.PI + rot - Math.PI * 2;
		//rot -= (this.gunDir.y > 0) ? 0 : Math.PI / 2;
		//console.log("Rotation: " + rot + " X: " + this.gunDir.x + " Y: " + this.gunDir.y);
		ctx.rotate(rot);
		ctx.translate(disp.x,0);
		ctx.fillStyle = 'black';
		ctx.fillRect(-5,-5,20,10);
		ctx.restore();
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.beginPath();
		ctx.arc(sx,sy,2,0,2*Math.PI,false);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
        ctx.restore();
    };
}