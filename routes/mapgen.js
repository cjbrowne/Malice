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
    	if(!req.params.seed) {
    		res.redirect('/map/' + createRandomSeed());
    		return;
    	}
        var seed = req.params.seed;
        var mapGen = new TerrainGenerator({
            seed: seed
        });
        var map = mapGen.generate(64, 1, 8);
        res.send({
            seed: seed,
            version: 1,
            orientation: "isometric",
            height: 64,
            width: 64,
            tileheight: 64,
            tilewidth: 64,
            map: map
        });
    }
}
