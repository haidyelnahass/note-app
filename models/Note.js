const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
        default:"#fff"
    }
},{timestamps:true});

module.exports = mongoose.model('Note', NoteSchema);