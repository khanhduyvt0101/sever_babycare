import BMI from '../models/bmi.model.js'
import Baby from '../models/baby.model.js';
import _ from 'lodash'

async function getAllBMIForIdBaby(req, res) {
    Baby.find({ idBaby: req.params.idBaby }, (err, data) => {
        if (!err) {
            let standardRes = _.cloneDeep(response)
            standardRes.status = 500
            standardRes.message = err
            res.send(standardRes)
        } if (!data.length) {
            standardRes.status = 400
            standardRes.message = 'Not find idBaby in database'
            res.send(standardRes)
        } else {
            BMI.find({ idBaby: req.params.idBaby }, (err, data) => {
                if (!err) {
                    let standardRes = _.cloneDeep(response)
                    standardRes.status = 200
                    standardRes.data = data
                    res.send(standardRes)
                } else {
                    standardRes.status = 400
                    standardRes.message = err
                    console.log(standardRes)
                }
            })
        }
    })
}

async function addBMI(req, res) {
    const emp = new BMI({
        type: req.body.type,
        idBaby: req.body.idBaby,
        value: req.body.value,
    });
    Baby.find({ idBaby: req.body.idBaby }, (err, data) => {
        if (!err) {
            let standardRes = _.cloneDeep(response)
            standardRes.status = 500
            standardRes.message = err
            res.send(standardRes)
        } if (!data.length) {
            standardRes.status = 400
            standardRes.message = 'Not find idBaby in database'
            res.send(standardRes)
        } else {
            emp.save((err, data) => {
                let standardRes = _.cloneDeep(response)
                if (!err) {
                    standardRes.status = 200
                    standardRes.data = data
                    standardRes.message = `BMI Added for idBaby:${req.body.idBaby} Successfully`
                    res.status(200).send(standardRes)
                } else {
                    standardRes.status = 400
                    standardRes.message = err
                    res.send(standardRes)
                }
            })
        }
    })
}

async function updateBMI(req, res) {

}

async function deleteBMI(req, res) {

}

export default {
    getAllBMIForIdBaby,
    addBMI,
    updateBMI,
    deleteBMI
}