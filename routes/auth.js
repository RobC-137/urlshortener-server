const router = require('express').Router();
const AuthController = require('../controllers/auth');
const User = require('../models/User');
const yup = require('yup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

router.post('/register', AuthController.register_new_user(User, schema, bcrypt.hash, bcrypt.genSalt));
router.post('/login', AuthController.login_local_user(User, schema, bcrypt, jwt.sign))
module.exports = router;