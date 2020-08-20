const router = require('express').Router()
const Url = require('../models/Url');
const Click = require('../models/Clicks');
const RedirectController = require('../controllers/redirect');

router.get('/:slug', RedirectController.redirect(Url, Click));
router.get('/', (req, res) => {
    res.send('Hello World')
})

module.exports = router;