var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saveSchema = new Schema({

    savingId:  { 
        type: Schema.ObjectId, 
        ref: 'Savings',
    },
    amount: {
        type: Number
    },
    plan: {
        type: String
    }, 
    option: {
        type: String
    }
},{
    collection: 'Repayments',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const saves = mongoose.model('repayment', saveSchema);
module.exports = saves;