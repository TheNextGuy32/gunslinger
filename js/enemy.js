function Enemy(x,y) {
	
	Person.call(this,x,y,"media/playeranimations.png");
	this.target = player;
	this.targetRadius = 600 + (Math.random()*200 - 100);
	this.velocity = 0;
	this.bullets = 6;
	//this.alerted = false;
	this.active = true;
	this.faction = FACTION.ENEMY;
	
	this.fillStyle = "red";

	this.aware = false;
	this.awarenessDistance = 500;
	
	this.hearts = 2;
	this.hitstunDuration = 0.5;
	this.hitstunTimer = 0;
	this.stunned = false;
	this.isPlayer = false;

	this.fireAt = function(target) {
		
		if(!this.canShoot)
			return;
		if(this.bullets > 0) {
			playEffect(3);
			this.fireBullet();
		}
		else {
			this.bullets = 6;
			this.canShoot = false;
			this.shootTimer = this.shootCooldown / 2;//makes it lengthen a little bit
		}
	}
	
	this.update = function(dt)
	{
		this.updateDisp();
		
		var pPos = player.movable.pos.sub(new Vector(0,player.disp.coords.y / 2));//their position
		var ePos = this.movable.pos.sub(new Vector(0,this.disp.coords.y / 2));//our position
		
		var dist = player.movable.pos.x - this.movable.pos.x;

		if(this.aware) {
			this.gunDir = pPos.sub(ePos);
		
			this.updateShoot(dt);
			//if the player is firing on you, always fire back rn
			if(player.firing && !this.stunned) {
			 	this.fireAt(this.target);
			}
			
			
			//close the distance between you and the player
			if(this.movement != MOVEMENT.BACKING && Math.abs(dist) > this.targetRadius) {
				this.movement = MOVEMENT.WALKING;
				this.velocity = dist;
				this.velocity *= 50 / this.targetRadius;//makes it proportional to distance
				this.facing = Math.sign(this.velocity);
				//console.log(this.facing);
			}
			
			//if you're backing up and the player has stopped
			else if(this.movement === MOVEMENT.BACKING && player.movement != MOVEMENT.WALKING) {
				this.movement = MOVEMENT.WALKING;
			}
			
			//move away from the player if they start moving towards you at close range
			else if(player.movement == MOVEMENT.WALKING) {
				this.movement = MOVEMENT.BACKING;
				this.velocity = -this.targetRadius / dist;//makes it inversely proportional to distance
				this.velocity *= 150;
				this.facing = -Math.sign(this.velocity);
			}
			//fire if the player isn't already firing at you and you've closed the distance
			
			else if (!player.firing) {
				if(!this.stunned) {
					this.fireAt(this.target);//atm the target doesn't do anything, as enemies just fire linearly.
					//in the future this will allow the enemy to fire at you while ducking
					this.movement = MOVEMENT.STANDING;
					this.velocity = 0;
					this.facing = Math.sign(dist);
					//this happens when they are completely on top of each other
					if(!this.facing) this.facing = FACING.LEFT;
				}
			}
		}
		else
		{
			if(Math.abs(dist) < this.awarenessDistance)
			{
				this.aware = true;
			}
		}
		
		if(this.stunned)
		{
			this.hitstunTimer+= dt;
			if(this.hitstunTimer > this.hitstunDuration)
			{
				this.hitstunTimer = 0;
				this.stunned = false;
			}			
		}

		this.movable.vel.x = this.velocity;
		this.movable.update(dt);
		this.movable.pos.x = Math.max(-15, Math.min(1120, this.movable.pos.x));
		this.collider.update(this.movable.pos);
		
		if (this.facing == FACING.LEFT) {
            this.animation.reverse = true;
        }
        else {
            this.animation.reverse = false;
        }
		this.animation.update(dt);
	}
	
}