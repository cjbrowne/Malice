define(["PlayScreen","HUD"],function(PlayScreen,HUD) {
	return me.ScreenObject.extend({
		init: function() {
			this.parent(true);
			this.HUD = new HUD();
			me.game.world.addChild(this.HUD);
		},

		onResetEvent: function() {
			me.levelDirector.loadLevel("map");
		},

		update: function() {

		},

		draw: function(context) {
			
		},

		onDestroyEvent: function() {
		}
	});
});