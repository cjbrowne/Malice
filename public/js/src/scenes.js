define(["jquery","Level","HUD"],function($,Level,HUD) {
	return function(game) {
		Crafty.scene('Game',function() {
			var level = new Level();
			var hud = new HUD();
			$.get("/assets/map/0.lvl",function(level0) {
				level.load(level0);
				level.draw();
				Crafty.viewport.follow(level.player,0,0);
				Crafty.background('rgb(5,5,15)');
				hud.draw();
			});
		});
		Crafty.scene('Loading',function() {
			Crafty.e('2D,DOM,Text')
				.text('Loading...')
				.attr({ x: 0, y: game.height/2 - 24, w: game.width })
				.css({ 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' });
			Crafty.load(['/assets/map/tileset.png','/assets/sprites/player.png'], function() {
				Crafty.sprite(64,"/assets/map/tileset.png",{

				});
				Crafty.sprite(64,128,"/assets/sprites/player.png",{
					"PlayerSprite":[0,0]
				});
				Crafty.scene('Game');
			});
		});
	};
});