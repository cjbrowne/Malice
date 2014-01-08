require.config({
	paths: {
		jquery: "/js/lib/jquery-2.0.3.min",
		lodash: "/js/lib/lodash.min"
	}
});
require(["Game","scenes","components"],function(Game,scenes,components) {
	var game = new Game();
	scenes(game);
	components(game);
	game.start();
});