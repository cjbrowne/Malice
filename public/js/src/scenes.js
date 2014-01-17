define(["jquery"],function($) {
	return function(game) {
		Crafty.scene('Game',function() {
			$.get("/assets/map/0.lvl",function(level0) {
				game.level.load(level0);
				game.level.draw();
				Crafty.viewport.follow(game.level.player,0,0);
				Crafty.background('rgb(5,5,15)');
				game.hud.draw(game.player);
			});
		});
		Crafty.scene('Loading',function() {
			Crafty.e('2D,DOM,Text')
				.text('Loading...')
				.attr({ x: 0, y: game.height/2 - 24, w: game.width })
				.css({ 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' });
			Crafty.load(['/assets/map/tileset.png','/assets/sprites/player.png'], function() {
				Crafty.sprite(128,"/assets/map/tileset.png",{
					"WallSprite": [0,0,1,2],
					"FloorSprite": [1,1]
				});
				Crafty.sprite(128,256,"/assets/sprites/player.png",{
					"PlayerSprite":[0,0]
				});
				Crafty.scene('Game');
			});
		});
	};
});