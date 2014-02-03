define(["resources","Menu"],function(resources,Menu) {
	var RESOLUTIONS = [
		[640,360],
		[1024,576],
		[1280,720],
		[1920,1080]
	];
	var Game = function() {

	}
	Game.prototype = {
		run: function() {
			var available_resolutions = RESOLUTIONS.filter(function(res) {
				return (res[0] <= $(window).width() && res[1] <= $(window).height());
			});
			var best_res = available_resolutions[available_resolutions.length-1];
			console.log(available_resolutions,best_res);
			if(!me.video.init(null,best_res[0],best_res[1])) {
				alert("You need HTML5 to run this game.");
				return;
			}
			$(me.video.getScreenCanvas()).attr({id:"gameView"});
			me.loader.onload = this.postLoad.bind(this);
			me.loader.preload(resources);
			me.state.change(me.state.LOADING);
		},
		postLoad: function() {
			me.state.set(me.state.MENU,new Menu());
			// set up system crap (e.g. we don't want gravity)
			me.sys.gravity = 0;

			me.state.change(me.state.MENU);
		}
	}
	return Game;
});