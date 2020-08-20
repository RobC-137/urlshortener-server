const router = require('express').Router()
const Url = require('../models/Url');
const Click = require('../models/Clicks');
const RedirectController = require('../controllers/redirect');

router.get('/:slug', RedirectController.redirect(Url, Click));

module.exports = router;