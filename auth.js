// var GOOGLE_CLIENT_ID = '';
// var GOOGLE_CLIENT_SECRET = '';


function setupAuth(User, app) {
    var passport = require('passport');
    var GoogleStrategy = require('passport-google-oauth20').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.
        findOne({ _id : id }).
        exec(done);
    });

    passport.use(new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOneAndUpdate(
                { 'accountId': profile.id },
                {
                    $set: {
                        'displayName': profile.displayName,
                        'picture': profile.photos[0].value
                    }
                },
                { 'new': true, upsert: true, runValidators: true },
                function(error, user) {
                    done(error, user);
                });
        }));



    app.use(require('express-session')({
        secret: 'this is a secret'
    }));
    app.use(passport.initialize());
    app.use(passport.session());



    app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.send('Welcome, ' + req.user.displayName);
        });
}

module.exports = setupAuth;
