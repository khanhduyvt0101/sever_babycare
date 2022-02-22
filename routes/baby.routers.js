const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const image = require('../models/image.model');
const multer = require('multer');
const Baby = require('../models/baby.model');

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('testImage')

router.post('/upload')

// Get All baby
router.get('/baby', (req, res) => {
    Baby.find({}, (err, data) => {
        if (!err) {
            res.send('All baby: ', data);
        } else {
            console.log(err);
        }
    });
});

//Get Single Baby
router.get('/baby/:id', (req, res) => {
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
router.post('/baby/add', (req, res) => {
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
router.put('/baby/update/:id', (req, res) => {
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
router.delete('/baby/:id', (req, res) => {
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
