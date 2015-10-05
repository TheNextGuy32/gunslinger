function Enemy(x,y,collisionRadius) {
	
	Person.call(this,x,y,collisionRadius);
	this.target = player;
	this.targetRadius = 5;
	this.velocity = 1;
	this.bullets = 6;
	//this.alerted = false;
	
	this.fillStyle = "red";
	
	this.fireAt = function(target) {
		if(!this.canShoot)
			return;
		if(this.bullets > 0) {
			bullets.push(new Bullet("Enemy",this.movable.px + this.facing * 5,this.movable.py-35,5));
			this.bullets--;
			this.canShoot = false;
		}
		else
			this.bullets = 6;
	}
	
	this.update = function(dt) {
		this.updateShoot(dt);
		//if the player is firing on you, always fire back rn
		if(player.firing) {
			fireAt(target);
		}
		//close the distance between you and the player
		if(Math.abs(player.movable.px - this.movable.px) < this.targetRadius) {
			this.movable.velocity = player.movable.px - this.movable.px;
			this.facing = Math.sign(this.movable.velocity);
			this.movable.velocity += this.facing * -1 * this.targetRadius;
			this.movable.velocity *= 0.8;
		}
		//fire if the player isn't already firing at you and you've closed the distance
		else if (!player.firing) {
			this.fireAt(this.target);//atm the target doesn't do anything, as enemies just fire linearly.
			//in the future this will allow the enemy to fire at you while ducking
		}
		this.movable.update(dt);
		
		//  Animation updating
		this.animation.worldX = this.movable.px;
		this.animation.worldY = this.movable.py;

		this.animation.update(dt);
	}
	
}