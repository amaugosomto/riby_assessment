const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String, 
    },
    email: {
        type: String, 
        required: true, 
        unique: true 
    },
    phoneNumber: {
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    account_number: {
        type: Number
    },
    bank_name: {
        type: String
    },
    account_bank: {
        type: String
    }, 
    account_name: {
        type: String
    },
    permission: {
        type: String,
        default: 'user'
    },
    img_name: {
        type: String,
    },
    first_name: {
        type: String,
        // required: true
    },
    last_name: {
        type: String,
        // required: true
    },
    address: {
        type: String
    },
    state: {
        type: String,
        // required: true
    }

},{
    collection: 'Users',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const Users = mongoose.model('User', userSchema);
module.exports = Users;