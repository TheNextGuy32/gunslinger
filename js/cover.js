"use strict";

/*var TABLE_STATE =  
Object.seal({
	LEFT:-Math.PI / 2,
	UP:0,
	RIGHT:Math.PI / 2
});*/

function Cover (xPos, yPos, width, height, thickness,legWidth) {
//properties
	this.snapRadius = 50;

	this.xPos = xPos;
	this.yPos = yPos;

	this.w = width;
	this.h = height;

	this.thickness = thickness;
	this.legWidth = legWidth

	this.movable = new Movable(xPos,yPos,1);
	this.rotation = 0;
	this.collider = new BoundingBox(new Vector(xPos,yPos),new Vector(width,height));
	
	this.animation = new Animation(xPos,yPos,10);
	this.active = true;
	this.launching = 0;//0, 1, -1
	this.launchTime = 0;

	this.move = function(vec) {
		this.movable.pos = this.movable.pos.add(vec);
		this.updateCollider();
	}
	
	this.calcForces = function() {
		if(this.launching != 0) {
			var launch = new Vector(this.launching,0);
			//var angle = Math.random() * Math.PI / 4 + Math.PI / 6;
			var angle = Math.PI / 4;
			launch = launch.rotate(this.launching * -angle);
			console.log(launch);
			launch = launch.mult(200);
			this.movable.forces.push(launch);
			
			this.launchTime -= dt;
			if(this.launchTime < 0) {
				this.launching = 0;
			}
		}
	}
	
	this.updateCollider = function() {
		this.collider.update(this.movable.pos,this.collider.dims,this.rotation);
	}
	
	//functions
	this.alterTableState = function(){
		//handles tipping cover into tipped state
		if(this.rotation != 0)
		{
			this.rotation = 0;
			this.movable.pos.y = 10 - this.collider.dims.y;
			this.movable.vel.x = 0;
			this.launching = 0;
		}
		else
		{
			//console.log(launch);
			this.move(new Vector(0,-150));
			this.launching = player.facing;
			this.launchTime = 1000;
		}
		this.updateCollider();
	};
	
	this.update = function(dt) {
		this.rotation += Math.PI / 6 * this.launching;
		this.calcForces(dt);
		this.movable.update(dt);
		this.updateCollider();
	}
	
	//draws cover
	this.render = function(ctx,cx,cy){
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.pos.x - cx + (ctx.canvas.width/2);
        var sy = this.movable.pos.y - cy + (ctx.canvas.height/2);
      	
        ctx.save();
        
        ctx.fillStyle = "brown";

		ctx.translate(sx,sy);
		ctx.rotate(this.rotation);
		//legs
	    ctx.fillRect(-this.collider.dims.x / 2, -this.collider.dims.y / 2, this.legWidth, this.collider.dims.y);
	    ctx.fillRect( this.collider.dims.x / 2 - this.legWidth, -this.collider.dims.y / 2, this.legWidth, this.collider.dims.y);
		//table
	    ctx.fillRect(-this.collider.dims.x / 2, -this.collider.dims.y / 2, this.collider.dims.x, this.thickness);

        ctx.restore();
		
		this.collider.debug(ctx,cx,cy);
    };
	
	this.updateCollider();
}