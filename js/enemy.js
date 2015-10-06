function Enemy(x,y,collisionRadius) {
	
	Person.call(this,x,y,collisionRadius);
	this.target = player;
	this.targetRadius = 400 + (Math.random()*200 - 100);
	this.velocity = 1;
	this.bullets = 6;
	//this.alerted = false;
	
	this.fillStyle = "red";
	
	this.fireAt = function(target) {
		if(!this.canShoot)
			return;
		if(this.bullets > 0) {
			var vx = this.movable.px - player.movable.px;
			var vy = this.movable.py - player.movable.py;
			vy -= (player.movement == MOVEMENT.STANDING) ? 0 : 15;
			var mag = Math.sqrt(vx * vx + vy * vy);
			vx *= -500 / mag;
			vy *= -500 / mag;
			var b = new Bullet(1,this.movable.px + this.facing * 5,this.movable.py-35,vx,vy,5);
			b.facing = this.facing;
			bullets.push(b);
			
			this.bullets--;
			this.canShoot = false;
		}
		else
			this.bullets = 6;
	}
	
	this.update = function(dt) {
		this.updateShoot(dt);
		//if the player is firing on you, always fire back rn
		// if(player.firing) {
		// 	fireAt(target);
		// }
		//close the distance between you and the player
		if(Math.abs(player.movable.px - this.movable.px) > this.targetRadius) {

			this.movement = MOVEMENT.WALKING;
			
			this.facing = FACING.LEFT;
			if(this.movable.px < player.movable.px){
				this.facing = FACING.RIGHT;
			}
		}
		//fire if the player isn't already firing at you and you've closed the distance
		else if (!player.firing) {
			this.fireAt(this.target);//atm the target doesn't do anything, as enemies just fire linearly.
			//in the future this will allow the enemy to fire at you while ducking
			this.movement = MOVEMENT.STANDING;
		}

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
	}
	
}