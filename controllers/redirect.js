exports.redirect = (UrlModel, ClicksModel) => {
    return async (req, res, next) => {
        try {
            const originalUrl = await UrlModel.findOneAndUpdate({ slug: req.params.slug }, { $inc: { 'clicks': 1 } });
            if (originalUrl) {
                const Clicks = new ClicksModel({
                    urlId: originalUrl._id,
                });

                Clicks.save();

                res.redirect(originalUrl.url);
            }


        } catch (error) {
            next(error)
        }
    }
}