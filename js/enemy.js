function Enemy(x,y,collisionRadius) {
	
	Person.call(this,x,y,collisionRadius);
	this.target = player;
	this.targetRadius = 200 + (Math.random()*200 - 100);
	this.velocity = 0;
	this.bullets = 6;
	//this.alerted = false;
	
	this.fillStyle = "red";
	
	this.fireAt = function(target) {
		if(!this.canShoot)
			return;
		if(this.bullets > 0) {
			var vx = this.movable.pos.x - player.movable.pos.x;
			var vy = this.movable.pos.y - player.movable.pos.y;
			vy -= (player.movement == MOVEMENT.STANDING) ? 0 : 15;
			var mag = Math.sqrt(vx * vx + vy * vy);
			vx *= -500 / mag;
			vy *= -500 / mag;
			var disp = this.getDisp();
			var b = new Bullet(1,this.movable.pos.x + this.facing * 5,this.movable.pos.y-disp.y - 10,vx,vy,5);
			bullets.push(b);
			
			this.bullets--;
			this.canShoot = false;
		}
		else {
			this.bullets = 6;
			this.canShoot = false;
			this.shootTimer = this.shootCooldown / 2;//makes it lengthen a little bit
		}
	}
	
	this.update = function(dt) {
		this.updateShoot(dt);
		//if the player is firing on you, always fire back rn
		 if(player.firing) {
		 	this.fireAt(this.target);
		 }
		//close the distance between you and the player
		if(Math.abs(player.movable.pos.x - this.movable.pos.x) > this.targetRadius) {
			this.movement = MOVEMENT.WALKING;
			this.velocity = player.movable.pos.x - this.movable.pos.x;
			this.velocity *= 50 / this.targetRadius;//makes it proportional to distance
			this.facing = Math.sign(this.velocity);
		}
		//fire if the player isn't already firing at you and you've closed the distance
		else if (!player.firing) {
			this.fireAt(this.target);//atm the target doesn't do anything, as enemies just fire linearly.
			//in the future this will allow the enemy to fire at you while ducking
			this.movement = MOVEMENT.STANDING;
			this.velocity = 0;
			this.facing = Math.sign(player.movable.pos.x - this.movable.pos.x);
			//this happens when they are completely on top of each other
			if(!this.facing) this.facing = FACING.LEFT;
		}
		this.movable.vel.x = this.velocity;
		this.movable.update(dt);
		
		//  Animation updating
		this.animation.worldX = this.movable.pos.x;
		this.animation.worldY = this.movable.pos.y;

		this.animation.update(dt);
	}
	
}