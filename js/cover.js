"use strict";
function Cover (xPos, yPos, width, height, collisionRadius) {
//properties
	this.snapRadius = 50;
	this.xPos = xPos;
	this.yPos = yPos;
	this.w = width;
	this.h = height;
	this.collisionRadius = collisionRadius;
	this.movable = new Movable(xPos,yPos,10);
	this.animation = new Animation(xPos,yPos,10);

	this.getCollisionRectangle = function()
	{
		return {
	        	x:this.movable.px- (this.w/2),
	        	y:this.movable.py- (this.h),
	        	w:this.w,
	        	h:this.h};
	}

//functions
	this.knockOver = function(){
		//handles tipping cover into tipped state
	};
	this.pickUp = function(){
		//handles changing properties to standard state
	};
	//draws cover
	this.render = function(ctx,cx,cy){
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.px - cx + (ctx.canvas.width/2);
        var sy = this.movable.py - cy + (ctx.canvas.height/2);
      
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(sx-(this.w/2),sy-this.h,this.w,this.h);
        ctx.restore();
    };
	
}