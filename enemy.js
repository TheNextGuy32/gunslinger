function Enemy(x,y,collisionRadius,player) {
	
	Person.call(this,x,y,collisionRadius);
	this.target = player;
	this.targetRadius = 30;
	this.velocity = 1;
	this.bullets = 6;
	//this.alerted = false;
	
	this.fireAt = function(target) {
		if(this.bullets > 0)
			bullets.add(Bullet(this.movable.px + this.facing * 5,"Enemy"));
			this.bullets--;
		else
			bullets = 6;
	}
	
	this.update = function(dt) {
		//if the player is firing on you, always fire back rn
		if(player.firing) {
			fireAt(target);
		}
		//close the distance between you and the player
		if(player.movable.px - this.movable.px < targetRadius) {
			this.movable.velocity = player.movable.px - this.movable.px - targetRadius;
			this.facing = Math.sign(this.movable.velocity);
			this.movable.velocity *= 0.8;
		}
		//fire if the player isn't already firing at you and you've closed the distance
		else if (!player.firing) {
			fireAt(this.target);//atm the target doesn't do anything, as enemies just fire linearly.
			//in the future this will allow the enemy to fire at you while ducking
		}
		this.movable.update(dt);
		
		//  Animation updating
		this.animation.worldX = this.movable.px;
		this.animation.worldY = this.movable.py;

		this.animation.update(dt);
	}
	
}