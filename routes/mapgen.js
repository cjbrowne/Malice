/*
    API for generating a map
    Version: 0.1
*/

var seedrandom = require('seedrandom');
var TerrainGenerator = require('../src/canvasTerrain.js');

// helper function to create a random URL-safe seed
// note: this is hardcoded to create 32-byte seeds.  That *should* be more than enough precision, and it gives us a uniform-sized URL.

function createRandomSeed() {
    return (new Buffer(Math.seedrandom())).toString('hex', 0, 32);
}

module.exports = {
    retrieve: function(req, res) {
        var seed = req.params.seed || createRandomSeed();
        var mapGen = new TerrainGenerator({
            seed: seed
        });
        var map = mapGen.generate(64, 1, 4);
        res.send({
            backgroundcolor: "000000",
            height: 65,
            layers: [{
                data: map,
                height: 65,
                name: "Terrain",
                opacity: 1,
                type: "tilelayer",
                visible: true,
                width: 65,
                x: 0,
                y: 0
            }],
            orientation: "isometric",
            tileheight: 32,
            tilesets: [{
                firstgid: 1,
                image: "terrain.png",
                imageheight: 32,
                imagewidth: 256,
                margin: 0,
                name: "terrain",
                properties: {

                },
                spacing: 0,
                tileheight: 32,
                tileoffset: {
                    x: 0,
                    y: 0
                },
                tilewidth: 64
            }],
            tilewidth: 64,
            version: 1,
            width: 65
        });
    }
}
