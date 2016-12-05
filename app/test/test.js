var supertest = require('supertest');
var should = require('chai').should();

var server = supertest.agent('http://localhost:8080');

describe('Database tests', function() {

	after('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should delete all users', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should delete all hikes', function(done) {
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should initialize the Database', function(done) {
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should add a user to the Database', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'123',
    	            'firstName':'John',
    	            'lastName':'Doe',
    	            'email':'DJ@c.com',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to add a duplicate user to the Database', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'123',
    	            'firstName':'John',
    	            'lastName':'Doe',
    	            'email':'DJ@c.com',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to add a badly formatted username to the Database', function(done) {
    	var user = {'username':'L', 
    	            'password':'123',
    	            'firstName':'John',
    	            'lastName':'Doe',
    	            'email':'DJ@c',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to add a badly formatted password to the Database', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'',
    	            'firstName':'John',
    	            'lastName':'Doe',
    	            'email':'DJ@c',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to add a badly formatted email to the Database', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'123',
    	            'firstName':'John',
    	            'lastName':'Doe',
    	            'email':'DJ@c',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should add a driver to the Database', function(done) {
    	var user = {'username':'Leona', 
    	            'password':'123',
    	            'firstName':'Leo',
    	            'lastName':'Na',
    	            'email':'Leo@c.com',
    	            'licensePlate':'RIC719',
    	            'carModel': 'Merc'};

        server
        .post('/admin/addOneUser')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should edit a user in the Database', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'321',
    	            'firstName':'Doe',
    	            'lastName':'Jhon',
    	            'email':'JD@c.com',
    	            'licensePlate':'',
    	            'carModel': ''};

        server
        .post('/admin/editUser')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should delete a user in the Database', function(done) {

        server
        .delete('/admin/deleteUser/?username=Lemon')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to delete a non-existent user in the Database', function(done) {

        server
        .delete('/admin/deleteUser/?username=Liquid')
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });
});


describe('General tests', function() {
	before('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    after('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should return home page with no errors', function(done) {
        server
        .get('/')
        .expect(200)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });
});


describe('User tests', function() {
	before('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    after('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should return success on creating an account', function(done) {
    	var user = {'username':'Lyetenth', 
    	            'password':'123',
    	            'firstName':'Bob',
    	            'lastName':'Smith',
    	            'email':'qwe@c.com'};
        server
        .post('/createAccount')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should return failure due to duplicate user', function(done) {
    	var user = {'username':'Lyetenth', 
    	            'password':'123',
    	            'firstName':'Bob',
    	            'lastName':'Smith',
    	            'email':'qwe@c.com'};
        server
        .post('/createAccount')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should succeed login', function(done) {
    	var user = {'username':'Lyetenth', 
    	            'password':'123'};
        server
        .post('/signIn')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail login due to invalid', function(done) {
    	var user = {'username':'Lemon', 
    	            'password':'123'};
        server
        .post('/signIn')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

	it('Should edit user', function(done) {
    	var user = {'password':'321',
    	            'firstName':'Doe',
    	            'lastName':'Jhon',
    	            'email':'JD@c.com',
    	            'licensePlate':'',
    	            'carModel': ''};
        server
        .post('/editUser')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail edit due to bad email', function(done) {
    	var user = {'password':'321',
    	            'firstName':'Doe',
    	            'lastName':'Jhon',
    	            'email':'JD',
    	            'licensePlate':'',
    	            'carModel': ''};
        server
        .post('/editUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail login due to bad name', function(done) {
    	var user = {'password':'321',
    	            'firstName':'123',
    	            'lastName':'Jhon',
    	            'email':'JD@c.com',
    	            'licensePlate':'',
    	            'carModel': ''};
        server
        .post('/editUser')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should get the current user', function(done) {
    	var getUser = function(res) {
		    res.body.should.have.property("username", "Lyetenth");
		};

        server
        .get('/getOneUser')
        .expect(200)
        .expect(getUser)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

	it('Should fail the user a driver because bad carModel', function(done) {
    	var user = {'licensePlate':'MDCL231',
                    'carModel':'@#&*(#&*(#'};
        server
        .post('/beDriver')
        .send(user)
        .expect(500)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should make the user a driver', function(done) {
    	var user = {'licensePlate':'MDCL231',
                    'carModel':'Toyota'};
        server
        .post('/beDriver')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should edit user', function(done) {
        var user = {'password':'321',
                    'firstName':'Doe',
                    'lastName':'Jhon',
                    'email':'JD@c.com',
                    'licensePlate':'MDCL879',
                    'carModel': 'Cadillac'};
        server
        .post('/editUser')
        .send(user)
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should remove the user from being a driver', function(done) {
        server
        .delete('/deleteDriver')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should remove the user', function(done) {
        server
        .delete('/deleteUser')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });
});

describe('Driver profile tests', function() {
    before('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    after('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should get all hikes by kelvin', function(done) {
        var oneHikeByUser = function(res) {
            res.body[0].should.have.property("origin", "Calgary");
            res.body[0].should.have.property("destination", "Vancouver");
            res.body[0].should.have.property("departureDate", "12-10-2016");
            res.body[0].should.have.property("arrivalDate", "12-15-2016");
            res.body[0].should.have.property("capacity", 10);
            res.body[0].should.have.property("driver", "kelvin");
            res.body[0].should.have.property("price", 70);
            res.body[0].should.have.property("size", 0);
        };

        server
        .get('/getHostedHike?driver=kelvin')
        .expect(200)
        .expect(oneHikeByUser)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });
});

describe('Hikes tests', function() {
    before('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });

        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });

        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);

            var userSignIn = {'username':'kyra', 
                              'password':'kyra'};
            server
            .post('/signIn')
            .send(userSignIn)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(res.body.error);
                should.exist(res);
                should.not.exist(err);
                done();
            });
        });
    });

    after('Clear', function(done) {
        server
        .delete('/admin/resetUsers')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .delete('/admin/resetHikes')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
        });
        server
        .post('/admin/setDatabase')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(res.body.error);
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should get all hikes', function(done) {
        var allHikes = function(res) {
            res.body.should.have.length(4); 
        };

        server
        .get('/getAllHikes')
        .expect(200)
        .expect(allHikes)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should get rides by specified person and departureDate', function(done) {
        var user = {'departureDate':'11-27-2016',
                    'driver':'miranda'};
        var riders = function(res){
            res.body.should.have.length(0);
        }
        server
        .get('/getRiders')
        .send(user)
        .expect(200)
        .expect(riders)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should add a user to a ride', function(done) {
        var hike = {'departureDate':'11-27-2016',
                    'driver':'miranda'};
        server
        .post('/registerRide')
        .send(hike)
        .expect(200)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should get ride by specified person and departureDate, with 1 rider', function(done) {
        var oneRider = function(res){
            res.body.should.have.length(1);
        }
        server
        .get('/getRiders?driver=miranda&departureDate=11-27-2016')
        .expect(200)
        .expect(oneRider)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should remove a user from a ride', function(done) {
        var hike = {'departureDate':'11-27-2016',
                    'driver':'miranda'};
        server
        .post('/registerRide')
        .send(hike)
        .expect(200)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a bad date hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"!!!",
                    "arrivalDate":"12-15-2019",
                    "capacity":10,
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a bad capacity hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"Calgary",
                    "arrivalDate":"12-15-2019",
                    "capacity":"Top",
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a bad date hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"12-10-2017",
                    "arrivalDate":"12-15-2019",
                    "capacity":10,
                    "price":"Low"};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a arrival before departure hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"12-10-2017",
                    "arrivalDate":"12-15-2015",
                    "capacity":10,
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a hike with same origin and destination', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Calgary",
                    "departureDate":"12-10-2017",
                    "arrivalDate":"12-15-2019",
                    "capacity":10,
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should create a new hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"12-10-2017",
                    "arrivalDate":"12-15-2019",
                    "capacity":10,
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(200)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should fail to create a duplicate hike', function(done) {
        var hike = {"origin":"Calgary",
                    "destination":"Vancouver",
                    "departureDate":"12-10-2017",
                    "arrivalDate":"12-15-2019",
                    "capacity":10,
                    "price":70};
        server
        .post('/addNewHike')
        .send(hike)
        .expect(500)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });

    it('Should remove a hike', function(done) {
        var hike = {"driver":"kyra",
                    "departureDate":"12-10-2017"};
        server
        .delete('/deleteHike')
        .send(hike)
        .expect(200)
        .end(function(err, res) {
            should.exist(res);
            should.not.exist(err);
            done();
        });
    });
});