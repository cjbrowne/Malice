require.config({
	baseUrl: "js/src",
    paths: {
        jquery: "/js/lib/jquery-2.0.3.min"
    }
});
require(["jquery","Game"], function($,Game) {
    var game = new Game();
    game.run();
});
