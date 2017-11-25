var mongoose = require('mongoose');

var userSchema = {
    accountId: {
        type: String,
        required: true,
        index: {unique: true, dropDups: true}
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: /^[^@]+@[^@]+\.[^@]+$/i,
        lowercase: true,
        index: {unique: true, dropDups: true}
    },
    picture: {
        type: String,
        match: /^http[s]?:\/\//i
    },
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
};
// var userSchema = {
//     profile: {
//         username: {
//             type: String,
//             required: true,
//             lowercase: true,
//             index: {unique: true, dropDups: true}
//         },
//         picture: {
//             type: String,
//             match: /^http[s]?:\/\//i
//         }
//     },
//     created: {type: Date, default: Date.now},
//     modified: {type: Date, default: Date.now},
//     data: {
//         oauth: {type: String, required: true}
//     }
// };

var schema = new mongoose.Schema(userSchema);

module.exports = schema;
module.exports.userSchema = userSchema;