define(["Game"],function(Game) {
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
						z:1 // place the player on layer "1"
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
						z:0, // make sure all 'floor' tiles are on layer "0"
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
	}
});