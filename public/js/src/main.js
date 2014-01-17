require.config({
	paths: {
		jquery: "/js/lib/jquery-2.0.3.min",
		lodash: "/js/lib/lodash.min",
		pathfinding: "/js/lib/pathfinding-browser.min"
	}
});
require(["Game","scenes","components","jquery"],function(Game,scenes,components,$) {
	var game = new Game();
	scenes(game);
	components(game);
	game.start();
	// workaround for performance bug in Crafty
	Crafty.viewport.clampToEntities = false;
	console.log(Crafty.frame());
});