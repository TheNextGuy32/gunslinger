function BoundingBox(coords,dims) {
	this.coords = coords;//these are both vectors, top left is x and y, naively, so be careful
	this.dims = dims;//width and height
	this.rotation = 0;//unsupported for now
	
	this.update = function(pos,dims,rot) {
		//basically this can be called in one of three ways:
		//just movable; pos and dims; or pos,dims,rot
		//you can't do pos,rot, it will be recognized as pos,dims
		//so just call as pos,undefined,rot or pos,this.collider.dims,rot
		dims = dims || this.dims;
		rot = rot || this.rotation;
		this.coords = pos;
		this.dims = dims;
		this.rotation = rot;
	}
	
	this.pointInside = function(x,y) {
		return !(x < this.coords.x || x > this.coords.x + this.dims.x 
		|| y < this.coords.y || y > this.coords.y + this.dims.y);
	};
	
	this.intersects = function(other) {
		/*
		console.log("Other coords: " + other.coords);
		console.log("Other dims: " + other.dims);
		console.log("This coords: " + this.coords);
		console.log("This dims: " + this.dims);
		*/
		return !(other.coords.x > this.coords.x + this.dims.x || 
           other.coords.x + other.dims.x < this.coords.x || 
           other.coords.y > this.coords.y + this.dims.y ||
           other.coords.y + other.dims.y < this.coords.y);
	}
	
	this.getArea = function() {
		return this.dims.x * this.dims.y;
	};
	
	this.copy = function()
	{
		return new BoundingBox(this.coords, this.dims);
	};
}