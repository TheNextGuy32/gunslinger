"use strict";
function Cover (xPos, yPos, width, height) 
{
//properties
	this.snapRadius = 50;
	this.movable = new Movable();
	
//functions
	this.init = function(num, xPos, yPos, height,width){
		var c = {};
		c.x = xPos;
		c.y = yPos;
		c.width = width;
		c.height = height;
		c.fillStyle = "blue";
		Object.seal(c);
	};
	this.draw = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x,this.y,this.height,this.width);
		ctx.closePath();
		ctx.fillStyle = this.fillStyle;
		ctx.fill();
		ctx.restore();
	}
	this.checkForCollisions = function(){
		
		//bullet - destroy bullet
		//person in snapRadius and input = snap
	};
	
	this.update = function(){
		
	};
	
}