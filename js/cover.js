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

	this.movable = new Movable(xPos,yPos,10);
	this.rotation = 0;
	this.collider = new BoundingBox(new Vector(xPos,yPos),new Vector(width,height));
	
	this.animation = new Animation(xPos,yPos,10);
	this.active = true;

	this.move = function(vec) {
		this.movable.pos = this.movable.pos.add(vec);
		this.updateCollider();
	}
	
	this.updateCollider = function() {
		this.collider.update(this.movable.pos,this.collider.dims,this.rotation);
	}
	
	//functions
	this.alterTableState = function(direction){
		//handles tipping cover into tipped state
		if(this.rotation != 0)
		{
			this.rotation = 0;
		}
		else
		{
			this.rotation = direction;
		}
		this.updateCollider();
	};
	
	this.update = function(dt) {
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