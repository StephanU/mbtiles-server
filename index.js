if (!process.argv[2]) {
  console.log("Usage: node index.js mbtiles://<path to mbtiles file>");
  console.log("e.g. node index.js mbtiles:///Users/Stephan/OSM.mbtiles");
  return;
} 

var express = require('express'),
    tilelive = require('tilelive'),
    MBTiles = require('mbtiles'),
    mbFileUrl = process.argv[2],
    port = 8888,
    app = express(),
    mbtiles = new MBTiles(mbFileUrl, function(err, myMbTiles) {
      if (err) {
        console.log("Error loading mbtiles file", err);
      }
    });

MBTiles.registerProtocols(tilelive);

app.get('/:z/:x/:y', function(req, res) {
    var x = req.param('x'),
        y = req.param('y'),
        z = req.param('z');

    mbtiles.getTile(z, x, y, function(err, tile, options) {
        if (!err) {
          res.set(options);
          res.send(tile);
        } else {
          res.send(404, 'Tile rendering error: ' + err + '\n');
        }
    });
});

console.log('Listening on port: ' + port);
app.listen(port);
