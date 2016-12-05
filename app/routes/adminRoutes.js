var User = require('../models/user.js');
var Hike = require('../models/hike.js');

//Initalize database
exports.setDatabase = function(req, res) {
    console.log("initialize database");

    var user1 = new User({
        usertype: 0,
        username: 'kyra',
        password: 'kyra',
        firstName: 'Kyra',
        lastName: 'Stephen',
        driver: 1,
        licensePlate: 'JA345',
        carModel: 'Nisan',
        email: 'kyra@email.com'
    })

    user1.save(function(err) {
        if (err) throw err;
    });

    var user2 = new User({
        usertype: 0,
        username: 'miranda',
        password: 'miranda',
        firstName: 'Miranda',
        lastName: 'Le',
        driver: 1,
        licensePlate: 'KIT811',
        carModel: 'Honda',
        email: 'mir@email.com'
    })

    user2.save(function(err) {
        if (err) throw err;
    });

    var user3 = new User({
        usertype: 0,
        username: 'phillip',
        password: 'phillip',
        firstName: 'Phillip',
        lastName: 'Liu',
        driver: 1,
        licensePlate: 'RIC715',
        carModel: 'BMW',
        email: 'phil@email.com'
    })
    user3.save(function(err) {
        if (err) throw err;
    });

    var user4 = new User({
        usertype: 0,
        username: 'kelvin',
        password: 'kelvin',
        firstName: 'Kelvin',
        lastName: 'Lai',
        driver: 1,
        licensePlate: 'MISS345',
        carModel: 'Toyota',
        email: 'kel@email.com'
    })
    user4.save(function(err) {
        if (err) throw err;
    });

    var hike1 = new Hike({
        origin: 'Toronto',
        destination: 'Montreal',
        departureDate: '11-26-2016',
        arrivalDate: '11-26-2016',
        capacity: 5,
        driver: 'kyra',
        size: 0,
        price: 50
    })
    hike1.save(function(err) {
        if (err) throw err;
    });

    var hike2 = new Hike({
        origin: 'Mississauga',
        destination: 'Toronto',
        departureDate: '11-27-2016',
        arrivalDate: '11-27-2016',
        capacity: 7,
        driver: 'miranda',
        size: 0,
        price: 20
    })
    hike2.save(function(err) {
        if (err) throw err;
    });

    var hike3 = new Hike({
        origin: 'New York',
        destination: 'Ottawa',
        departureDate: '11-28-2016',
        arrivalDate: '11-30-2016',
        capacity: 5,
        driver: 'phillip',
        size: 0,
        price: 100
    })
    hike3.save(function(err) {
        if (err) throw err;
    });

    var hike4 = new Hike({
        origin: 'Calgary',
        destination: 'Vancouver',
        departureDate: '12-10-2016',
        arrivalDate: '12-15-2016',
        capacity: 10,
        driver: 'kelvin',
        size: 0,
        price: 70
    })
    hike4.save(function(err) {
        if (err) throw err;
    });

    res.send("Success");
}

// Reset user db
exports.resetUserDB = function(req, res) {
    console.log("resetUserDB");

    // Remove all users
    User.remove({}, function(err) {
        if (err) throw err;

        // Remove session cookie and send back success message
        req.session.username = null;
        res.send('Users database has been reset');
    });
};

// Reset hikes db
exports.resetHikesDB = function(req, res) {
    console.log('Reset Hikes DB');

    // Remove all hikes
    Hike.remove({}, function(err) {
        if (err) throw err;

        // Send back success message
        res.send('Hikes database has been reset');
    });
};

// Add a new user
exports.addUser = function(req, res) {
    console.log("addUser");
    console.log(req.body);

    //Valdiation for the adding a user
    req.checkBody({
        'email': {
            isEmail: {
                errorMessage: 'Enter a valid email address.'
            }
        },
        'username': {
            isAlphanumeric: {
                errorMessage: 'Enter a valid username.'
            },
            isLength: {
                options: [{
                    min: 2
                }],
                errorMessage: 'Enter a valid username length.'
            }
        },
        'password': {
            isAlphanumeric: {
                errorMessage: 'Enter a valid username.'
            },
            isLength: {
                options: [{
                    min: 2,
                    max: 32
                }],
                errorMessage: 'Enter a valid username.'
            }
        },
        'firstName': {
            isAlpha: {
                errorMessage: 'Enter a valid name.'
            }
        },
        'lastName': {
            isAlpha: {
                errorMessage: 'Enter a valid name.'
            }
        },

    });

    //if only license plate or only car model is filled out make it null

    if ((req.body.licensePlate != '' &&
            req.body.carModel == '') ||
        (req.body.licensePlate == '' && req.body.carModel != '')) {
        req.body.licensePlate = '';
        req.body.carModel = '';
    }



    if (req.body.licensePlate != '' &&
        req.body.carModel != '') {

        req.checkBody({
            'licensePlate': {
                isAlphanumeric: {
                    errorMessage: 'Enter a valid license plate.'
                },

            },
            'carModel': {
                isAlphanumeric: {
                    errorMessage: 'Enter a valid car model.'
                },
            },


        });

    }

    var errors = req.validationErrors();

    // Check if any errors
    if (errors) {
        console.log(errors);
        res.status(500).send('Server validation error!');

    } else {

        //Try finding the user first to see if they already exist
        User.findOne({
            'username': req.body.username
        }, function(err, foundUser) {
            if (err) throw err;

            // Undefined means no user found
            if (foundUser == undefined) {


                // Create a new user
                var newUser = new User(req.body);

                if (req.body.licensePlate != '' &&
                    req.body.carModel != '') {
                    newUser.driver = 1;
                }

                // Save user
                newUser.save(function(err) {
                    if (err) throw err;

                    // Send back success message
                    res.send("Success");
                });
                // User already exists, send back error message
            } else {
                res.status(500).send('A user with that username already exists');
            }
        });
    }
};

// Edit user
exports.editUser = function(req, res) {
    console.log("editUser")

    //Valdiation for the editting a user
    req.checkBody({
        'email': {
            isEmail: {
                errorMessage: 'Enter a valid email address.'
            }
        },
        'username': {
            isAlphanumeric: {
                errorMessage: 'Enter a valid username.'
            },
            isLength: {
                options: [{
                    min: 2
                }],
                errorMessage: 'Enter a valid username length.'
            }
        },
        'password': {
            isAlphanumeric: {
                errorMessage: 'Enter a valid username.'
            },
            isLength: {
                options: [{
                    min: 2,
                    max: 32
                }],
                errorMessage: 'Enter a valid username.'
            }
        },
        'firstName': {
            isAlpha: {
                errorMessage: 'Enter a valid name.'
            }
        },
        'lastName': {
            isAlpha: {
                errorMessage: 'Enter a valid name.'
            }
        },

    });

    if (req.body.licensePlate != '' &&
        req.body.carModel != '') {

        req.checkBody({
            'licensePlate': {
                isAlphanumeric: {
                    errorMessage: 'Enter a valid license plate.'
                },

            },
            'carModel': {
                isAlphanumeric: {
                    errorMessage: 'Enter a valid car model.'
                },
            },


        });
    }

    var errors = req.validationErrors();

    // Check if any errors
    if (errors) {
        console.log(errors);
        res.status(500).send('Server validation error!');

    } else {

        // Try finding the user first
        User.findOne({
            'username': req.body.username
        }, function(err, foundUser) {
            if (err) throw err;

            // If the user exists, remove user
            if (foundUser != undefined) {
                User.remove({
                    'username': req.body.username
                }, function(err) {

                    var newUserData = req.body;

                    if (!req.body.password) {
                        newUserData['password'] = foundUser.password;
                    }

                    // Then make a new user with the form information
                    var newUser = new User(newUserData);

                    // Save the user
                    newUser.save(function(err) {
                        if (err) throw err;

                        // Send success message
                        res.send("Success");
                    });
                });

                // User doesn't exist so can't edit
            } else {
                res.status(500).send('The user you are trying to edit does not exist');
            }
        });
    }
};

// Delete the given username user
exports.deleteUser = function(req, res) {

    // Find the user first
    User.findOne({
        'username': req.query.username
    }, function(err, user) {
        if (err) throw err;

        // If user found, remove the user and send success message
        if (user != null) {

            user.remove(function(err) {
                if (err) throw err;

                Hike.find({
                    'riders': req.query.username
                }, function(err, hikesData) {
                    if (err) throw err;
                    for (var i = 0; i < hikesData.length; i++) {
                        hikesData[i].riders.pull(req.session.username);
                        hikesData[i].size--;
                        hikesData[i].save();
                    }

                    Hike.remove({
                        'driver': req.query.username
                    }, function(err) {
                        if (err) throw err;
                        res.send("Success");
                    });
                });
            });

            // Else, user does not exist
        } else {
            res.status(500).send('The user you are trying to edit does not exist');
        }
    });
};