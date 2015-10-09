function Movable (x, y, mass) 
{
    this.pos = new Vector(x, y);

    this.vel = new Vector(0, 0);

    this.accel = new Vector(0, 0);

    this.mass = mass;

    this.applyForce= function (force, radianDirection)
    {

    };

    this.update = function(dt){
         
        //this.accel.x = this.force.x / this.mass;
        //this.accel.y = this.force.y / this.mass;

        this.vel.x += this.accel.x * dt;
        this.vel.y += this.accel.y * dt;

        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
    };
}