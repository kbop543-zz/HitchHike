var express = require('express');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var fs = require('fs');

// Socket IO for messages
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'pug');
app.use(express.static(__dirname));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));


app.use(validator());
app.use(session({
    secret: 'I am actually a potato',
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

var port = process.env.PORT || 8080;

// Routes
var users = require('./routes/usersRoutes.js');
var hikes = require('./routes/hikeRoutes.js');
var admins = require('./routes/adminRoutes.js');
var profile = require('./routes/driverProfilesRoutes.js');

// Models
var hikesDb = require('./models/hike');
var usersDb = require('./models/user');

// Main page. Login page if not already logged in, else redirect to dashboard
app.get('/', function(req, res) {

    if (req.session.username == undefined) {
        res.render('index', {
            title: 'HitchHike'
        });

        usersDb.findOne({
            username: 'admin'
        }, function(err, admin) {
            if (err) throw err;

            if (admin == undefined) {
                var adminUser = {
                    'usertype': 1,
                    'username': 'admin',
                    'password': 'password',
                    'firstName': 'ad',
                    'lastName': 'min',
                    'email': 'admin@hikes.com'
                }

                var newAdmin = usersDb(adminUser);
                newAdmin.save(function(err) {
                    if (err) throw err;
                });
            }
        });

    } else {
        res.redirect('/dashboard');
    }
});

// Redirect to login and reset session on log out
app.get('/logout', function(req, res) {
    req.session.username = undefined;
    res.redirect('/');
});

// Dashboard redirect
app.get('/dashboard', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');
    } else {
        usersDb.findOne({
            username: req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            // Search hikes
            if (req.query.destination != undefined) {
                hikesDb.find({
                    destination: {$regex: new RegExp(req.query.destination, 'i')}
                }, function(err, hikesData) {
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });

            // Get hikes associated with logged in user
            } else if (req.query.mine != undefined) {
                hikesDb.find({
                    riders: req.session.username
                }, function(err, hikesData) {
                    console.log(hikesData);
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });
            
            // Sort by price, ascending
            } else if (req.query.priceSort != undefined) {
                hikesDb.find().sort({
                    price: 1
                }).find(function(err, hikesData) {
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });

            // Sort by origin, alphabetically
            } else if (req.query.originSort != undefined) {
                hikesDb.find().sort({
                    origin: 1
                }).find(function(err, hikesData) {
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });

            // Sort by destination, alphabetically
            } else if (req.query.destinationSort != undefined) {
                hikesDb.find().sort({
                    destination: 1
                }).find(function(err, hikesData) {
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });

            // All hikes
            } else {
                hikesDb.find({}, function(err, hikesData) {
                    if (err) throw err;

                    res.render('dashboard', {
                        title: 'Dashboard',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver,
                        username: req.session.username
                    });
                });
            }
        });
    }
});

// MyHike redirect
app.get('/hikes', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');

    } else {
        usersDb.findOne({
            username: req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            if (isDriver == 0 && isAdmin != 1) {
                res.redirect('/dashboard');
            }

            if (isAdmin == 1) {
                hikesDb.find({}, function(err, hikesData) {
                    if (err) throw err;

                    res.render('hostedHikes', {
                        title: 'Manage Hikes',
                        hikes: hikesData,
                        admin: isAdmin,
                        ddriver: isDriver
                    });
                });

            } else {
                hikesDb.find({
                    driver: req.session.username
                }, function(err, hikesData) {
                    if (err) throw err;

                    res.render('hostedHikes', {
                        title: 'My Hikes',
                        hikes: hikesData,
                        admin: isAdmin,
                        driver: isDriver
                    });
                });
            }
        });
    }
});

// Messaging redirect
app.get('/messages', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');

    } else {
        usersDb.findOne({
            username: req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            res.render('messenger', {
                title: 'Global Messenger',
                admin: isAdmin,
                driver: isDriver
            });
        });
    }
});

// MyAccount redirect
app.get('/account', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');

    } else {
        usersDb.findOne({
            username: req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            if (isAdmin == 1) {
                res.redirect('/dashboard');
            }

            usersDb.find({
                username: req.session.username
            }, function(err, hikesData) {
                if (err) throw err;

                res.render('myAccount', {
                    title: 'My Account',
                    admin: isAdmin,
                    driver: isDriver
                });
            });
        });
    }
});

// DriverProfiles redirect
app.get('/driverProfiles', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');

    } else {
        usersDb.findOne({
            'username': req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            usersDb.find().sort({
                username: 1
            }).find({
                driver: 1
            }, function(err, driverData) {
                console.log(driverData);
                if (err) throw err;

                res.render('driverProfiles', {
                    title: 'Driver Profiles',
                    drivers: driverData,
                    admin: isAdmin,
                    driver: isDriver
                });
            });
        });
    }
});

// Control Panel
app.get('/controlPanel', function(req, res) {

    if (req.session.username == undefined) {
        res.redirect('/');

    } else {
        usersDb.findOne({
            'username': req.session.username
        }, function(err, user) {
            var isAdmin = user.usertype;
            var isDriver = user.driver;

            if (isAdmin == 0) {
                res.redirect('/dashboard');
            }

            usersDb.find().sort({
                username: 1
            }).find({
                usertype: 0
            }, function(err, userData) {
                if (err) throw err;

                res.render('controlPanel', {
                    title: 'Control Panel',
                    admin: isAdmin,
                    users: userData,
                    driver: isDriver
                });
            });
        });
    }
});

// Get current user
app.get('/currentUser', function(req, res) {
    res.send(req.session.username);
});

// User routes
app.post('/createAccount', users.signUp);
app.post('/signIn', users.signIn);
app.get('/getOneUser', users.getOneUser);
app.post('/editUser', users.editUser);
app.post('/beDriver', users.beDriver);
app.delete('/deleteUser', users.deleteUser);
app.delete('/deleteDriver', users.deleteDriver);

// Driver Profile Routes
app.get('/getHostedHike', profile.getHostedHike);

// Hike routes
app.get('/getAllHikes', hikes.getAllHikes);
app.post('/addNewHike', hikes.addNewHike);
app.delete('/deleteHike', hikes.deleteHike);
app.post('/registerRide', hikes.registerRide);
app.get('/getRiders', hikes.getRiders);

// Admin routes
app.delete('/admin/resetUsers', admins.resetUserDB);
app.delete('/admin/resetHikes', admins.resetHikesDB);
app.post('/admin/setDatabase', admins.setDatabase);
app.post('/admin/addOneUser', admins.addUser);
app.post('/admin/editUser', admins.editUser);
app.delete('/admin/deleteUser', admins.deleteUser);

// Socket IO code taken from http://socket.io/get-started/chat/
io.on('connection', function(socket) {
    // On connect
    console.log('a user connected');

    // On disconnect
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // On chat message sent to IO, broadcast the message to the chat
    socket.on('chat message', function(msg) {
        var dt = new Date();
        var utcDate = dt.toUTCString();
        io.emit('chat message', '[' + utcDate + '] ' + msg);
    });
});

// Port to listen to
http.listen(port, function() {
    console.log('Serving on ' + port);
});
