function Vector(initX, initY)
{
	this.x = initX;
	this.y = initY;
	
	this.getMagSquared= function()
	{
		return this.x*this.x+this.y*this.y;
	};
	
	this.getMag= function()
	{
		return Math.sqrt(this.getMagSquared());
	};
	
	this.setMag= function(newMag)
	{
		var mag = this.getMag();
		this.x *= newMag/mag;
		this.y *= newMag/mag;
	};
	
	this.normalize= function()
	{
		var mag = this.getMag();
		return new Vector(x/mag, y/mag);
	};
	
	this.add= function(otherVec)
	{
		return new Vector(this.x+otherVec.x, this.y+otherVec.y);
	}
	
	this.sub= function(otherVec)
	{
		return new Vector(this.x-otherVec.x, this.y-otherVec.y);
	}
	
	this.mult= function(num)
	{
		return new Vector(this.x*num, this.y*num);
	}
	
	this.div= function(num)
	{
		return new Vector(this.x/num, this.y/num);
	}
	
	this.dot= function(otherVec)
	{
		return this.x*otherVec.x+this.y*otherVec.y;
	};
	
	this.copy = function()
	{
		return new Vector(this.x, this.y);
	};
	
	this.toString= function()
	{
		return "("+this.x+", "+this.y+")";
	};
	
}