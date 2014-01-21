define(["PlayScreen","resources","PlayerEntity"],function(PlayScreen,resources,PlayerEntity) {
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
			me.entityPool.add('player',PlayerEntity);
			me.input.bindKey(me.input.KEY.W, "up");
			me.input.bindKey(me.input.KEY.A, "left");
			me.input.bindKey(me.input.KEY.D, "right");
			me.input.bindKey(me.input.KEY.S, "down");
			// set up system crap
			me.sys.gravity = 0;


			me.state.change(me.state.PLAY);
		}
	}
	return Game;
});