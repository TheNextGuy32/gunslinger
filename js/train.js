function Train(x, y, width, height) 
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.colliders = [];
	this.colliders.push(new BoundingBox(new Vector(x + width / 2, y - height - 100), new Vector(width, 200)));
	this.colliders.push(new BoundingBox(new Vector(x + width / 2, y + 100), new Vector(width, 200)));
	this.colliders.push(new BoundingBox(new Vector(x - 10, y - this.height / 2), new Vector(20, this.height)));
	this.colliders.push(new BoundingBox(new Vector(x + width + 10, y - this.height / 2), new Vector(20, this.height)));

    this.render = function(ctx,cx,cy)
    {
		var wheelRadius = 40;
		var wheelSpacing = 300;
		var wheelOffset = 0;
		
        var sx = worldToScreen(x,camX,ctx.canvas.width);
        var sy = worldToScreen(y,camY,ctx.canvas.height);
		var trainBackgroundGradient = ctx.createLinearGradient(sx, sy-height, sx, sy);
		trainBackgroundGradient.addColorStop(0, "#2b1d0e");
		trainBackgroundGradient.addColorStop(1, "#8b5d2e");
		var trainWheelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, wheelRadius);
		trainWheelGradient.addColorStop(0, "#333333");
		trainWheelGradient.addColorStop(1, "#000000");
		
		//Car connectors
		ctx.fillStyle = "#333";
		ctx.fillRect(sx, sy, -10, -10);
		ctx.fillRect(sx+width, sy, 10, -10);
		ctx.restore();
		
		//Train bg
		ctx.fillStyle = trainBackgroundGradient;
		ctx.fillRect(sx, sy, width, -1*height);
		
		//Train wheels
		ctx.fillStyle = trainWheelGradient;
		ctx.save();
		ctx.translate(sx+wheelRadius+wheelOffset, sy+wheelRadius);
		for(var i = wheelRadius; i < width; i += wheelSpacing)
		{
			ctx.beginPath();
			ctx.arc(0, 0, wheelRadius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fill();
			ctx.translate(wheelSpacing, 0);
		}
		ctx.restore();

		//Train Rail
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, sy+wheelRadius*1.9, ctx.canvas.width, 5);
		ctx.restore();
		
		for(var i = 0;i < this.colliders.length;i++)
			this.colliders[i].debug(ctx, cx, cy);
    };
	
	this.constrain = function() {
		//for(var i = 1;i < 2;i++) {
			var collider = this.colliders[1];
			for(var i = 0; i < cover.length; i++) {
				//console.log("YEAH COVER");
				var c = cover[i];
				if(!c.active)
					continue;
				//this requires proper bounding on the train
				var manifold = collider.intersects(c.collider);
				if(manifold) {
					c.move(manifold.norm.mult(manifold.pen));
				}
			}
			for(var i = 0; i < enemies.length; i++) {
				//console.log("YEAH ENEMY");
				var e = enemies[i];
				if(!e.active)
					continue;
				//this requires proper bounding on the train
				var manifold = collider.intersects(e.collider);
				if(manifold) {
					
					//this breaks rn, will work properly once above is fixed
					//originator??
					e.move(manifold.norm.mult(manifold.pen));
				}
			}
			for(var i = 0; i < bullets.length; i++) {
				//console.log("YEAH BULLET");
				var b = bullets[i];
				//bullets are broken in this system right now
				if(b.active && !collider.intersects(b.collider)) {
					b.active = false;
				}
			}
		
			//this will be redone to support car movement as well
			var manifold = collider.intersects(player.collider);
			//console.log("YEAH PLAYER");
			if(manifold) {	
				//this breaks rn, will work properly once above is fixed
				//also need to account for originator
				player.move(manifold.norm.mult(manifold.pen));
			}
			if(player.movable.pos.x <= (currentCarNum > minCarNum ? -128 : -15)) {
				if(currentCarNum > minCarNum) {
					player.movable.pos.x += 1270;
					currentCarNum --;
					resetLevel();
				}
				else {
					player.movable.pos.x = -15;
				}
			}
			else if(player.movable.pos.x >= (currentCarNum < maxCarNum ? 1238 : 1120)) {
				if(currentCarNum < maxCarNum) {
					player.movable.pos.x -= 1270;
					currentCarNum ++;
					resetLevel();
				}
				else {
					player.movable.pos.x = 1120;
				}
			}
		//}
	}
}