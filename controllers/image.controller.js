import response from '../models/response.model.js'
import Grid from 'gridfs-stream'
import mongoose from 'mongoose'
import _ from 'lodash'

let gfs, gridfsBucket
const conn = mongoose.connection
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos',
    });
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('photos')
});

async function uploadImage(file) {
    let standardRes = _.cloneDeep(response)
    if (file === undefined) {
        standardRes.status = 400
        standardRes.message = 'you must select a file.'
    } else {
        standardRes.status = 200
        standardRes.data = { idImage: file.id }
        standardRes.message = `image get at http://localhost:${process.env.PORT}/baby/image/${file.id}`
    }
    return standardRes;
}

async function getImage(req, res) {
    let standardRes = _.cloneDeep(response)
    try {
        await gfs.files.findOne(
            {
                _id: new mongoose.mongo.ObjectId(req.params.id),
            },
            (err, files) => {
                if (err) {
                    standardRes.status = 500
                    standardRes.message = err
                    res.send(standardRes)
                }
                if (files) {
                    var mime = files.contentType
                    var filename = files.filename
                    res.set('Content-Type', mime)
                    res.set(
                        'Content-Disposition',
                        'inline; filename=' + filename
                    );
                    const readStream = gridfsBucket.openDownloadStream(
                        files._id
                    );
                    standardRes.status = 200
                    standardRes.data = readStream.data
                    res.send(standardRes)
                    console.log(standardRes)
                    readStream.pipe(res)
                } else {
                    standardRes.status = 400
                    standardRes.message = 'File Not Found'
                    res.send(standardRes)
                }
            }
        );
    } catch (error) {
        standardRes.status = 500
        standardRes.message = err
        res.send(standardRes)
    }
}

async function deleteImage(req, res) {
    let standardRes = _.cloneDeep(response)
    try {
        await gfs.files.deleteOne({ filename: req.params.filename })
        standardRes.status = 200
        standardRes.data = req.params.filename
        standardRes.message = 'Image deleted'
        res.status(200).send(standardRes)
    } catch (error) {
        standardRes.status = 400
        standardRes.message = error
        res.send(standardRes)
    }
}

export default {
    uploadImage,
    getImage,
    deleteImage
}