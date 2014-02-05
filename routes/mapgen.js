/*
    API for generating a map
    Version: 0.1
*/

var seedrandom = require('seedrandom');
var TerrainGenerator = require('../src/MapGenerator.js');

// helper function to create a random URL-safe seed
// note: this is hardcoded to create 32-byte seeds.  That *should* be more than enough precision, and it gives us a uniform-sized URL.

function createRandomSeed() {
    return (new Buffer(Math.seedrandom())).toString('hex', 0, 32);
}

module.exports = {
    retrieve: function(req, res) {
        var seed = req.params.seed || createRandomSeed();
        var mapGen = new TerrainGenerator(seed);
        var map = mapGen.generate(64, 1, 4);
        res.send({
            seed: seed,
            backgroundcolor: "000000",
            height: 65,
            layers: [{
                data: map.terrain,
                height: 65,
                name: "terrain",
                opacity: 1,
                type: "tilelayer",
                visible: true,
                width: 65,
                x: 0,
                y: 0
            }, {
                data: map.objects,
                height: 65,
                name: "objects",
                opacity: 1,
                type: "tilelayer",
                visible: true,
                width: 65,
                x: 0,
                y: 0
            }],
            orientation: "isometric",
            properties: {

            },
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
            }, {
                firstgid: 5,
                image: "objects.png",
                imageheight: 32,
                imagewidth: 64,
                margin: 0,
                name: "objects",
                properties: {

                },
                spacing: 0,
                tileheight: 32,
                tilewidth: 64
            }],
            tilewidth: 64,
            version: 1,
            width: 65
        });
    }
}
