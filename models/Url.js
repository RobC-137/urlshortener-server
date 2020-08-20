const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UrlSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },

    clicks: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    }

}, { timestamps: true });

UrlSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('url', UrlSchema);