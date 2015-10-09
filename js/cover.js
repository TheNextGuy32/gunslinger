"use strict";

var TABLE =  
Object.seal({
	LEFT:-1,
	UP:0,
	RIGHT:1
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
	this.animation = new Animation(xPos,yPos,10);

	this.tableStatus = TABLE.UP;

	this.getPlayerCollisionRectangle = function()
	{
		if(this.tableStatus == TABLE.RIGHT)
		{
			return {
		        	x:this.movable.pos.x + (this.w/2),
		        	y:this.movable.pos.y - (this.h),
		        	w:this.h,
		        	h:this.w
		        };
        }
        else if(this.tableStatus == TABLE.LEFT)
		{
			return {
		        	x:this.movable.pos.x - (this.w/2) - this.h,
		        	y:this.movable.pos.y - (this.h),
		        	w:this.h,
		        	h:this.w
		        };
        }
        else
        {
			return {
	        	x:this.movable.pos.x- (this.w/2),
	        	y:this.movable.pos.y- (this.h),
	        	w:this.w,
	        	h:this.h
        	}; 	        	
        }
	}

	this.getBulletCollisionRectangle = function()
	{
		if(this.tableStatus == TABLE.RIGHT)
		{
			return {
		        	x:this.movable.pos.x + (this.w/2) + this.h - this.thickness,
		        	y:this.movable.pos.y - (this.h),
		        	w:this.thickness,
		        	h:this.w
		        };
        }
        else if(this.tableStatus == TABLE.LEFT)
		{
			return {
		        	x:this.movable.pos.x - (this.w/2) - this.h,
		        	y:this.movable.pos.y - (this.h),
		        	w:this.thickness,
		        	h:this.w
		        };
        }
        else
        {
			return {
	        	x:this.movable.pos.x - (this.w/2),
	        	y:this.movable.pos.y - (this.h),
	        	w:this.w,
	        	h:this.thickness
        	}; 	        	
        }
	}

//functions
	this.alterTableStatus = function(direction){
		//handles tipping cover into tipped state
		if(this.tableStatus != TABLE.UP)
		{
			this.tableStatus = TABLE.UP;
		}
		else
		{
			this.tableStatus = direction;
		}

	};
	//draws cover
	this.render = function(ctx,cx,cy){
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.pos.x - cx + (ctx.canvas.width/2);
        var sy = this.movable.pos.y - cy + (ctx.canvas.height/2);
      	
        ctx.save();
        
        ctx.fillStyle = "brown";

        if(this.tableStatus == TABLE.UP){
	        ctx.fillRect(sx-(this.w/2),sy-this.h,this.legWidth,this.h);
	        ctx.fillRect(sx+(this.w/2)-this.legWidth,sy-this.h,this.legWidth,this.h);
	        ctx.fillRect(sx-(this.w/2),sy-this.h,this.w,this.thickness);
        }
        else if(this.tableStatus == TABLE.LEFT)
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