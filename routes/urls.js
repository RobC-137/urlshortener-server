const router = require('express').Router();
const Url = require('../models/Url');
const Clicks = require('../models/Clicks');
const yup = require('yup');
const mongoose = require('mongoose');
const UrlsController = require('../controllers/urls');
const { nanoid } = require('nanoid');
const { authMidleware } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().required()
});

const TypeObjectId = mongoose.Types.ObjectId;

router.get('/all', [sortParams(), pagination(), authMidleware(jwt.verify)], UrlsController.send_all_urls_paginated_sorted(Url, TypeObjectId));

router.post('/save', UrlsController.save_url_to_db(Url, schema, nanoid));
router.post('/save/user', [authMidleware(jwt.verify)], UrlsController.save_url_to_db(Url, schema, nanoid, TypeObjectId));


router.get('/bydate/:id', [authMidleware(jwt.verify), urlBelongsToUser(Url, TypeObjectId)], UrlsController.get_urls_group_by_date(Clicks, TypeObjectId));

router.delete('/:id', [authMidleware(jwt.verify), urlBelongsToUser(Url, TypeObjectId)], UrlsController.delete_url(Url, TypeObjectId));

function sortParams() {
    return (req, res, next) => {
        const sortField = req.query.sort;
        const order = req.query.order;
        if (sortField && order) {
            let sort = {};
            sort[sortField] = order;
            res.locals.sort = sort;
            console.log(sort);
        }
        next();

    }
}

function pagination() {
    return (req, res, next) => {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        if (limit && page)
            res.locals.paginate = {
                limit,
                page
            }
        next();
    }
}

function urlBelongsToUser(UrlModel, TypeObjectId) {
    return async (req, res, next) => {
        const { id } = req.params
        const { user } = res.locals

        try {
            const urlBelongsToUser = await UrlModel.find({ userId: TypeObjectId(user), _id: TypeObjectId(id) })
            if (!urlBelongsToUser.length > 0) throw new Error('Url does not belong to user')
        } catch (error) {
            error.status = 401;
            next(error)
        }
        next();
    }
}

// function pagination(model) {
//     return async (req, res, next) => {
//         const limit = parseInt(req.query.limit);
//         const page = parseInt(req.query.page);
//         console.log(limit, page);

//         const startIndex = page * limit;
//         const endIndex = (page + 1) * limit

//         res.locals.results = res.locals.results.slice(startIndex, endIndex);

//         try {
//             const totalDocs = await model.countDocuments().exec()
//             res.locals.count = totalDocs;
//             next()
//         } catch (error) {
//             next(error)
//         }

//     }
// }


module.exports = router;