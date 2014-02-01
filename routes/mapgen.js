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
        var map = mapGen.generate(64, 1, 8);
        res.json({
            seed: seed,
            version: 1,
            orientation: "isometric",
            height: 64,
            width: 64,
            tileheight: 64,
            tilewidth: 64,
            layers: [
                map
            ],
            tilesets: [{
                firstgid: 1,
                image: "/assets/map/terrain.png",
                imageheight: 32*4,
                imagewidth: 64*4,
                margin: 0,
                name: "terrain",
                properties: [],
                spacing: 0,
                tileheight: 32,
                tilewidth: 64,
            }]
        });
    }
}
