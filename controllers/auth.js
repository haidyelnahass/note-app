const User = require('../models/User');
// const Note = require('../models/Note');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Failed to validate!');
        error.statusCode = 422;
        error.data = errors.array();
        //to keep the errors retrieved by validation!
        throw error;

    }
    let loadedUser;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
        .then(user => {
            if (!user) {
                const error = new Error('No user with that email!');
                error.statusCode = 400;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);


        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error('wrong password!!!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'supersecretstring', {
                expiresIn: '2h',
            });
    
    
            return res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })
            })
        .catch(err => {
            next(err);
        })


}
exports.postSignup = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Failed to validate!');
        error.statusCode = 422;
        error.data = errors.array();
        //to keep the errors retrieved by validation!
        throw error;

    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                email: email,
                password: hashedPass,
                name: name,
            })
            return user.save();
        })
        .then(result => {
            return res.status(201).json({
                message: 'User created successfully!',
                userId: result._id,
            });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
exports.getUsers = (req, res, next) => {
    const { search, sort } = req.query;
    if (sort && ['name', 'email', 'password'].indexOf(sort) === -1) {
        const error = new Error('WRONG_SORT_QUERY');
        error.statusCode = 403;
        throw error;
    }
    User.find()
    .populate('notes')
    .sort(sort)
    .then(users => {
        if (!users) {
            const error = new Error('No user with that email!');
            error.statusCode = 400;
            throw error;
        }
        if (search) {
            users = users.filter(user => {
                for (method in user) {
                    if (method.toLocaleLowerCase().match(search.toLocaleLowerCase())) {
                        return true
                    }
                }
                return false
            })
        }
        return res.status(200).json({
            message: 'Users fetched successfully!',
            users: users,
        });

    })
    .catch(err => {
        console.log(err);
    })

}

exports.getUser = (req, res, next) => {
    const userId = req.params.id;
    console.log(userId);
    User.findById(userId)
    .populate('notes')
    .then(user => {
        if (!user) {
            const error = new Error('No user with that email!');
            error.statusCode = 400;
            throw error;
        }

        return res.status(201).json({
            message: 'User fetched successfully!',
            user: user,
        });

         
    })
    .catch(err => {
        next(err);
    })

}

exports.updateUser = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Failed to validate!');
        error.statusCode = 422;
        error.data = errors.array();
        //to keep the errors retrieved by validation!
        throw error;

    }
    const userId = req.params.id;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    let newPass;
    bcrypt.hash(password, 12)
        .then(hashedPass => {

            newPass = hashedPass;
            return User.findById(userId).populate('notes');
            
        }).then(user => {
            if (!user) {
                const error = new Error('No user with that email!');
                error.statusCode = 400;
                throw error;
            }
            user.email = email;
            user.password = newPass;
            user.name = name;
            return user.save();
            
        })
        .then(result => {
            return res.status(201).json({
                message: 'User updated successfully!',
                userId: result._id,
            });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
exports.deleteUser = (req, res, next) => {

    const userId = req.params.id;

    User.findByIdAndRemove(userId)
    .then(result=> {
        console.log(result);

        result.remove();

        return res.status(200).json({
            message: 'User deleted successfully!',
            userId: result._id,
        });

    })
    .catch(err => {
        next(err);
    })



}