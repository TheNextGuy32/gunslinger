function Animation (image,numberRows,numberColumns) 
{    
    this.currentFrame = 0;
    this.maxFrame = numberColumns;
    this.frameDuration = 0.3;
    this.frameTimer = 0;

    this.currentFrameRow = 0;
    this.maxFrameRow = numberRows;

    this.img = new Image();
    this.img.src = image;

    this.frameWidth = this.img.width / this.maxFrame;
    this.frameHeight = this.img.height / this.maxFrameRow;

    this.reverse = false;

    this.setRow = function (row) {
        this.currentFrameRow = row;
    };

    this.update = function(dt)
    {
        this.frameTimer+=dt;
        if(this.frameDuration < this.frameTimer){
            this.frameTimer -= this.frameDuration;
            this.currentFrame++;
            if (this.currentFrame == this.maxFrame) this.currentFrame = 0;
        }
    };

    this.render = function (sx, sy, ctx, isPlayer, x, y) {
        
        ctx.save();
        
        ctx.translate(sx, sy - 45);

        if (this.reverse) {
            ctx.translate(this.frameWidth, 0);
            ctx.scale(-1, 1);

        }
        else {
            ctx.translate(-this.frameWidth, 0);
        }
        this.frameWidth = 55;
        this.frameHeight = 64;
        ctx.drawImage(
            this.img,
            this.currentFrame * this.frameWidth, this.currentFrameRow * this.frameHeight,
            this.frameWidth, this.frameHeight,
            0,0,
            this.frameWidth * 2, this.frameHeight * 2);

        ctx.restore();
    };
}