var Hike = require('../models/hike');

exports.getHostedHike = function(req, res) {

    Hike.find({
        'driver': req.query.driver
    }, function(err, hikeData) {
        console.log(hikeData);
        if (err) throw err;
        res.send(hikeData);
    })
}