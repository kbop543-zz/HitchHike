var Hike = require('../models/hike');

// Get all rides
exports.getAllHikes = function(req, res) {
    console.log('getAllHikes');

    // Get all hikes
    Hike.find({}, function(err, allHikes) {
        if (err) throw err;

        // Send back all hikes
        console.log(allHikes);
        res.send(allHikes);
    });
};

// Get the riders for a specific ride
exports.getRiders = function(req, res) {
    console.log('getRiders');

    // Get all hikes
    Hike.find({
        'driver': req.query.driver,
        'departureDate': req.query.departureDate
    }, function(err, hikeData) {
        if (err) throw err;

        // Send back all hikes
        console.log(hikeData);
        res.send(hikeData);
    });


}


function toDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\-\d{1,2}\-\d{4}$/.test(dateString))
        return null;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);
    console.log(day);
    console.log(month);
    console.log(year);


    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return null;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    var string = year + '/' + month + '/' + day;

    // Check the range of the day
    if( day > 0 && day <= monthLength[month - 1]){
        return new Date(string);
    }else{
        return null;
    }
};

// Create new hike
exports.addNewHike = function(req, res) {
    console.log('addNewHike');
    var tempDeparture;
    var tempArrival;


    var today = new Date();
    var departureDate = toDate(req.body.departureDate);
    var arrivalDate = toDate(req.body.arrivalDate);

    tempDeparture = req.body.departureDate;
    req.body.departureDate = departureDate;
    console.log(req.body.departureDate);

    tempArrival = req.body.arrivalDate;
    req.body.arrivalDate = arrivalDate;
    console.log(req.body.arrivalDate);



    //Valdiation for the sign up
    req.checkBody({
        'departureDate': {
            isDate: {
                errorMessage: 'Enter a valid departure date.'
            }
        },
        'arrivalDate': {
            isDate: {
                errorMessage: 'Enter a valid arrival date.'
            }
        },
        'capacity': {
            isNumeric: {
                errorMessage: 'Enter a valid number.'
            }
        },
        'price': {
            isInt: {
                errorMessage: 'Enter a valid number.'
            }
        },

    });

    var errors = req.validationErrors();

    // Check if any errors
    if (errors) {
        res.status(500).send('Server validation error!');

    } else if (departureDate > arrivalDate) {
        res.status(500).send('Departure Date can not be after arrival date.');
    } else if (departureDate < today) {
        res.status(500).send("Departure Date can not be before today's date.");

    } else if(req.body.origin.toUpperCase() == req.body.destination.toUpperCase()){
        res.status(500).send('Origin and destination can not be the same');
    }
     else {

        // Set up the new hike data
        var hikeInfo = req.body;
        hikeInfo['driver'] = req.session.username;


        // Create a new hike
        var newHike = new Hike(hikeInfo);
        newHike.departureDate = tempDeparture;
        newHike.arrivalDate = tempArrival;

        Hike.findOne({
        'driver': req.session.username,
        'departureDate': tempDeparture}, function(err, hike) {
            if (err) throw err;

            if(hike != undefined){
                res.status(500).send('Can not have the same departure date for more than one hike.');
            }else{

                // Save hike
                newHike.save(function(err, newHike) {
                    if (err) {
                        throw err;
                    } else {

                        // Send back success message
                        res.send('Success');
                    }
                });
            }
    })
}
}

// Delete hike by key
exports.deleteHike = function(req, res) {
    console.log('deleteHike');

    // Remove hike by key
    Hike.remove({
        'driver': req.query.driver,
        'departureDate': req.query.departureDate
    }, function(err) {
        if (err) throw err;
        console.log('Hike deleted');
        res.send('Success');
    });
};

// Register a ride
exports.registerRide = function(req, res) {
    console.log('registerRide');
    console.log(req.body);

    Hike.findOne({
        'driver': req.body.driver,
        'departureDate': req.body.departureDate
    }, function(err, hike) {
        if (err) throw err;
        console.log(hike.riders);

        var userIndex = hike.riders.indexOf(req.session.username);

        console.log(userIndex);

        // Add user
        if (userIndex == -1) {

            // Hike is full
            if (hike.size + 1 > hike.capacity) {
                console.log('Hike is full, user cannot join this hike.')
                res.status(500).send('This hike is already full');
            }
            // Hike is not full
            else {
                hike.size++;
                hike.riders.push(req.session.username);
                hike.save(function(err) {
                    if (err) throw err;
                    console.log('User has joined this hike');
                    res.send(hike);
                });
            }
        }
        // Delete user
        else {
            hike.riders.pull(req.session.username);
            hike.size--;
            hike.save(function(err) {
                console.log('User has been removed from this hike');
                if (err) throw err;
                res.send(hike);
            });
        }
    });
}
