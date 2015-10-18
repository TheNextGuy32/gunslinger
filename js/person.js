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

const walkSpeed = 250;
const runSpeed = 350;

function Person(x, y) 
{
	this.baseWidth = 75;
	this.baseHeight = 150;
	this.disp = new BoundingBox(new Vector(0,0),new Vector(0,0));

	this.movable = new Movable(x,y,10);
	this.collider = new BoundingBox(new Vector(x,y),new Vector(this.baseWidth,this.baseHeight));
	
	this.animation = new Animation(x,y,10);
	
	this.facing = FACING.RIGHT;
	this.movement = MOVEMENT.STANDING;
	this.faction = FACTION.PLAYER;
	

	this.canShoot = true;
	this.shootCooldown = 0.5;
	this.shootTimer = 0;
	this.firing = false;
	this.gunDir = new Vector(0, 0);
	
	this.fillStyle = "lightgrey";

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
	
	this.fireBullet = function() { 
		var bulletAccel = this.gunDir.copy().normalize();
		var bulletStart = bulletAccel.copy();
		
		bulletStart.setMag(this.disp.coords.x + this.baseWidth 
		* Math.min(this.gunDir.getMag() / (canvas.width / 3),1));
		var b = new Bullet(this.faction
		,this.movable.pos.x + bulletStart.x
		,this.movable.pos.y + bulletStart.y,
		bulletAccel.x,bulletAccel.y);
		bullets.push(b);
		
		this.bullets--;
		this.canShoot = false;
		this.firing = true;
		
		//push back
		//temporary, will be fixed with future system
		//also doesn't reflect when bullets are fired backward oops
		var recoil = -5;
		if(this.gunDir.x < 0) recoil = -recoil;
		
		this.movable.pos.x += recoil;
	}
	
	this.updateDisp = function() {
		this.disp.dims.x = this.baseWidth;
		this.disp.dims.y = 0;
		this.disp.coords.x = this.disp.dims.x / 2;
		this.disp.coords.y = 0;
		switch(this.movement) {
		case MOVEMENT.CROUCHING:
			this.disp.dims.y = this.baseHeight / 2;
			this.disp.coords.y = 0;
			break;
		default:
			this.disp.dims.y = this.baseHeight;
			this.disp.coords.y = this.disp.dims.y / 2;
			break;
		}
		//console.log(this.disp);
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
		
		var colliderPos = this.movable.pos.copy();
		colliderPos.y += this.disp.dims.y / 2 - this.disp.coords.y;
		this.collider.update(colliderPos,this.disp.dims);

		//  Animation updating
		this.animation.worldX = this.movable.pos.x;
		this.animation.worldY = this.movable.pos.y;

		this.animation.update(dt);
	};

    this.render = function(ctx,camX,camY)
    {
    	//console.log("Pos: " + sx+", " + sy);
        var sx = worldToScreen(this.movable.pos.x,camX,ctx.canvas.width);
        var sy = worldToScreen(this.movable.pos.y,camY,ctx.canvas.height);
        
        ctx.save();
        ctx.fillStyle = this.fillStyle;
		
		this.drawBody(ctx,sx,sy);
		this.drawGun(ctx,sx,sy);
		
		this.drawDebug(ctx,sx,sy,camX,camY);
		
        ctx.restore();
    };
	
	this.drawBody = function(ctx,x,y,moreDisp) {
		//moreDisp is optional, it will be either set or 0
		moreDisp = moreDisp || 0;
		ctx.save();
		ctx.translate(x,y);
	    ctx.fillRect(-this.disp.coords.x,-this.disp.coords.y,this.disp.dims.x,this.disp.dims.y);
		ctx.restore();
	},
	
	this.drawGun = function(ctx,x,y,moreDisp) {
		moreDisp = moreDisp || 0;
		
		ctx.save();
		
		ctx.translate(x,y);
		var rot = Math.atan(this.gunDir.y / this.gunDir.x);
		rot += (this.gunDir.x >= 0) ? 0 : Math.PI;
		//this is for recoil
		var recoilDir = Math.sign(Math.PI - (rot + Math.PI / 2));
		rot -= recoilDir * ((this.canShoot) ? 0 : Math.PI / 12);
		ctx.rotate(rot);
		var gunx = this.disp.coords.x;
		gunx += this.baseWidth * Math.min(this.gunDir.getMag() / (canvas.width / 3),1);
		gunx -= ((this.canShoot) ? 0 : this.disp.coords.x / 2);
		ctx.translate(gunx,0);
		ctx.rotate(recoilDir * ((this.canShoot) ? 0 : -Math.PI / 4));
		
		ctx.fillStyle = 'black';
		var bw = 40, bh = 10;
		ctx.fillRect(-bw/2,-bh/2,bw,bh);
		ctx.fillRect(-bw/2, 0, bw/4, recoilDir*bh*1.5);
		
		ctx.restore();
	}
	
	this.drawDebug = function(ctx,x,y,cx,cy,moreDisp) {
		moreDisp = moreDisp || 0;
		
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.beginPath();
		ctx.arc(x,y,2,0,2*Math.PI,false);
		ctx.arc(x - this.disp.coords.x,y - this.disp.coords.y,2,0,2*Math.PI,false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x + this.disp.coords.x * this.facing,y,4,0,2*Math.PI,false);
		ctx.fill();
		ctx.restore();
		
		this.collider.debug(ctx,cx,cy);
	}
	
}