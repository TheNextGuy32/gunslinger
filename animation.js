function Animation (worldX, worldY, radius) 
{
    this.worldX = worldX;
    this.worldY = worldY;
    
    this.currentFrame = 0;
    this.maxFrame = 0;
    this.frameDuration = 5;
    this.frameTimer = 0;

    this.update = function(dt)
    {
        
    };

    this.render = function(ctx,cameraX,cameraY)
    {
        var screenX = this.worldX - cameraX + 400;
        var screenY = this.worldY - cameraY + 400;

        this.frameTimer+= 0.25;
        if(this.frameDuration < this.frameTimer){
            this.frameTimer -= this.frameDuration;
            this.currentFrame ++;
            if(this.currentFrame == 3) this.currentFrame = 0;
        }

        ctx.restore();
    };
}