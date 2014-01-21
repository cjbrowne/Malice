define(function() {
	return me.ObjectEntity.extend({
		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.setVelocity(4,4);
			me.game.viewport.follow(this.pos,me.game.viewport.AXIS.BOTH);
		},
		update: function() {
			// lateral movement
			if (me.input.isKeyPressed('left')) {
	            this.vel.x -= this.accel.x * me.timer.tick;
	        } else if (me.input.isKeyPressed('right')) {
	            this.vel.x += this.accel.x * me.timer.tick;
	        } else {
	            this.vel.x = 0;
	        }
	        // long movement
	        if(me.input.isKeyPressed('up')) {
	        	this.vel.y -= this.accel.y * me.timer.tick;
	        } else if(me.input.isKeyPressed('down')) {
	        	this.vel.y += this.accel.y * me.timer.tick;
	        } else {
	        	this.vel.y = 0;
	        }
	 
	        // check & update player movement
	        this.updateMovement();
	 
	        // update animation if necessary
	        if (this.vel.x!=0 || this.vel.y!=0) {
	            // update object animation
	            this.parent();
	            return true;
	        }
	         
	        // else inform the engine we did not perform
	        // any update (e.g. position, animation)
	        return false;
		}
	});
});