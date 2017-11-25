var express = require('express');
var status = require('http-status');
var bodyValidator = require('better-validator');
var accessValidation = require('./validation/accessValidation');

var WrapperFormatter = bodyValidator.format.response.WrapperFormatter;
var FailureFormatter = bodyValidator.format.failure.FailureFormatter;

var check = bodyValidator.expressMiddleware({
    responseFormatter: new WrapperFormatter(),
    failureFormatter: new FailureFormatter()
});

var userValidationRule = function (body) {
    body('username').required();
    body('email').isString().isEmail();
    body('oauth').required();
    body('picture').isString().isURL();
    body().strict();
};

var cookbookValidationRule = function (body) {
    body('title').required();
    body('description').isString();
    body('owner').required();
    body('owner').isString();
    body().strict();
};

var recipeValidationRule = function (body) {
    body('title').required().isString().isLength({max: 72});
    body('ingredients').isObjectArray((child) => {
        child('title').isString().isLength({max: 72});
        child('items').isArray((item) => {
            item.isString().isLength({max: 72});
        });
    }).length(100);
    body('instructions').isObjectArray((child) => {
        child('title').isString().isLength({max: 72});
        child('text').isString().isLength({max: 1024});
    }).length(50);
    body('cookbook').required().isString();
    body('owner').required().isString();
    body('meta').isObject((obj => {
        obj('color').isString();
        obj('locale').isString();
    }));

    body().strict();
};

module.exports = function (wagner) {
    var api = express.Router();

    api.get('/user/me', accessValidation.isAuthenticated, function (req, res) {
        res.json(req.user);
    });

    api.get('/users', accessValidation.isAuthenticated, wagner.invoke(function (User) {
        return function (req, res) {
            User.find({}, function (err, users) {
                if (err)
                    return res.status(status.INTERNAL_SERVER_ERROR).json({
                        error: 'Internal server error'
                    });

                res.json(users);
            });
        }
    }));

    // api.post('/users', check.body(userValidationRule), wagner.invoke(function (User) {
    //     return function (req, res) {
    //         User.findOne({'username': req.body.username}, function (err, user) {
    //             if (err)
    //                 return res.status(status.INTERNAL_SERVER_ERROR).json({
    //                     error: 'Internal server error'
    //                 });
    //             else if (user)
    //                 return res.status(status.BAD_REQUEST).json({error: 'A user with these details already exists.'});
    //             else {
    //
    //                 var u = new User(req.body);
    //                 u.save(function (err, user) {
    //                     if (err) {
    //                         console.log(err);
    //                         if (err.code == '11000')
    //                             return res.status(status.BAD_REQUEST).json({
    //                                 error: 'A user with these details already exists.'
    //                             });
    //
    //                         return res.status(status.INTERNAL_SERVER_ERROR).json({
    //                             error: 'Unable to create user.'
    //                         });
    //                     }
    //                     return res.status(status.CREATED).json(user)
    //                 });
    //             }
    //         });
    //     }
    // }));

    api.post('/user/:user/cookbooks', accessValidation.isAuthenticated, accessValidation.isAuthorized, check.body(cookbookValidationRule), wagner.invoke(function (Cookbook) {
        return function (req, res) {

            new Cookbook(req.body).save(function (err, cookbook) {
                if (err) {
                    console.log(err);
                    if (err.code == '11000')
                        return res.status(status.BAD_REQUEST).json({
                            error: 'A cookbook with this title already exists.'
                        });

                    return res.status(status.INTERNAL_SERVER_ERROR).json({
                        error: 'Unable to create cookbook.'
                    });
                }
                return res.status(status.CREATED).json(cookbook)
            });
        };
    }));

    api.get('/user/:user/cookbooks', accessValidation.isAuthenticated, accessValidation.isAuthorized, wagner.invoke(function (Cookbook) {
        return function (req, res) {

            Cookbook.find({owner: req.params.user}, function (err, cookbooks) {
                if (err) {
                    console.error(err.toString());
                    return res.status(status.INTERNAL_SERVER_ERROR).json({error: 'Unable to access cookbooks.'});
                }
                res.json(cookbooks);
            });
        };
    }));

    api.post('/user/:user/recipes', accessValidation.isAuthenticated, accessValidation.isAuthorized, check.body(recipeValidationRule), wagner.invoke(function (Recipe) {
        return function (req, res) {

            new Recipe(req.body).save(function (err, recipe) {
                if (err) {
                    console.log(err);
                    if (err.code == '11000')
                        return res.status(status.BAD_REQUEST).json({
                            error: 'A recipe with this title already exists.'
                        });

                    return res.status(status.INTERNAL_SERVER_ERROR).json({
                        error: 'Unable to create recipe.'
                    });
                }
                return res.status(status.CREATED).json(recipe)
            });
        };
    }));

    api.get('/user/:user/recipes', accessValidation.isAuthenticated, accessValidation.isAuthorized, wagner.invoke(function (Recipe) {
        return function (req, res) {

            var condition = {owner: req.params.user};

            if (req.query.title)
                condition['$text'] = {$search: req.query.title};

            Recipe.find(
                condition,
                {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).exec(function (err, recipes) {
                if (err) {
                    console.error(err.toString());
                    return res.status(status.INTERNAL_SERVER_ERROR).json({error: 'Unable to access recipes.'});
                }
                res.json(recipes);
            });
        };
    }));

    return api;
};
