define(["PlayScreen"],function(PlayScreen) {
	var PlayScreen = me.ScreenObject.extend({
		onResetEvent: function() {
			me.levelDirector.loadLevel("level0");
			// this.HUD = new game.HUD.Container();
			// me.game.world.addChild(this.HUD);
		}
	})
	return PlayScreen;
});