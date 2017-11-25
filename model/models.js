var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/nomnom');

    var User =
        mongoose.model('User', require('./user'), 'users');

    // if index does not work, check error
    // User.on('index', function(error) {
    //     console.log('Got error', error);
    //     process.exit(0);
    // });

    // wagner.factory('User', function() {
    //     return User;
    // });

    var Cookbook =
        mongoose.model('Cookbook', require('./cookbook'), 'cookbooks');

    // Cookbook.on('index', function(error) {
    //     console.log('Got error', error);
    //     process.exit(0);
    // });

    // wagner.factory('Cookbook', function() {
    //     return Cookbook;
    // });

    var Recipe =
        mongoose.model('Recipe', require('./recipe'), 'recipes');


    var models = {
        User: User,
        Cookbook: Cookbook,
        Recipe: Recipe
    };


    // wagner.factory('Recipe', function() {
    //     return Recipe;
    // });

    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};
