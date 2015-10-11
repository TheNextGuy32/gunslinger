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
	CROUCHING: 4,
	BACKING: 5
});

const walkSpeed = 200;
const runSpeed = 300;

function Person(x, y, collisionRadius) 
{
	this.movable = new Movable(x,y,10);
	this.animation = new Animation(x,y,10);

	this.baseWidth = 50;
	this.baseHeight = 70;
	this.disp = {x:0,y:0,w:0,h:0};
	
	this.facing = FACING.LEFT;
	this.movement = MOVEMENT.STANDING;

	this.canShoot = true;
	this.shootCooldown = 0.5;
	this.shootTimer = 0;
	this.firing = false;
	this.gunDir = new Vector(0, 0);
	
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
		this.updateDisp();
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
	
	this.updateDisp = function() {
		this.disp.w = this.baseWidth;
		this.disp.h = 0;
		this.disp.x = this.disp.w / 2;
		this.disp.y = 0;
		switch(this.movement) {
		case MOVEMENT.CROUCHING:
			this.disp.h = this.baseHeight / 2;
			this.disp.y = this.disp.h;
			break;
		default:
			this.disp.h = this.baseHeight;
			this.disp.y = this.disp.h;
			break;
		}
		//console.log(this.disp);
	}

	this.getCollisionRectangle = function()
	{
	    return { 
	    	x:this.movable.pos.x - this.disp.x, 
	    	y:this.movable.pos.y - this.disp.y, 
	    	w: this.disp.w, 
	    	h: this.disp.h };
	}

    this.render = function(ctx,camX,camY)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = worldToScreen(this.movable.pos.x,camX,ctx.canvas.width);
        var sy = worldToScreen(this.movable.pos.y,camY,ctx.canvas.height);
        
        ctx.save();
        ctx.fillStyle = this.fillStyle;
		
		this.drawBody(ctx,sx,sy);
		this.drawGun(ctx,sx,sy - this.disp.y / 2);
		
		this.drawDebug(ctx,sx,sy);
		
        ctx.restore();
    };
	
	this.drawBody = function(ctx,x,y,moreDisp) {
		//moreDisp is optional, it will be either set or 0
		moreDisp = moreDisp || 0;
		ctx.save();
		ctx.translate(x,y);
	    ctx.fillRect(-this.disp.x,-this.disp.y,this.disp.w,this.disp.h);
		ctx.restore();
	},
	
	this.drawGun = function(ctx,x,y,moreDisp) {
		moreDisp = moreDisp || 0;
		
		ctx.save();
		
		ctx.translate(x,y);
		var rot = Math.atan(this.gunDir.y / this.gunDir.x);
		rot = (this.gunDir.x >= 0) ? rot : Math.PI + rot - Math.PI * 2;
		ctx.rotate(rot);
		ctx.translate(this.disp.x 
		+ this.baseWidth * Math.min(this.gunDir.getMag() / (canvas.width / 3),1),0);
		
		ctx.fillStyle = 'black';
		var bw = 20, bh = 10;
		ctx.fillRect(-bw/2,-bh/2,bw,bh);
		
		ctx.restore();
	}
	
	this.drawDebug = function(ctx,x,y,moreDisp) {
		moreDisp = moreDisp || 0;
		
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.beginPath();
		ctx.arc(x,y,2,0,2*Math.PI,false);
		ctx.arc(x,y - this.disp.y / 2,2,0,2*Math.PI,false);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	
}