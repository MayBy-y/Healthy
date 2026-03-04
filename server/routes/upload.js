import express from 'express'
import upload from '../middleware/uploads.js'

const UploadRouter = express.Router()

UploadRouter.post('/cover', upload.single('cover'), (req, res) => {
    const file = req.file

    if (!file) {
        return res.status(400).json({ message: '未上传文件' })
    }

    res.json({
        coverUrl: `/uploads/${file.filename}`
    })
})

export default UploadRouter
