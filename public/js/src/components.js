define(["Game","pathfinding"],function(Game,PF) {
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
                    return this;
                }
            }
		});
		// a grid square which is drawn to the canvas
		Crafty.c('Drawable',{
			init: function() {
				this.requires('2D, Canvas, GridSquare');
			}
		});
		Crafty.c('Player',{
			init:function() {
				this.requires('Drawable, Collision, Multiway, SpriteAnimation, Color, Keyboard')
					.attr({
						z:PLAYER_LAYER
					})
					.multiway({W: -90, S: 90, D: 0, A: 180})
					.onHit('Solid',function() {
						this._speed = 0;
						if(this._movement) {
							this.x -= this._movement.x;
							this.y -= this._movement.y;
						}
					})
					.onHit('HealthPack',function(data) {
						game.player.addFakeHealth(5);
						game.player.removeRealHealth(5);
						data[0].obj.destroy();
					})
					.color('rgb(0,0,255)');
				this.bind('EnterFrame',function() {
					game.player.x = this.x;
					game.player.y = this.y;
				});
				this.bind('Moved',function() {
					Crafty.trigger('PlayerMoved',new Crafty.math.Vector2D(this.x,this.y));
				});
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
					.color('rgb(128,128,128)');
			}
		});
		Crafty.c('Unknown',{
			init:function() {
				this.requires('Drawable, Color')
					.color('rgb(255,0,255)');
			}
		});
		Crafty.c('Wall',{
			init:function() {
				this.requires('Drawable,Color,Solid')
					.color('rgb(64,64,64)');
			}
		});
		Crafty.c('Door',{
			init: function() {
				this.requires('Drawable, Color')
					.attr({
						z:DOOR_LAYER
					})
					.color('rgba(0,0,128,0.7)');
			}
		});
		Crafty.c('HealthPack',{
			init: function() {
				this.requires('Drawable, Color')
					.attr({
						z: FLOOR_LAYER+1
					})
					.color('rgb(0,200,0)');
			}
		});
		Crafty.c('Enemy',{
			moveTarget: new Crafty.math.Vector2D(),
			path: [],
			moving: false,
			init: function() {
				this.requires('Drawable, Color, Collision')
					.attr({
						z: PLAYER_LAYER
					})
					.color('rgb(256,0,0)')
					.onHit('Player',function() {
						game.player.addRealHealth(5);
						game.player.removeFakeHealth(5);
						this._speed = 0;
						if(this._movement) {
							this.x -= this._movement.x;
							this.y -= this._movement.y;
						}
					});
				this.bind('PlayerMoved',function(playerPosition) {
					var currentPosition = new Crafty.math.Vector2D(this.x,this.y);
					if(currentPosition.distanceSq(playerPosition) < Math.pow(5 * Game.TILESIZE,2)) {
						this.moveTarget.setValues(playerPosition);
						this.recalculatePath();
						this.state = "moving";
					} else {
						// stop moving if the player leaves the radius
						this.state = "idle";
					}
				});
				var enemy = this;
				setInterval(function() { enemy.tick() },500);
			},
			recalculatePath: function() {
				var grid = game.level.navGrid.clone();
				var finder = new PF.AStarFinder();
				this.path = finder.findPath(Math.floor(this.x/64),Math.floor(this.y/64),Math.floor(this.moveTarget.x/64),Math.floor(this.moveTarget.y/64),grid);
				this.path.reverse();
				this.tick();
			},
			tick: function() {
				if(this.state == "moving") {
					var nextPos = this.path.pop();
					if(nextPos) {
						this.x = nextPos[0]*64;
						this.y = nextPos[1]*64;
					}
				}
			}
		});
	}
});