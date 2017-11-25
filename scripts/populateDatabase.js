var wagner = require('wagner-core');
var models = require('../model/models')(wagner);
var _ = require('underscore');

var Recipe = models.Recipe;
var Cookbook = models.Cookbook;
var User = models.User;

Recipe.remove({}, function (error) {
    if (error) console.error(error);
    Cookbook.remove({}, function (error) {
        if (error) console.error(error);


        User.findOne({'displayName': 'Marion Herkert'}, function (err, user) {
            if (err) return console.error(err);

            var cookbookJson = require('./data/cookbooks.json');
            var recipesJson = require('./data/recipes.json');

            cookbookJson['owner'] = user._id;

            new Cookbook(cookbookJson).save(function (err, cb) {
                if (err) return console.error(err);

                _.each(recipesJson, function (recipeJson) {
                    recipeJson['cookbook'] = cb._id;
                    recipeJson['owner'] = user._id;

                    new Recipe(recipeJson).save(function (err, r) {
                        if (err) return console.error(err);

                        process.exit(0);
                    });
                });

            });
        });
    });
});



