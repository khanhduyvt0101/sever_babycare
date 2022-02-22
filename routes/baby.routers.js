const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const image = require('../models/image.model');
const multer = require('multer');
const Baby = require('../models/baby.model');
const ImageModel = require('../models/image.model');

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage,
}).single('testImage');

router.post('/image/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            const newImage = new ImageModel({
                name: req.body.name,
                // image: {
                //     data: req.file.fieldname,
                //     contentType: 'image/png',
                // },
            });
            newImage
                .save()
                .then((image) => {
                    res.status(200).json({
                        success: true,
                        image,
                    });
                })
                .catch((err) => res.status(500).json(err));
        }
    });
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
