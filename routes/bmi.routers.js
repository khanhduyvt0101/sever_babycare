import express from 'express'
const router = express.Router();
import bmiController from '../controllers/bmi.controller.js'

router.get('/:idBaby', async (req, res) => {
    await bmiController.getAllBMIForIdBaby(req, res)
});

router.post('/add', async (req, res) => {
    await bmiController.addBMI(req, res)
});

router.put('/update/:id', async (req, res) => {
    await bmiController.updateBMI(req, res)
});

router.delete('/:id', async (req, res) => {
    await bmiController.deleteBMI(req, res)
});

export default router