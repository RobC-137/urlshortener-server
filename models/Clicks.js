const mongoose = require('mongoose');

const UrlSchema = mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

module.exports = mongoose.model('clicks', UrlSchema);