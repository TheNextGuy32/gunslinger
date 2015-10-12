"use strict";

var TABLE_STATE =  
Object.seal({
	LEFT:-Math.PI / 2,
	UP:0,
	RIGHT:Math.PI / 2
});

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
	this.collider = new BoundingBox(new Vector(xPos,yPos),new Vector(width,height));
	
	this.animation = new Animation(xPos,yPos,10);

	this.tableState = TABLE_STATE.UP;//for now, I have removed proper table collisions
	//it will be fixed when SAT is implemented

	//functions
	this.alterTableState = function(direction){
		//handles tipping cover into tipped state
		if(this.tableState != TABLE_STATE.UP)
		{
			this.tableState = TABLE_STATE.UP;
		}
		else
		{
			this.tableState = direction;
		}
		this.collider.update(this.movable.pos.sub(new Vector(this.collider.dims.x / 2,this.collider.dims.y))
		,this.collider.dims,this.tableState);
	};
	
	//draws cover
	this.render = function(ctx,cx,cy){
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.pos.x - cx + (ctx.canvas.width/2);
        var sy = this.movable.pos.y - cy + (ctx.canvas.height/2);
      	
        ctx.save();
        
        ctx.fillStyle = "brown";

		//this needs to be fixed BAD
        if(this.tableState == TABLE_STATE.UP){
	        ctx.fillRect(sx-(this.w/2),sy-this.h,this.legWidth,this.h);
	        ctx.fillRect(sx+(this.w/2)-this.legWidth,sy-this.h,this.legWidth,this.h);
	        ctx.fillRect(sx-(this.w/2),sy-this.h,this.w,this.thickness);
        }
        else if(this.tableState == TABLE_STATE.LEFT)
        {
        	ctx.fillRect(sx-(this.w/2)-this.h,sy-this.w,this.h,this.legWidth);
        	ctx.fillRect(sx-(this.w/2)-this.h,sy-this.w,this.thickness,this.w);
        	ctx.fillRect(sx-(this.w/2)-this.h,sy-this.legWidth,this.h,this.legWidth);
        }
        else
        {	
			ctx.fillRect(sx+(this.w/2),sy-this.w,this.h,this.legWidth);
        	ctx.fillRect(sx+(this.w/2)+this.h - this.thickness,sy-this.w,this.thickness,this.w);
        	ctx.fillRect(sx+(this.w/2),sy-this.legWidth,this.h,this.legWidth);
        }

        ctx.restore();
    };
	
}