import multer from 'multer'
import path from 'path'

// 存储规则
const storage = multer.diskStorage({
    //文件存到哪里
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    //防止重名
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        //唯一文件
        cb(null, Date.now() + ext)
    }
})

const upload = multer({ storage })

export default upload