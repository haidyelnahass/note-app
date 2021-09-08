const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const noteController = require('../controllers/note');

router.post('/notes', [
    body('color')
        .trim()
        .isHexColor()
        .withMessage('WRONG_COLOR_FORMAT')
], noteController.postNote);

router.get('/notes', [], noteController.getNotes);

router.put('/notes/:id', [
    body('color')
        .trim()
        .isHexColor()
        .withMessage('WRONG_COLOR_FORMAT')
], noteController.editNote)

router.delete('/notes/:id', [], noteController.delete)

router.get('/notes/:id', [], noteController.getNoteById)

module.exports = router;