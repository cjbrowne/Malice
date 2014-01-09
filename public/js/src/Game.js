define(["jquery","Player","Level","HUD"],function($,Player,Level,HUD) {
	var Game = function() {
		this.width = 640;
		this.height = 480;
		this.player = new Player();
		this.level = new Level();
		this.hud = new HUD();
	};
	Game.prototype = {
		player: null,
		level: null,
		hud: null,
		start: function() {
			Crafty.init(this.width,this.height);
			Crafty.background("rgb(0,0,0)");
			Crafty.scene('Loading');
		}
	}
	Game.TILESIZE = 64;
	return Game;
});