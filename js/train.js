function Train(x, y, width, height) 
{
	this.getCollisionRectangle = function()
	{
		return {
	        	x: x,
	        	y: y-height,
	        	w: width,
	        	h: height};
	}

    this.render = function(ctx,cx,cy)
    {
		var wheelRadius = 40;
		var wheelSpacing = 300;
		var wheelOffset = 0;
		
        var sx = worldToScreen(x,camX,ctx.canvas.width);
        var sy = worldToScreen(y,camY,ctx.canvas.height);
		var trainBackgroundGradient = ctx.createLinearGradient(sx, sy-height, sx, sy);
		trainBackgroundGradient.addColorStop(0, "#2b1d0e");
		trainBackgroundGradient.addColorStop(1, "#8b5d2e");
		var trainWheelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, wheelRadius);
		trainWheelGradient.addColorStop(0, "#333333");
		trainWheelGradient.addColorStop(1, "#000000");
		
		//Train bg
		ctx.fillStyle = trainBackgroundGradient;
		ctx.fillRect(sx, sy, width, -1*height);
		
		//Train wheels
		ctx.fillStyle = trainWheelGradient;
		ctx.save();
		ctx.translate(sx+wheelRadius+wheelOffset, sy+wheelRadius);
		for(var i = wheelRadius; i < width; i += wheelSpacing)
		{
			ctx.beginPath();
			ctx.arc(0, 0, wheelRadius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fill();
			ctx.translate(wheelSpacing, 0);
		}
		ctx.restore();

		//Train Rail
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, sy+wheelRadius*1.9, ctx.canvas.width, 5);
		ctx.restore();
    };
}