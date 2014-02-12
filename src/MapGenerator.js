/*
    Original: https://github.com/loktar00/Javascript-Canvas-Terrain-Generator/blob/master/js/canvasTerrain.js

    Modifications made by Christopher Browne, 2014

*/

function MapGenerator(seed) {
    "use strict";

    this.TERRAIN_TYPES = {
        OCEAN: 4,
        SAND: 1,
        GRASS: 3,
        URBAN: 2
    };

    this.OBJECT_TYPES = {
        forest: {
            gid: 5,
            requires: [this.TERRAIN_TYPES.GRASS],
            chance: 0.25
        }
    };

    this.BUILDING_TYPES = {
        PLAYER_BASE: 6
    }

    this.player_pos = null;
}
MapGenerator.prototype = {

    generate: function(mapDimension, unitSize, roughness) {
        this.mapDimension = mapDimension;
        this.unitSize = unitSize;
        this.roughness = roughness;
        this.terrain = this.create2DArray(this.mapDimension + 1, this.mapDimension + 1);
        this.objects = this.create2DArray(this.mapDimension + 1, this.mapDimension + 1);
        this.player = this.create2DArray(this.mapDimension + 1, this.mapDimension + 1);
        this.startDisplacement();
        this.threshold();
        return {
            terrain: this.fold(this.terrain),
            objects: this.fold(this.objects),
            player: this.fold(this.player),
            player_pos: this.player_pos
        }
    },

    // Setup the map array for use

    create2DArray: function(d1, d2) {
        var x = new Array(d1),
            i = 0,
            j = 0;

        for (i = 0; i < d1; i += 1) {
            x[i] = new Array(d2);
        }

        return x;
    },

    // Starts off the map generation, seeds the first 4 corners

    startDisplacement: function() {
        var tr, tl, t, br, bl, b, r, l, center;

        // top left
        this.terrain[0][0] = Math.random();
        tl = this.terrain[0][0];

        // bottom left
        this.terrain[0][this.mapDimension] = Math.random();
        bl = this.terrain[0][this.mapDimension];

        // top right
        this.terrain[this.mapDimension][0] = Math.random();
        tr = this.terrain[this.mapDimension][0];

        // bottom right
        this.terrain[this.mapDimension][this.mapDimension] = Math.random();
        br = this.terrain[this.mapDimension][this.mapDimension];

        // Center
        this.terrain[this.mapDimension / 2][this.mapDimension / 2] = this.terrain[0][0] + this.terrain[0][this.mapDimension] + this.terrain[this.mapDimension][0] + this.terrain[this.mapDimension][this.mapDimension] / 4;
        this.terrain[this.mapDimension / 2][this.mapDimension / 2] = this.normalize(this.terrain[this.mapDimension / 2][this.mapDimension / 2]);
        center = this.terrain[this.mapDimension / 2][this.mapDimension / 2];

        /* Non wrapping terrain */
        this.terrain[this.mapDimension / 2][this.mapDimension] = bl + br + center / 3;
        this.terrain[this.mapDimension / 2][0] = tl + tr + center / 3;
        this.terrain[this.mapDimension][this.mapDimension / 2] = tr + br + center / 3;
        this.terrain[0][this.mapDimension / 2] = tl + bl + center / 3;


        // Call displacment
        this.midpointDisplacement(this.mapDimension);
    },

    // Workhorse of the terrain generation.

    midpointDisplacement: function(dimension) {
        var newDimension = dimension / 2,
            top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
            x = 0,
            y = 0,
            i = 0,
            j = 0;

        if (newDimension > this.unitSize) {
            for (i = newDimension; i <= this.mapDimension; i += newDimension) {
                for (j = newDimension; j <= this.mapDimension; j += newDimension) {
                    x = i - (newDimension / 2);
                    y = j - (newDimension / 2);

                    topLeft = this.terrain[i - newDimension][j - newDimension];
                    topRight = this.terrain[i][j - newDimension];
                    bottomLeft = this.terrain[i - newDimension][j];
                    bottomRight = this.terrain[i][j];

                    // Center
                    this.terrain[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + this.displace(dimension);
                    this.terrain[x][y] = this.normalize(this.terrain[x][y]);
                    center = this.terrain[x][y];

                    // Top
                    if (j - (newDimension * 2) + (newDimension / 2) > 0) {
                        this.terrain[x][j - newDimension] = (topLeft + topRight + center + this.terrain[x][j - dimension + (newDimension / 2)]) / 4 + this.displace(dimension);
                    } else {
                        this.terrain[x][j - newDimension] = (topLeft + topRight + center) / 3 + this.displace(dimension);
                    }

                    this.terrain[x][j - newDimension] = this.normalize(this.terrain[x][j - newDimension]);

                    // Bottom
                    if (j + (newDimension / 2) < this.mapDimension) {
                        this.terrain[x][j] = (bottomLeft + bottomRight + center + this.terrain[x][j + (newDimension / 2)]) / 4 + this.displace(dimension);
                    } else {
                        this.terrain[x][j] = (bottomLeft + bottomRight + center) / 3 + this.displace(dimension);
                    }

                    this.terrain[x][j] = this.normalize(this.terrain[x][j]);


                    //Right
                    if (i + (newDimension / 2) < this.mapDimension) {
                        this.terrain[i][y] = (topRight + bottomRight + center + this.terrain[i + (newDimension / 2)][y]) / 4 + this.displace(dimension);
                    } else {
                        this.terrain[i][y] = (topRight + bottomRight + center) / 3 + this.displace(dimension);
                    }

                    this.terrain[i][y] = this.normalize(this.terrain[i][y]);

                    // Left
                    if (i - (newDimension * 2) + (newDimension / 2) > 0) {
                        this.terrain[i - newDimension][y] = (topLeft + bottomLeft + center + this.terrain[i - dimension + (newDimension / 2)][y]) / 4 + this.displace(dimension);
                    } else {
                        this.terrain[i - newDimension][y] = (topLeft + bottomLeft + center) / 3 + this.displace(dimension);
                    }

                    this.terrain[i - newDimension][y] = this.normalize(this.terrain[i - newDimension][y]);
                }
            }
            this.midpointDisplacement(newDimension);
        }
    },

    // Random function to offset the center

    displace: function(num) {
        var max = num / (this.mapDimension + this.mapDimension) * this.roughness;
        return (Math.random() - 0.5) * max;
    },

    // Normalize the value to make sure its within bounds

    normalize: function(value) {
        if (value > 1) {
            value = 1;
        } else if (value < 0) {
            value = 0;
        }
        return value;
    },

    // actually the potatoes in our meat+potatoes 2-pass algorithm
    // there are hysterical raisins for the misnomer
    threshold: function() {
        var base_placed = false;
        for (var x = 0; x < this.terrain.length; x++) {
            for (var y = 0; y < this.terrain[x].length; y++) {
                if (this.terrain[x][y] > 0.99) {
                    this.terrain[x][y] = this.TERRAIN_TYPES.URBAN;
                } else if (this.terrain[x][y] > 0.6) {
                    this.terrain[x][y] = this.TERRAIN_TYPES.GRASS;
                } else if (this.terrain[x][y] > 0.5) {
                    this.terrain[x][y] = this.TERRAIN_TYPES.SAND;
                } else {
                    this.terrain[x][y] = this.TERRAIN_TYPES.OCEAN;
                }
                this.objects[x][y] = this.placeObject(this.terrain[x][y]);
                // for now, we're going to just use a very naïve algorithm for placing the base which only places
                // bases on grass tiles that *don't* have a forest on the tile
                // later on, we want to replace this with an algorithm which chooses the place on the map which is most
                // remote, just to be annoying.  We might also demolish forests within, say, a 10 tile radius of the
                // base just for added arsiness.
                if (!base_placed && this.terrain[x][y] == this.TERRAIN_TYPES.GRASS && this.objects[x][y] == 0
                    // 15% chance of spawning if the tile is in the first 3/4 of the map, guaranteed spawn if we're running
                    // rapidly out of potential tiles and need to ensure the player actually starts somewhere!
                    && (Math.random() < 0.15 || (x > this.mapDimension-(this.mapDimension/4) && y > this.mapDimension-(this.mapDimension/4)))
                    ) {
                        this.player[x][y] = this.BUILDING_TYPES.PLAYER_BASE;
                        this.player_pos = {x: x, y: y};
                        base_placed = true;
                } else {
                    this.player[x][y] = 0;
                }
            }
        }
    },

    placeObject: function(terrain_type) {
        var rv = 0;
        for (t in this.OBJECT_TYPES) {
            var type = this.OBJECT_TYPES[t];
            if (type.requires.indexOf(terrain_type) != -1 && Math.random() > type.chance) {
                rv = type.gid;
                break;
            }
        }
        return rv;
    },

    fold: function(map) {
        var folded = [];
        map.forEach(function(col) {
            col.forEach(function(item) {
                folded.push(item);
            });
        });
        return folded;
    }
}

module.exports = MapGenerator;
