import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import dotenv from 'dotenv'
dotenv.config()

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg']

        if (match.indexOf(file.mimetype) === -1) {
            const filename = file.originalname
            return filename
        }

        return {
            bucketName: 'photos',
            filename: file.originalname,
        };
    },
});

export default multer({ storage })
