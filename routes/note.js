const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const noteController = require('../controllers/note');
const isAuth = require('../middleware/isAuth');



router.post('/notes', [
    body('color')
        .trim()
        .isHexColor()
        .withMessage('WRONG_COLOR_FORMAT')
],isAuth, noteController.postNote);

router.get('/notes', [], isAuth, noteController.getNotes);

router.put('/notes/:id', [
    body('color')
        .trim()
        .isHexColor()
        .withMessage('WRONG_COLOR_FORMAT')
], isAuth, noteController.editNote)

router.delete('/notes/:id', [], isAuth, noteController.delete)

router.get('/notes/:id', [],isAuth, noteController.getNoteById)

module.exports = router;