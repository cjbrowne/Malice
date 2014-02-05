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
			var clientHeight = $(window).height();
			var clientWidth = $(window).width();
			var available_resolutions = RESOLUTIONS.filter(function(res) {
				return (res[0] <= clientWidth && res[1] <= clientHeight);
			});
			// TODO: generate warning instead of merely falling back on lowest available resolution.
			var best_res = available_resolutions[available_resolutions.length-1] || RESOLUTIONS[0];
			// TODO: create MaliceDebug object to handle all the debug information
			$("#debug_res").text(best_res[0] + "x" + best_res[1]);
			if(!me.video.init(null,best_res[0],best_res[1],true)) {
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