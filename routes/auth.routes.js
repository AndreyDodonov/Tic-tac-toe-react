const {Router} = require('express');
const router = Router();
const controller = require('../controller/auth.controller');
const {check, validationResult} = require('express-validator');


/* /api/auth */

router.post('/register',
    [
        check('email', 'incorrect e-mail').isEmail(),
        check('password', 'incorrect password'). isLength({min: 6})
    ],
    controller.register);

router.post('/login',
    [
        check('email', 'incorrect e-mail').normalizeEmail().isEmail(),
        check('password', 'incorrect password'). exists()
    ],
    controller.login);

module.exports = router;
