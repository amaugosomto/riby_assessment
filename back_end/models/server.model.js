var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var server_schema = new Schema({
    date: {
        type: Date
    }

},{
    collection: 'Server',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const server = mongoose.model('server', server_schema);
module.exports = server;