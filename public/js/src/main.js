require.config({
	baseUrl: "js/src",
    paths: {
        jquery: "/js/lib/jquery-2.0.3.min"
    }
});
require(["jquery","Game"], function($,Game) {
    var game = new Game();
    game.run();
    var debug = false;
    $(window).on('keypress',function(evt) {
    	// TODO replace with a constant that stores the key value of the P key
    	if(evt.which == 112) {
    		$("#debug")[debug ? "show" : "hide"]();
    		debug = !debug;
    	}
    });
});
