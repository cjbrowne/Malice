define(["Game"],function(Game) {
	// move this up if we need more than 255 layers of sprites
	var HUD_LAYER = 255;
	// again, move this if we need to
	var PLAYER_LAYER = 128;
	// the floor layer can be pretty low since we don't anticipate many (if any) elements appearing below the floor
	var FLOOR_LAYER = 5;
	// doors should be rendered above the player layer but below the hud layer
	var DOOR_LAYER = 200;
	return function(game) {
		Crafty.c('GridSquare',{
			init: function() {
				this.attr({
					w: Game.TILESIZE,
					h: Game.TILESIZE
				});
			},
			// Locate this entity at the given position on the grid
            at: function(x, y) {
                if (x === undefined && y === undefined) {
                    return {
                        x: this.x / Game.TILESIZE,
                        y: this.y / Game.TILESIZE
                    }
                } else {
                    this.attr({
                        x: x * Game.TILESIZE,
                        y: y * Game.TILESIZE
                    });
                    console.log("Requested location:",x,",",y);
                    console.log("Tile size:",Game.TILESIZE);
                    console.log("Entity actual location:",this.x,",",this.y);
                    return this;
                }
            }
		});
		// a grid square which is drawn to the canvas
		Crafty.c('Drawable',{
			init: function() {
				this.requires('2D, Canvas, GridSquare, DebugRectangle')
					.debugStroke('white');
			}
		});
		Crafty.c('Player',{
			init:function() {
				this.requires('Drawable, Fourway, Collision, SpriteAnimation, Color')
					.attr({
						z:PLAYER_LAYER
					})
					.fourway(4)
					.onHit('Solid',function() {
						this._speed = 0;
						if(this._movement) {
							this.x -= this._movement.x;
							this.y -= this._movement.y;
						}
					})
					.color('rgb(0,0,255)');
			}
		});
		Crafty.c('Floor',{
			init:function() {
				this.requires('Drawable, Color')
					.attr({
						z:FLOOR_LAYER,
						x:16,
						y:16
					})
					.color('rgb(255,0,0)');
			}
		});
		Crafty.c('Unknown',{
			init:function() {
				this.requires('Drawable, Color')
					.color('rgb(255,255,0)');
			}
		});
		Crafty.c('Wall',{
			init:function() {
				this.requires('Drawable,Color,Solid')
					.color('rgb(255,255,255)');
			}
		});
		Crafty.c('Door',{
			init: function() {
				this.requires('Drawable,Color')
					.attr({
						z:DOOR_LAYER
					})
					.color('rgb(128,128,128)');
			}
		});
		// HUD entities
		Crafty.c('HealthDisplay',function() {
			this.requires('2D, DOM, Text')
				.text('Health: ')
				.attr({x: 15, y: 15, w: 480, z: HUD_LAYER});
		});
	}
});