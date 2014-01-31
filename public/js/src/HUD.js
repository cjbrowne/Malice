define(function() {
	return me.ObjectContainer.extend({
		init: function() {
			this.parent();
			this.isPersistent = true;
			this.collidable = false;
			this.z = Infinity;
			this.name = "HUD";
			// set up the hud below
		}
	});
});