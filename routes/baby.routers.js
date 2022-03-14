import express from 'express'
const router = express.Router();
import babyController from '../controllers/baby.controller.js';
import upload_image from '../middlewares/upload_image.js'
import imageController from '../controllers/image.controller.js'

// Upload Image
router.post('/image/upload', upload_image.single('file'), async (req, res) => {
    let response = await imageController.uploadImage(req.file)
    console.log(response)
    res.send(response)
})

// get image with id
router.get('/image/:id', async (req, res) => {
    await imageController.getImage(req, res)
});

router.delete('/image/:filename', async (req, res) => {
    await imageController.deleteImage(req, res)
});

// Get All baby of IdAccount
router.get('/:idAccount', async (req, res) => {
    await babyController.getAllBaby(req, res)
});

//Get Single Baby
router.get('/single/:id', async (req, res) => {
    await babyController.getBaby(req, res)
});

// Add Baby
router.post('/add', async (req, res) => {
    await babyController.addBaby(req, res)
});

// Update Baby
router.put('/update/:id', async (req, res) => {
    await babyController.updateBaby(req, res)
});

// Delete Baby
router.delete('/:id', async (req, res) => {
    await babyController.deleteBaby(req, res)
});

export default router
