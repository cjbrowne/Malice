define(["Game","pathfinding"],function(Game,PF) {
	// move this up if we need more than 255 layers of sprites
	var HUD_LAYER = 255;
	// again, move this if we need to
	var PLAYER_LAYER = 128;
	// the floor layer can be pretty low since we don't anticipate many (if any) elements appearing below the floor
	var FLOOR_LAYER = 5;
	// doors should be rendered above the player layer but below the hud layer
	var DOOR_LAYER = 200;
	// walls should be above the player, above the floor but below the HUD
	var WALL_TOP_LAYER = 200; 
	// but the bottom half of the wall should be below the player, above the floor and below the HUD
	var WALL_BOTTOM_LAYER = 64;
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
						z:PLAYER_LAYER,
						w: Game.TILESIZE / 2,
						h: Game.TILESIZE * 0.75
					})
					.multiway({W: -90, S: 90, D: 0, A: 180})
					.color('rgb(0,0,255)')
					.collision(
						new Crafty.polygon(
							[0,16],
							[this.w,this.h/4],
							[this.w,this.h*0.75],
							[0,this.h*0.75]
						)
					)
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
					;
				this._mbr = {
					_w: this.w,
					_h: this.h*0.25,
					_x: 0,
					_y: this.h*0.75
				}
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
				this.requires('Drawable, FloorSprite')
					.attr({
						z:FLOOR_LAYER
					});
			}
		});
		Crafty.c('Unknown',{
			init:function() {
				this.requires('Drawable, Color')
					.attr({
						z:HUD_LAYER-1
					})
					.color('rgb(255,0,255)');
			}
		});
		Crafty.c('WallTop',{
			init:function() {
				this.requires('Drawable, Solid, WallTopSprite')
					.attr({
						z:WALL_TOP_LAYER
					});
				this._mbr = {
					_w: this.w,
					_h: this.h*0.50,
					_x: 0,
					_y: this.h*0.50
				}
			}
		});
		Crafty.c('WallBottom',{
			init:function() {
				this.requires('Drawable, Solid, WallBottomSprite')
					.attr({
						z:WALL_BOTTOM_LAYER
					});
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
						z: PLAYER_LAYER,
						w: Game.TILESIZE / 2,
						h: Game.TILESIZE * 0.75
					})
					.color('rgb(256,0,0)')
					.onHit('Player',function() {
						game.player.addRealHealth(5);
						game.player.removeFakeHealth(5);
					});
				var enemy = this;
				requestAnimationFrame(function() { enemy.tick() });
				this.lastPathCalc = new Date();
			},
			recalculatePath: function() {
				this.grid = game.level.navGrid.clone();
				var finder = new PF.AStarFinder({
					allowDiagonal: true,
					dontCrossCorners: true,
					heuristic: PF.Heuristic.euclidean
				});
				this.path = finder.findPath(
					Math.floor(this.x/Game.TILESIZE),
					Math.floor(this.y/Game.TILESIZE),
					Math.floor(this.moveTarget.x/Game.TILESIZE),
					Math.floor(this.moveTarget.y/Game.TILESIZE),
				this.grid);
				this.path.reverse();
				/* lerp the path to make it smootherer */
				var len = this.path.length;
				for(var i = 0; i < len-1; i++) {
					var newNode = [
						Crafty.math.lerp(this.path[i][0],this.path[i+1][0],0.5),
						Crafty.math.lerp(this.path[i][1],this.path[i+1][1],0.5)
					];
					this.path.splice(i,0,newNode);
				}
				this.nextPos = this.path.pop();
				this.state = "moving";
			},
			tick: function() {
				var time = new Date();
				if(time.getTime() - this.lastPathCalc.getTime() > 500) {
					var currentPosition = new Crafty.math.Vector2D(this.x,this.y);
					var playerPosition = new Crafty.math.Vector2D(game.player.x,game.player.y);
					if(currentPosition.distanceSq(playerPosition) < Math.pow(5 * Game.TILESIZE,2)) {
						this.moveTarget.setValues(playerPosition);
						this.state = "pathing";
						this.recalculatePath();
						this.lastPathCalc = new Date();
					} else {
						// stop moving if the player leaves the radius
						this.state = "idle";
					}
				}
				if(this.state == "moving") {
					var speed = 1;
					if(this.nextPos[0] * Game.TILESIZE == this.x && this.nextPos[1] * Game.TILESIZE == this.y) {
						this.nextPos = (this.path.pop() || [game.player.x/Game.TILESIZE,game.player.y/Game.TILESIZE]);
					}
					if(this.nextPos[0] * Game.TILESIZE < this.x) {
						this.x -= speed;
					} else if(this.nextPos[0] * Game.TILESIZE > this.x) {
						this.x += speed;
					}
					if(this.nextPos[1] * Game.TILESIZE < this.y) {
						this.y -= speed;
					} else if(this.nextPos[1] * Game.TILESIZE > this.y) {
						this.y += speed;
					}
				}
				var enemy = this;
				requestAnimationFrame(function() { enemy.tick(); });
			}
		});
	}
});