//var mongoose = require('mongoose');

//require.paths.unshift('vendor/mongoose');

var exec = require('child_process').exec
    //, mongoose = require('mongoose').Mongoose;
    , mongoose = require('mongoose/')

var db = mongoose.connect('mongodb://localhost/botdb'), ObjectId = mongoose.Schema.ObjectId;

var schema = new mongoose.Schema({
    value: { type: String },
    key: { type: String, index: true }
})

db.schema = schema;

var Note = mongoose.model('Note', schema );

/*

var Note = mongoose.model('Note', {
    properties: ['key', 'value'],
    indexes: ['key'],
    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        }   
    }
});
*/

db.Note = Note;
module.exports = db;
