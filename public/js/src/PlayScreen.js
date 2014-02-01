define(["PlayScreen","HUD"],function(PlayScreen,HUD) {
	return me.ScreenObject.extend({
		init: function() {
			this.HUD = new HUD();
			me.game.world.addChild(this.HUD);
		}
	});
});