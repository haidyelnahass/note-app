const Note = require('../models/Note')
const { validationResult } = require('express-validator/check');
const user = require('../models/User');

exports.postNote = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('WRONG_FORMAT');
        error.statusCode = 403;
        error.data = errors.array();
        //to keep the errors retrieved by validation!
        throw error;
    }
    const note = new Note({
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        creator: req.userId,
    });
    let savedNote;
    let newUser;
    note
        .save()
        .then(note => {
            savedNote = note;
            return user.findById(req.userId);
        })
        .then(user => {
            newUser = user;
            return newUser.notes.push(note);  
        })
        .then(result => {
            return newUser.save();
            
        }).then(result => {
            res.status(201).json(note);
            
        })
        .catch(err => next(err))



}

exports.getNotes = async (req, res, next) => {
    const { search, sort } = req.query;
    if (sort && ['title', 'description', 'createdAt'].indexOf(sort) === -1) {
        const error = new Error('WRONG_SORT_QUERY');
        error.statusCode = 403;
        throw error;
    }
    let notes = await Note.find().sort(sort).populate('creator')
    if (search) {
        notes = notes.filter(note => {
            for (method in note) {
                if (method.toLocaleLowerCase().match(search.toLocaleLowerCase())) {
                    return true
                }
            }
            return false
        })
    }
    res.status(200).json(notes)
}


exports.getNoteById = (req, res, next) => {
    const id = req.params.id;
    Note.findById(id).populate('creator')
        .then(note => {
            if (!note) {
                const error = new Error('NOT_FOUND');
                error.statusCode = 404;
                throw error;
            };
            res.status(200).json(note);
        })
        .catch((err) => next(err));
};

exports.editNote = (req, res, next) => {
    const id = req.params.id;

    Note.findById(id).populate('creator')
        .then((note) => {
            if (!note) {
                const error = new Error('NOT_FOUND');
                error.statusCode = 404;
                throw error;
            }
            if (note.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            Object.assign(note, req.body);
            return note.save();
        })
        .then(note => res.status(200).json(note))
        .catch((err) => next(err));
};

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Note.findById(id)
        .then((note) => {
            if (!note) {
                const error = new Error('NOT_FOUND');
                error.statusCode = 404;
                throw error;
            }
            if (note.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            return Note.findByIdAndDelete(id);
        })
        .then(() => {
            res.status(200).json({ message: "Deleted" });
            return user.findById(req.userId);
        })
        .then(user => {
            user.notes.pull(id);

            return user.save();


        }).then(result => {


            return res.status(200).json({
                message: 'Note deleted successfully!',
            })
        })
        .catch(err => next(err))
}
