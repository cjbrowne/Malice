define(["jquery","Player"],function($,Player) {
	var Game = function() {
		this.width = 640;
		this.height = 480;
		this.player = new Player();
	};
	Game.prototype = {
		player: null,
		start: function() {
			Crafty.init(this.width,this.height);
			Crafty.background("rgb(0,0,0)");
			Crafty.scene('Loading');
		}
	}
	Game.TILESIZE = 64;
	return Game;
});