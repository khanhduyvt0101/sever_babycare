import express from 'express'
const router = express.Router();
import ObjectId from 'mongoose'
import Baby from '../models/baby.model.js'
import upload_image from '../middlewares/upload_image.js'
import Grid from 'gridfs-stream'
import mongoose from 'mongoose'
import imageController from '../controllers/image.controller.js'
import response from '../models/response.model.js'
ObjectId.Types.ObjectId

// Upload Image
let gfs, gridfsBucket
const conn = mongoose.connection
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos',
    });
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('photos')
});

router.post('/image/upload', upload_image.single('file'), async (req, res) => {
    let response = await imageController.upload(req.file)
    console.log(response)
    res.send(response)
})

// media image
router.get('/image/:id', async (req, res) => {
    let standardRes = response
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
                    standardRes.data = readStream
                    res.send(standardRes)
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
});

router.delete('/image/:filename', async (req, res) => {
    let standardRes = response
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
});

// Get All baby
router.get('/', (req, res) => {
    Baby.find({}, (err, data) => {
        if (!err) {
            let standardRes = response
            standardRes.status = 200
            standardRes.data = data
            res.send(standardRes)
        } else {
            standardRes.status = 400
            standardRes.message = err
            console.log(standardRes)
        }
    });
});

//Get Single Baby
router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        let standardRes = response
        standardRes.status = 400
        standardRes.message = `No baby With Given ID : ${req.params.id}`
        return res.status(400).send(standardRes)
    }

    Baby.findById(req.params.id, (err, data) => {
        let standardRes = response
        if (!err) {
            standardRes.status = 200
            standardRes.data = data
            res.send(standardRes)
        } else {
            standardRes.status = 400
            standardRes.message = err
            res.send(standardRes)
        }
    });
});

// Add Baby
router.post('/add', (req, res) => {
    const emp = new Baby({
        gender: req.body.gender,
        name: req.body.name,
        idAccount: req.body.idAccount,
        image: req.body.image,
    });
    emp.save((err, data) => {
        let standardRes = response
        if (!err) {
            standardRes.status = 200
            standardRes.data = data
            standardRes.message = 'Baby Added Successfully'
            res.status(200).send(standardRes)
        } else {
            standardRes.status = 400
            standardRes.message = err
            res.send(standardRes)
        }
    });
});

// Update Baby
router.put('/update/:id', (req, res) => {
    const emp = {
        birth: req.body.birth,
        gender: req.body.gender,
        name: req.body.name,
        idAccount: req.body.idAccount,
        image: req.body.image,
    };
    Baby.findByIdAndUpdate(
        req.params.id,
        { $set: emp },
        { new: true },
        (err, data) => {
            let standardRes = response
            if (!err) {
                standardRes.status = 200
                standardRes.data = data
                standardRes.message = 'Baby Updated Successfully'
                res.status(200).send(standardRes)
            } else {
                standardRes.status = 400
                standardRes.message = err
                res.send(standardRes)
            }
        }
    );
});

// Delete Baby
router.delete('/:id', (req, res) => {
    Baby.findByIdAndRemove(req.params.id, (err, data) => {
        let standardRes = response
        if (!err) {
            standardRes.status = 200
            standardRes.data = data
            standardRes.message = 'Baby deleted'
            res.status(200).send(standardRes)
        } else {
            standardRes.status = 400
            standardRes.message = err
            res.send(standardRes)
        }
    });
});

export default router
