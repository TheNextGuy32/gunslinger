function Environment (envWidth, envHeight)
{
	//var backgroundAnim = new Animation();
	var xPos, yPos;
	var objectsInScene;
	//var nextLevelCollider;
	
	var placeholderThingThatShouldBeDeletedBeforeFurtherDevelopment;
	
	this.init= function(player)
	{
		xPos = 0;
		yPos = 0;
		this.objectsInScene = new Array();
		
		//Todo: Populate objectsInScene array
		this.objectsInScene.push(player);
	};
	
	this.update= function (dt)
    {
		for(var i = 0; i < this.objectsInScene.length; i++)
		{
			var currentObj = this.objectsInScene[i];
			currentObj.update(dt);
			//Todo: Keep objects in bounds
		}
		
		//Todo: Check for collision w/nextLevelCollider, advance to next Environment if colliding
    };
	
	this.render = function(ctx,cx,cy)
    {
		//Draw background
		//START PLACEHOLDER BACKGROUND
		ctx.save();
		var backgroundGradient = ctx.createLinearGradient(-1*cx, -1*cy, -1*cx, -1*cy+envHeight);
		backgroundGradient.addColorStop(0, "#2b1d0e");
		backgroundGradient.addColorStop(1, "#8b5d2e");
		ctx.fillStyle = backgroundGradient;
		ctx.fillRect(-1*cx, -1*cy, envWidth, envHeight);
		ctx.restore();
		//END PLACEHOLDER BACKGROUND
		
		//Draw objects in scene
		for(var i = 0; i < this.objectsInScene.length; i++)
		{
			var currentObj = this.objectsInScene[i];
			currentObj.render(ctx, cx, cy);
		}
    };
	
	this.getPlayer = function()
	{
		return this.objectsInScene[0];
	};
	
	this.advanceScene = function()
	{
		//Todo: Create new Environment, replace current Environment with new one
	};
};