const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const Baby = require('../models/baby.model');
const upload_image = require('../middlewares/upload_image');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

// Upload Image
let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos',
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('photos');
});
router.post('/image/upload', upload_image.single('file'), async (req, res) => {
    if (req.file === undefined) return res.send('you must select a file.');
    const imgUrl = `http://localhost:${process.env.PORT}/baby/image/${req.file.id}`;
    return res.send(imgUrl);
});

// media image
router.get('/image/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({
            filename: req.params.filename,
        });
        if (file) {
            console.log(file);
        }
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.delete('/image/:filename', async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send('success');
    } catch (error) {
        console.log(error);
        res.send('An error occured.');
    }
});

// Get All baby
router.get('/', (req, res) => {
    Baby.find({}, (err, data) => {
        if (!err) {
            res.send('All baby: ', data);
        } else {
            console.log(err);
        }
    });
});

//Get Single Baby
router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No baby With Given ID : ${req.params.id}`);

    Baby.findById(req.params.id, (err, data) => {
        if (!err) {
            res.send('get single baby result: ', data);
        } else {
            console.log(err);
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
        if (!err) {
            res.status(200).json({
                code: 200,
                message: 'Baby Added Successfully',
                addBaby: data,
            });
            console.log('Baby Added Successfully', data);
        } else {
            console.log(err);
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
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: 'Baby Updated Successfully',
                    updateBaby: data,
                });
                console.log('Baby Updated Successfully', data);
            } else {
                console.log(err);
            }
        }
    );
});

// Delete Baby
router.delete('/:id', (req, res) => {
    Baby.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            // res.send(data);
            res.status(200).json({
                code: 200,
                message: 'Baby deleted',
                deleteBaby: data,
            });
        } else {
            console.log(err);
        }
    });
});

module.exports = router;
