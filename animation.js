function Animation (worldX, worldY, radius) 
{
    this.worldX = worldX;
    this.worldY = worldY;
    
    this.currentFrame = 0;
    this.maxFrame = 0;
    this.frameDuration = 5;
    this.frameTimer = 0;


    this.render = function(ctx,cameraX,cameraY)
    {
        var screenX = this.worldX - cameraX + 400;
        var screenY = this.worldY - cameraY + 400;
        
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(screenX, screenY - (this.radius/2), this.radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        //ctx.stroke();
        //ctx.fill();
        ctx.closePath();

        this.frameTimer+= 0.25;
        if(this.frameDuration < this.frameTimer){
            this.frameTimer -= this.frameDuration;
            this.currentFrame ++;
            if(this.currentFrame == 3) this.currentFrame = 0;
        }

        ctx.restore();
    };
}