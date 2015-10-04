"use strict";
function Cover (xPos, yPos, width, height, collisionRadius) {
//properties
	this.snapRadius = 50;
	this.xPos = xPos;
	this.yPos = yPos;
	this.width = width;
	this.height = height;
	this.collisionRadius = collisionRadius;
	this.movable = new Movable(xPos,yPos,10);
	this.animation = new Animation(xPos,yPos,10);
//functions
	this.knockOver = function(){
		//handles tipping cover into tipped state
	};
	this.pickUp = function(){
		//handles changing properties to standard state
	};
	//draws cover
	this.render = function(ctx,cx,cy,covWidth,covHeight){
    	//console.log("Pos: " + sx+", " + sy);
        var sx = this.movable.px - cx + (ctx.canvas.width/2);
        var sy = this.movable.py - cy + (ctx.canvas.height/2);
      
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(sx-(covWidth/2),sy-covHeight,covWidth,covHeight);
        ctx.restore();
    };
	
}