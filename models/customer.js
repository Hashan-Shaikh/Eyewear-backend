const { number } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
        unique:true
    }
    
});

const Customer = mongoose.model('Customer', customerSchema);

function customerValidate(cus) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.number().required()
    });
    return schema.validate(cus);
}

exports.Customer = Customer;
exports.validateCustomer = customerValidate;
exports.customerSchema = customerSchema;
