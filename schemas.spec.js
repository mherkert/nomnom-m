var assert = require('chai').assert;
var cookbookSchema = require('./model/cookbook');
var recipeSchema = require('./model/recipe');
var userSchema = require('./model/user');
var fs = require('fs');
var mongoose = require('mongoose');


describe('Mongoose Schemas', function () {
    var Cookbook = mongoose.model('Cookbook', cookbookSchema);
    var Recipe = mongoose.model('Recipe', recipeSchema);
    var User = mongoose.model('User', userSchema);

    var user = new User({
        displayName: 'horst', 
        picture: 'http://www.pictures.com/horst.jpg', 
        email: 'horst@peter.com', 
        accountId: 'accountId'
    });
    var cookbook = new Cookbook({
        title: 'My favourite recipes',
        description: 'Everything I love.',
        owner: user._id
    });
    var recipe = new Recipe(
        {
            title: 'Chicken soup',
            ingredients: [
                {
                    title: 'For the soup',
                    items: [
                        '2 Chicken breast fillet',
                        '1 Carrot'
                    ]
                },
                {
                    title: 'Decoration',
                    items: [
                        'Basil leaves'
                    ]
                }
            ],
            instructions: [
                {
                    title: 'Preparation',
                    text: 'Chop everything up.'
                },
                {
                    title: 'Cooking method',
                    text: 'Cook everything in a pot.'
                }
            ],
            cookbook: cookbook._id,
            owner: user._id,
            meta: {
                color: 'orange',
                locale: 'en_gb'
            }
        }
    );


    describe('User', function () {

        it('has a displayName', function () {
            assert.equal(user.displayName, 'horst');
        });

        it('has a picture', function () {
            assert.equal(user.picture, 'http://www.pictures.com/horst.jpg');
        });

        it('has an email', function () {
            assert.equal(user.email, 'horst@peter.com');
        });

        it('has a created and a modified date', function () {
            assert.isNotNull(user.created);
            assert.isNotNull(user.modified);
        });

        it('has accountId', function () {
            assert.equal(user.accountId, 'accountId');
        });

        it('should be invalid if displayName or accountId are empty', function (done) {
            var u = new User();

            u.validate(function (err) {
                assert.equal(err.errors['displayName'].message, 'Path `displayName` is required.');
                assert.equal(err.errors['accountId'].message, 'Path `accountId` is required.');
                done();
            });
        });

        it('should be invalid with invalid picture URL', function (done) {
            var u = new User({
                displayName: 'horst', picture: 'invalid', accountId: 'accountId'
            });

            u.validate(function (err) {
                assert.isNotNull(err);
                assert.equal(err.errors['picture'].message, 'Path `picture` is invalid (invalid).');
                done();
            });
        });
    });

    describe('Cookbook', function () {

        it('has a title', function () {
            assert.equal(cookbook.title, 'My favourite recipes');
        });

        it('has a description', function () {
            assert.equal(cookbook.description, 'Everything I love.');
        });

        it('has an owner', function () {
            assert.isNotNull(recipe.owner);
        });

        it('has a created and a modified date', function () {
            assert.isNotNull(cookbook.created);
            assert.isNotNull(cookbook.modified);
        });

        it('should have a title with a maximum of 48 characters', function (done) {
            var c = new Cookbook({title: new Array(50).join('a')});
            c.validate(function (err) {
                assert.isNotNull(err);
                assert.equal(err.errors['title'].message, 'Path `title` (`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`) is longer than the maximum allowed length (48).');
                done();
            });
        });

        it('should be invalid if title or owner are empty', function (done) {
            var c = new Cookbook();

            c.validate(function (err) {
                assert.equal(err.errors['title'].message, 'Path `title` is required.');
                assert.equal(err.errors['owner'].message, 'Path `owner` is required.');
                done();
            });
        });

    });

    describe('Recipe', function () {
        it('has a title', function () {
            assert.equal(recipe.title, 'Chicken soup');
        });

        it('has ingredients', function () {
            assert.equal(recipe.ingredients[0].title, 'For the soup');
            assert.equal(recipe.ingredients[0].items[0], '2 Chicken breast fillet');
            assert.equal(recipe.ingredients[0].items[1], '1 Carrot');
        });

        it('has instructions', function () {
            assert.equal(recipe.instructions[0].title, 'Preparation');
            assert.equal(recipe.instructions[0].text, 'Chop everything up.');
        });

        it('has a cookbook', function () {
            assert.isNotNull(recipe.cookbook);
        });

        it('has an owner', function () {
            assert.isNotNull(recipe.owner);
        });

        it('has a created and a modified date', function () {
            assert.isNotNull(recipe.created);
            assert.isNotNull(recipe.modified);
        });

        it('has meta data', function () {
            assert.equal(recipe.meta.color, 'orange');
            assert.equal(recipe.meta.locale, 'en_gb');
        });

        it('should have a title with a maximum of 72 characters', function (done) {
            var r = new Recipe({title: new Array(74).join('a')});
            r.validate(function (err) {
                assert.isNotNull(err);
                assert.equal(err.errors['title'].message, 'Path `title` (`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`) is longer than the maximum allowed length (72).');
                done();
            });
        });

    });
});