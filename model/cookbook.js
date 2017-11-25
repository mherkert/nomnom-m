var mongoose = require('mongoose');

var cookbookSchema = {
    title: {type: String, required: true, maxlength: 48, unique: true},
    description: {type: String},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
};

var schema = new mongoose.Schema(cookbookSchema);

schema.index({title: 'text'});

module.exports = schema;
module.exports.cookbookSchema = cookbookSchema;