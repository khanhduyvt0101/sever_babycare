import mongoose from 'mongoose'
import Baby from '../models/baby.model.js'
import response from '../models/response.model.js'
import checkValid from '../middlewares/check-valid-model.js'
import _ from 'lodash'

async function getAllBaby(req, res) {
    let standardRes = await checkValid.user(req.params.idAccount)
    if (standardRes != null) {
        return res.send(standardRes)
    } else {
        let result = _.cloneDeep(response)
        await Baby.find({ idAccount: req.params.idAccount }).then((data) => {
            if (data) {
                result.status = 200
                result.data = data
            } else {
                result.status = 400
                result.message = 'Cannot find Baby in DB'
            }
        }).catch((err) => {
            result.status = 500
            result.message = err
        })
        return res.send(result)
    }
}

async function getBaby(req, res) {
    let standardRes = _.cloneDeep(response)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        standardRes.status = 400
        standardRes.message = `No baby With Given ID : ${req.params.id}`
        return res.status(400).send(standardRes)
    }

    Baby.findById(req.params.id, (err, data) => {
        if (!err) {
            standardRes.status = 200
            standardRes.data = data
            res.send(standardRes)
        } else {
            standardRes.status = 400
            standardRes.message = err
            res.send(standardRes)
        }
    })
}

async function addBaby(req, res) {
    let validUser = await checkValid.user(req.body.idAccount)
    let validFullField = checkValidFullFieldBody(req)
    if (validUser != null) {
        return res.send(validUser)
    } else if (validFullField != null) {
        return res.send(validFullField)
    } else {
        let standardRes = _.cloneDeep(response)
        const emp = new Baby({
            birth: req.body.birth,
            gender: req.body.gender,
            name: req.body.name,
            idAccount: req.body.idAccount,
            idImage: req.body.idImage,
        })
        emp.save((err, data) => {
            if (!err) {
                standardRes.status = 200
                standardRes.data = data
                standardRes.message = 'Baby Added Successfully'
            } else {
                standardRes.status = 400
                standardRes.message = err
            }
            return res.send(standardRes)
        })
    }
}

async function updateBaby(req, res) {
    let validUser = await checkValid.user(req.body.idAccount)
    let validFullField = checkValidFullFieldBody(req)
    if (validUser != null) {
        return res.send(validUser)
    } else if (validFullField != null) {
        return res.send(validFullField)
    }
    else {
        let standardRes = _.cloneDeep(response)
        const emp = {
            birth: req.body.birth,
            gender: req.body.gender,
            name: req.body.name,
            idAccount: req.body.idAccount,
            idImage: req.body.idImage,
        }
        Baby.findByIdAndUpdate(
            req.params.id,
            { $set: emp },
            { new: true },
            (err, data) => {
                if (!err) {
                    standardRes.status = 200
                    standardRes.data = data
                    standardRes.message = 'Baby Updated Successfully'
                    res.send(standardRes)
                } else {
                    standardRes.status = 400
                    standardRes.message = err
                    res.send(standardRes)
                }
            }
        )
    }
}

async function deleteBaby(req, res) {
    Baby.findByIdAndRemove(req.params.id, (err, data) => {
        let standardRes = _.cloneDeep(response)
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
    })
}

function checkValidFullFieldBody(req) {
    let standardRes = _.cloneDeep(response)
    if (!req.body.gender || !req.body.name || !req.body.idAccount || !req.body.idImage || !req.body.bird) {
        standardRes.status = 400
        standardRes.message = `Missing other field in body`
        return standardRes
    }
    return null
}

export default {
    getAllBaby,
    getBaby,
    addBaby,
    updateBaby,
    deleteBaby
}