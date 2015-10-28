function Train(x, y, width, height, initOpacity) 
{
	
	this.bgImg = document.getElementById("traincar");
	this.backgroundOpacity = initOpacity;
	this.collider = new BoundingBox(new Vector(x+width/2, y-height/2), new Vector(width, height));

	this.changeBackgroundOpacity = function(delta)
	{
		this.backgroundOpacity = Math.min(1, Math.max(0, this.backgroundOpacity+delta));
	}
	
    this.render = function(ctx,cx,cy)
    {
		var wheelRadius = 40;
		var wheelSpacing = 300;
		var wheelOffset = 0;
		
        var sx = worldToScreen(x,camX,ctx.canvas.width);
        var sy = worldToScreen(y,camY,ctx.canvas.height);
//		trainBackgroundGradient.addColorStop(0, "#2b1d0e");
//		trainBackgroundGradient.addColorStop(1, "#8b5d2e");
		var trainWheelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, wheelRadius);
		trainWheelGradient.addColorStop(0, "#333333");
		trainWheelGradient.addColorStop(1, "#000000");
		
		//Car connectors
		ctx.fillStyle = "#333";
		ctx.fillRect(sx-10, sy, width+20, -10);
		
		//Train bg
		ctx.drawImage(this.bgImg, sx, sy-height);
		if(this.backgroundOpacity != 0)
		{
			var trainBackgroundGradient = ctx.createLinearGradient(sx, sy-height, sx, sy);
			trainBackgroundGradient.addColorStop(0, "rgba(43, 29, 14, "+this.backgroundOpacity+")");
			trainBackgroundGradient.addColorStop(1, "rgba(139, 93, 46, "+this.backgroundOpacity+")");

			ctx.fillStyle = trainBackgroundGradient;
			ctx.fillRect(sx, sy, width, -1*height);
		}
		
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
		
		if(debugMode)
		{
			this.collider.debug(ctx, cx, cy);
		}
    };
}