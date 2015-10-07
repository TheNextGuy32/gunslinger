function Movable (x, y, mass) 
{
    this.pos = {x: x, y: y};//probably should make actual vector "class"

    this.vel = {x: 0, y: 0};

    this.accel = {x: 0, y: 0};

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