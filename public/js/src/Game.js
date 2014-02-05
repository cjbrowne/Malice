define(["resources","Menu","PlayScreen"],function(resources,Menu,PlayScreen) {
	var RESOLUTIONS = [
		[640,360],
		[1024,576],
		[1280,720],
		[1920,1080]
	];
	var Game = function() {}
	Game.prototype = {
		run: function() {
			function get_best_res() {
				var clientHeight = $(window).height();
				var clientWidth = $(window).width();
				var available_resolutions = RESOLUTIONS.filter(function(res) {
					return (res[0] <= clientWidth && res[1] <= clientHeight);
				});
				// TODO: generate warning instead of merely falling back on lowest available resolution.
				var best_res = available_resolutions[available_resolutions.length-1] || RESOLUTIONS[0];
				malice.debug.setResolution(best_res[0],best_res[1]);
				return best_res;
			}
			var best_res = get_best_res();
			if(!me.video.init(null,best_res[0],best_res[1],true)) {
				alert("You need HTML5 to run this game.");
				return;
			}
			// TODO: currently scales tiles when resize events occur, zooming "in" or "out" in the process
			// this is undesired but may be a limitation of MelonJS.
			$(window).on('resize',function(evt) {
				var best_res = get_best_res();
				$("#gameView").css({width: best_res[0] + "px",height: best_res[1] + "px"});
				me.video.setMaxSize(best_res[0], best_res[1]);
				me.video.onresize(evt);
				me.game.viewport.adjustSize(0,best_res[0],0,best_res[1]);
				malice.debug.setResolution(best_res[0],best_res[1]);
			});
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