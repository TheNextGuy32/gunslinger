function Thing (worldX, worldY, radius) 
{
    //var animation = new Animation();

    this.r = radius;

    this.px = 0;
    this.py = 0;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.mass = 0;

    

    this.applyForce= function (force, radianDirection)
    {

    };

    this.update = function(dt){
         
        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        this.vx += this.ax * dt;
        this.vy += this.ay * dt;

        this.px += this.vx * dt;
        this.py += this.vy * dt;
    };

    this.render = function(ctx,cx,cy)
    {
        var sx = this.py - cx + ctx.canvas.width;
        var sy = this.py - cy + ctx.canvas.height;
        
        ctx.save();
        
        ctx.fillstyle = "black";
        ctx.fillRect(sx,sy,50,50);

        ctx.restore();
    };
}