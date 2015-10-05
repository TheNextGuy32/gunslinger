function Movable (x, y, mass) 
{
    this.px = x;
    this.py = y;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.mass = mass;

    this.applyForce= function (force, radianDirection)
    {

    };

    this.update = function(dt){
         
        //this.ax = this.fx / this.mass;
        //this.ay = this.fy / this.mass;

        this.vx += this.ax * dt;
        this.vy += this.ay * dt;

        this.px += this.vx * dt;
        this.py += this.vy * dt;
    };
}