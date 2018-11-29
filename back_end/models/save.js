var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saveSchema = new Schema({

    userId:  { 
        type: Schema.ObjectId, 
        ref: 'Users',
    },
    name: {
        type: String
    },
    plan: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    amount: {
        type: Number
    },
    duration: {
        type: Number
    },
    option : {
        type: String
    },
    paid: {
        type: Boolean
    },
    email: {
        type: String
    },
    interest: {
        type: Number
    },
    saveDate: {
        type: Date
    },
    durationElapse: {
        type: Date
    },
    txref: {
        type: String
    },
    disbursed: {
        type: Boolean,
        default:false
    },
    amountDisbursed: {
        type: Number
    },
    amountPaidTillDate: {
        type: Number,
        default: 0
    },
    amountToPayMonthly: {
        type: Number
    },
    projectedInterest: {
        type: Number
    },
    projectedAmount: {
        type: Number
    },
    paidComplete: {
        type: Boolean,
        default: false
    },
    accountPaidTo: {
        type: Number
    }, 
    todayAmount: {
        type: Number
    },
    fstPaymentDate: {
        type: Date,
    },
    payCount : {
        type: Number,
        default: 0
    },
    next_payment: {
        type: Date
    }
},{
    collection: 'Savings',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const saves = mongoose.model('saving', saveSchema);
module.exports = saves;