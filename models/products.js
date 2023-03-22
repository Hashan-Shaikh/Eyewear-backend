const Joi = require('joi');
const mongoose = require('mongoose');

const prodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const Prod = mongoose.model('Product', prodSchema);

function prodValidate(prod) {
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return schema.validate(prod);
}

exports.Prod = Prod;
exports.validateProd = prodValidate;
exports.prodSchema = prodSchema;
