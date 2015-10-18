function Movable (x, y, mass) 
{
    this.pos = new Vector(x, y);

    this.vel = new Vector(0, 0);

    this.accel = new Vector(0, 0);
	
	this.forces = [];

    this.mass = mass;
	this.maxSpeed = 5000;

    this.applyForce = function (force,factor)
    {
		//factor is usually dt, otherwise some other small value
		this.forces.push(force.div(factor));
    };
	
	this.calcConstantForces = function() {
		this.forces.push(new Vector(0,9.8 * mass));
		//this.forces.push(this.vel.mult(this.vel.getMag() * -0.4 * this.mass));
	};

    this.update = function(dt){
		this.calcConstantForces();
		var force;
        while(force = this.forces.pop())
			this.accel = this.accel.add(force.div(this.mass));

        this.vel = this.vel.add(this.accel.mult(dt));
		var vel = this.vel.getMag();
		if(vel > this.maxSpeed)
			this.vel.setMag(this.maxSpeed);
		if(vel < 0.05)
			this.vel = this.vel.mult(0.);
		
        this.pos = this.pos.add(this.vel.mult(dt));
		
		this.accel.mult(0.);
    };
}