const { Schema } = require("mongoose");
const { model } = require("../models/Url");

exports.send_all_urls_paginated_sorted = (UrlModel, TypeObjectId) => {

    return async (req, res, next) => {
        try {
            const { user, sort, paginate } = res.locals;
            let options = {};

            if (sort) options['sort'] = sort;
            if (paginate) {
                options['page'] = paginate.page;
                options['limit'] = paginate.limit;
            }
            const results = await UrlModel.paginate({
                userId: TypeObjectId(user)
            }, options)

            res.send({
                count: results.totalDocs,
                results: results.docs
            })
            // res.json({ count: res.locals.count, results: res.locals.results });
        } catch (error) {
            next(error)
        }
    }
}

exports.save_url_to_db = (UrlModel, SchemaValidator, SlugGenerator, TypeObjectId) => {
    return async (req, res, next) => {
        // res.send('POST request to the homepage')
        let { slug, url } = req.body;
        const domain = process.env.THIS_DOMAIN;

        try {


            //URL validates
            const urlValid = new URL(url);
            if (!slug) {
                let n = 6;
                let existing = true;
                let count = 0;
                while (existing) {
                    slug = SlugGenerator(n);
                    const slugInDB = await UrlModel.findOne({ slug: slug })

                    if (slugInDB) count++;
                    else existing = false;

                    if (count === 15) n++;
                }
            } else {
                await SchemaValidator.validate({
                    slug,
                    url
                });

                const existing = await UrlModel.findOne({ slug: slug })
                if (existing) throw new Error('Slug in use');

            }
            slug = slug.toLowerCase();

            let modelObject = {
                url: url,
                slug: slug,
                domain: domain,
            }
            const { user } = res.locals;
            if (user) modelObject['userId'] = TypeObjectId(user)

            //Url: model
            const urlDb = new UrlModel(modelObject);
            // console.log(req);

            const saved = await urlDb.save();
            res.json({
                saved: true,
                shortenedUrl: `${domain}/${slug}`
            });
        } catch (error) {
            next(error);
        }
    }
}

exports.delete_url = (UrlModel, TypeObjectId) => {
    return async (req, res, next) => {


        const { id } = req.params
        console.log('ID: ' + id);

        try {
            const deleted = await UrlModel.findByIdAndDelete({
                _id: TypeObjectId(id)
            })

            res.send({
                message: 'deleted'
            });
        } catch (error) {
            next(error)
        }
    }
}


//TypeObjectId: the id Object Type of the db
exports.get_urls_group_by_date = (ClicksModel, TypeObjectId) => {
    return async (req, res, next) => {
        const { id } = req.params

        try {

            const result = await ClicksModel.aggregate([
                {
                    $match: {
                        "urlId": TypeObjectId(id)
                    }
                },
                {
                    $group: {

                        _id: {
                            $concat: [

                                { $toString: { $year: "$createdAt" } },
                                '-',
                                { $toString: { $month: "$createdAt" } },
                                '-',
                                { $toString: { $dayOfMonth: "$createdAt" } }
                            ]
                        },
                        count: { $sum: 1 }
                    }
                },
                //sort by the string date recently created, ascending 
                {
                    $sort: {
                        _id: 1
                    }
                }

            ])
            res.send(result.map((obj) => {
                return {
                    "date": obj._id,
                    "count": obj.count
                }
            }));
        } catch (error) {
            next(error)
        }
    }
}