var status = require('http-status');

module.exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    return res.status(status.UNAUTHORIZED).json({error: 'Not authenticated. Please login with your Google account.'});
};

module.exports.isAuthorized = function isAuthenticated(req, res, next) {
    if (req.params.user == req.user._id)
        return next();

    return res.status(status.UNAUTHORIZED).json({error: 'Forbidden. Cannot access content of another user.'});
};



