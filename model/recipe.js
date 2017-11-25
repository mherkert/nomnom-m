var mongoose = require('mongoose');

var recipeSchema = {
    title: {type: String, required: true, maxlength: 72, unique: true},
    ingredients: [{
        title: String,
        items: [String]
    }],
    instructions: [{
        title: String,
        text: String
    }],
    cookbook: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now},
    meta: {
        color: String,
        locale: String
    }
};

var schema = new mongoose.Schema(recipeSchema);

schema.index({title: 'text'});

module.exports = schema;
module.exports.recipeSchema = recipeSchema;