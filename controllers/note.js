const Note = require('../models/Note')
const { validationResult } = require('express-validator/check');

exports.postNote = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('WRONG_FORMAT');
        error.statusCode = 403;
        error.data = errors.array();
        //to keep the errors retrieved by validation!
        throw error;
    }

    const note = new Note(req.body);
    note
        .save()
        .then(note => {
            res.status(201).json(note)
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
    let notes = await Note.find().sort(sort)
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
    Note.findById(id)
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

    Note.findById(id)
        .then((note) => {
            if (!note) {
                const error = new Error('NOT_FOUND');
                error.statusCode = 404;
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
            return Note.deleteOne({ _id: Types.ObjectId(id) });
        })
        .then(() => {
            res.status(200).json({ message: "Deleted" });
        })
        .catch(err => next(err))
}
