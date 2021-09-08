const mongoose = require('mongoose');
const Note = require('./Note');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }],

});

UserSchema.pre('remove', function(next) {
    //on deletion of user, delete all related posts.
    Note.remove({creator: this._id}).exec();
    next();
});

module.exports = mongoose.model('User', UserSchema);