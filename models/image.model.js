const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // image: {
    //     data: Buffer,
    //     contentType: String,
    // },
});

const imageModel = mongoose.model('image', ImageSchema);

module.exports = imageModel;
