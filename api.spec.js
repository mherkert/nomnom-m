var assert = require('chai').assert;
var express = require('express');
var superagent = require('superagent');
var status = require('http-status');
var wagner = require('wagner-core');

// // TODO or is there a way to mock this?
// var passport = require('passport');


var URL_ROOT = 'http://localhost:3000';


describe('User API', function () {
    var server;
    var User;

    before(function () {
        var app = express();

        models = require('./model/models')(wagner);
        app.use(require('./api')(wagner));

        // // TODO or is there a way to mock this? req.isAuthenticated()
        // app.use(require('express-session')({
        //     secret: 'this is a secret'
        // }));
        // app.use(passport.initialize());
        // app.use(passport.session());
        //
        // app.use(function(req, res, next){
        //     req.user = {
        //         id: 1
        //     };
        //     req.isAuthenticated = function(){
        //         return true;
        //     };
        //     next()
        // });
        //
        // // TODO

        server = app.listen(3000);

        User = models.User;
    });

    after(function () {
        server.close();
    });

    beforeEach(function (done) {
        User.remove({}, function (error) {
            assert.ifError(error);
            done();
        });
    });


    it('can load users', function (done) {
        User.create({displayName: 'horst.peter', email: 'horst@peter.com', accountId: 'accountId'}, function (error, user) {
            assert.ifError(error);
            var url = URL_ROOT + '/users';

            superagent.get(url, function (error, res) {
                assert.ifError(error);
                var user = {};

                assert.doesNotThrow(function () {
                    user = JSON.parse(res.text);
                });
                assert.equal(res.statusCode, status.OK);
                assert.ok(user);
                assert.equal(user[0].displayName, 'horst.peter');
                done();
            });
        });
    });

});