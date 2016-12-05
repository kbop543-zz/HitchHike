var User = require('../models/user');
var Hike = require('../models/hike')

/* Sign in */
exports.signIn = function(req, res) {
    console.log('signIn');

    // Find if user matches both username AND password
    User.findOne({
        'username': req.body.username,
        'password': req.body.password
    }, function(err, user) {

        if (err) throw err;

        // Return error message if user not found
        if (user == null) {

            res.status(500).send('Username or Password is incorrect');

        } else {

            // Set cookie to be username
            req.session.username = user.username;

            // Redirect to logged in page
            res.send('Success');
        }
    });
};


/* Sign up */
exports.signUp = function(req, res) {
    console.log('addOne');

    // Input validation
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

    var errors = req.validationErrors();

    // Return error on validation error
    if (errors) {

        res.status(500).send('Server validation error!');

    } else {

        // Find a user
        User.findOne({
            'username': req.body.username
        }, function(err, user) {
            if (err) throw err;

            // If username is not in the databse then create the user
            if (user == undefined) {

                var newUser = new User(req.body);

                // Save user
                newUser.save(function(err, newUser) {
                    if (err) {
                        throw err;
                    } else {
                        res.send('Success');
                    }
                });

            } else {
                // Return error if user not found
                res.status(500).send('A user with that username already exists');
            }
        })
    }
}


/* Edit user */
exports.editUser = function(req, res) {
    console.log("editUser");

    // User validation
    req.checkBody({
        'email': {
            isEmail: {
                errorMessage: 'Enter a valid email address.'
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

    if (req.body.licensePlate != false &&
        req.body.carModel != false ) {

        // Driver validation
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

    // Return error if validation error
    if (errors) {

        res.status(500).send('Server validation error!');

    } else {

        // Find the user
        User.findOne({
            'username': req.session.username
        }, function(err, foundUser) {
            if (err) throw err;
            console.log(foundUser);

            if (foundUser != undefined) {

                // Remove the user 
                User.remove({
                    'username': req.session.username
                }, function(err) {

                    var userData = req.body;
                    userData['username'] = req.session.username;

                    console.log(req.body.password);

                    if (req.body.password == null) {
                        userData['password'] = foundUser.password;
                    }

                    // Create a new user with the updated information
                    var newUser = new User(userData);
                    if (foundUser.driver == 1) {
                        newUser.driver = 1;
                    }

                    newUser.save(function(err) {
                        if (err) throw err;

                        res.send('Success');
                    });
                });

            } else {
                // Return error if user not found
                res.status(500).send('The user you are trying to edit does not exist');
            }
        });
    }
};


/* Get one user */
exports.getOneUser = function(req, res) {
    console.log('getOneUser');

    // Get the username from current session
    User.findOne({
        'username': req.session.username
    }, function(err, foundUser) {
        if (err) throw err;

        // If user is found, send it back
        if (foundUser != undefined) {
        	console.log(foundUser);
            res.send(foundUser);

        } else {
            // Return error if user not found
            res.status(500).send('The user you are trying to edit does not exist');
        }
    });
};


/* Set user as a driver */
exports.beDriver = function(req, res) {
    console.log('beADriver');

    // Driver validation
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

    var errors = req.validationErrors();

    // Return error if validation error
    if (errors) {

        res.status(500).send('Server validation error!');

    } else {

        User.findOne({
            'username': req.session.username
        }, function(err, foundUser) {
            if (err) throw err;

            // Set driver information for user
            foundUser.driver = 1;
            foundUser.licensePlate = req.body.licensePlate;
            foundUser.carModel = req.body.carModel;

            // Update user information
            foundUser.save(function(err) {
                if (err) throw err;

                res.send(foundUser);
            })
        });
    }
}


/* Delete user */
exports.deleteUser = function(req, res) {
    console.log('Delete Account');

    // Find the current user
    User.findOne({
        'username': req.session.username
    }, function(err, user) {
        if (err) throw err;

        // If user is found, remove the user
        if (user != null) {

            user.remove(function(err) {
                if (err) throw err;

                // Delete user from riding data
                Hike.find({
                    'riders': req.session.username
                }, function(err, hikesData) {
                    if (err) throw err;

                    for (var i = 0; i < hikesData.length; i++) {
                        console.log(req.session.username + ' found');
                        hikesData[i].riders.pull(req.session.username);
                        hikesData[i].size--;
                        hikesData[i].save();
                    }

                    // Delete all user hosted hikes
                    Hike.remove({
                        'driver': req.session.username
                    }, function(err) {
                        if (err) throw err;

                        // Reset the session and send back success message
                        req.session.username = null;
                        res.send("Success");
                    });
                });
            });

        } else {
            // Return error if user not found
            res.status(500).send('The user you are trying to edit does not exist');
        }
    });
};


/* Delete a user's driver information */
exports.deleteDriver = function(req, res) {
    console.log('Deleting driver information');

    // Delete the driver's hikes
    Hike.remove({
        'driver': req.session.username
    }, function(err) {
        if (err) throw err;
    });

    // Get the driver's user information
    User.findOne({
        'username': req.session.username
    }, function(err, user) {
        if (err) throw err;

        // If user is found, remove the user
        if (user != null) {
            user.driver = 0;
            user.licensePlate = null;
            user.carModel = null;

            user.save(function(err) {
                if (err) throw err;

                res.send(user);
            });
        }
    });
}