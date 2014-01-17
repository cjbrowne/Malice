define(["lodash","pathfinding","Game"],function(_,PF,Game) {
	var Level = function() {};
	Level.prototype = {
		player: null,
		map: {
			tiles: [],
			width: 0,
			height: 0
		},
		load: function(data) {
			this.map.tiles = [];
			this.map.width = 0;
			this.map.height = 0;
			if(!_.isArray(data)) {
				data = data.split('\n');
			}
			this.map.height = data.length;
			for(var y = 0; y < data.length; y++) {
				for(var x = 0; x < data[y].length; x++) {
					switch(data[y][x]) {
						case '.': {
							this.map.tiles.push({
								type: "floor",
								x: x,
								y: y
							});
							break;
						}
						case 'P': {
							this.map.tiles.push({
								type: "playerSpawn",
								x: x,
								y: y
							});
							break;
						}
						case '#': {
							this.map.tiles.push({
								type: "wall",
								x: x,
								y: y
							});
							break;
						}
						case ',': {
							this.map.tiles.push({
								type: "clutter",
								x: x,
								y: y
							});
							break;
						}
						case '/': {
							this.map.tiles.push({
								type: "door",
								x: x,
								y: y
							});
							break;
						}
						case '+': {
							this.map.tiles.push({
								type: "health",
								x: x,
								y: y
							});
							break;
						}
						// silently ignore 'plain' whitespace, it represents a 'void' tile
						case ' ': {
							break;
						}
						case 'e': {
							this.map.tiles.push({
								type: "enemy",
								x: x,
								y: y
							});
							break;
						}
						case '\t': {
							console.log("Warning: tab character detected.  Please strip the file of tab characters as they can seriously corrupt the shape of the map.");
							break;
						}
						default: {
							console.log("Unrecognised character at ",x,",",y,": \"", data[y][x], "\"");
							this.map.tiles.push({
								type:"unknown",
								x: x,
								y: y
							});
							break;
						}
					}
				}
				if(data[y].length > this.map.width) {
					this.map.width = data[y].length;
				}
			}
			console.log("Level loaded.  Width:", this.map.width, "Height:", this.map.height);
			console.log("Calculating navigation grid (for AI movement)");
			this.navGrid = new PF.Grid(this.map.width,this.map.height);
			var solidTiles = this.map.tiles.filter(function(tile) {
				return (tile.type == "wall");
			});
			for(var i = 0; i < solidTiles.length; i++) {
				var t = solidTiles[i];
				this.navGrid.setWalkableAt(t.x,t.y,false);
			}
			console.log("Navigation grid ready");
		},
		draw: function() {
			console.log("Drawing map with", this.map.tiles.length, "tiles");
			for(var i = 0; i < this.map.tiles.length; i++) {
				var tile = this.map.tiles[i];
				switch(tile.type) {
					case "floor": {
						Crafty.e('Floor').at(tile.x,tile.y);
						break;
					}
					case "wall": {
						// draw walls one tile "higher" than their base position (kinda a dirty hack)
						Crafty.e('WallTop').at(tile.x,tile.y);
						Crafty.e('WallBottom').at(tile.x,tile.y+1);
						break;
					}
					case "playerSpawn": {
						if(this.player) {
							throw new Error("Cannot spawn player twice in one level!");
						}
						console.log("Spawning player at",tile.x,",",tile.y);
						// spawn a floor tile below the player
						Crafty.e('Floor').at(tile.x,tile.y);
						this.player = Crafty.e('Player').at(tile.x,tile.y);
						break;
					}
					case "door": {
						Crafty.e('Door').at(tile.x,tile.y);
						Crafty.e('Floor').at(tile.x,tile.y);
						break;
					}
					case "health": {
						Crafty.e('HealthPack').at(tile.x,tile.y);
						Crafty.e('Floor').at(tile.x,tile.y);
						break;
					}
					case "enemy": {
						Crafty.e('Enemy').at(tile.x,tile.y);
						Crafty.e('Floor').at(tile.x,tile.y);
					}
					default: {
						// draw a ? because it's an unknown tile type but a tile does exist here
						Crafty.e('Unknown').at(tile.x,tile.y);
						break;
					}
				}
			}
			if(!this.player) {
				throw new Error("Player not spawned in level.  Perhaps the map is corrupted?");
			}
		}
	}
	return Level;
});