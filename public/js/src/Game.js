define(["PlayScreen","resources","Menu"],function(PlayScreen,resources,Menu) {
	var Game = function() {

	}
	Game.prototype = {
		run: function() {
			if(!me.video.init(null,800,600)) {
				alert("You need HTML5 to run this game.");
				return;
			}
			$(me.video.getScreenCanvas()).attr({id:"gameView"});
			me.loader.onload = this.postLoad.bind(this);
			me.loader.preload(resources);
			me.state.change(me.state.LOADING);
		},
		postLoad: function() {
			me.state.set(me.state.PLAY,new PlayScreen());
			me.state.set(me.state.MENU,new Menu());
			// set up system crap (e.g. we don't want gravity)
			me.sys.gravity = 0;

			me.state.change(me.state.MENU);
		}
	}
	return Game;
});