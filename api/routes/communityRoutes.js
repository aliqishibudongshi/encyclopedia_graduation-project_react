const express = require('express');
const multer = require('multer');
const { v4 } = require('uuid');
const { getAllPosts, createPost, likePost, commentPost, deletePost, updatePost } = require('../controllers/communityController');
const router = express.Router();

// 设置存储引擎和上传路径（这里假设将上传的图片存储在'public/uploads'目录下）
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + v4() + '.' + file.mimetype.split('/')[1]);
    }
});

// 创建multer实例
const upload = multer({ storage: storage });

router.get('/', getAllPosts);
// 使用multer中间件处理上传的文件，'image'是前端FormData中文件字段的名称
router.post('/create-post', upload.array('image'), createPost);
router.post('/like/:id', likePost);
router.post('/comment/:id', commentPost);
router.delete('/delete/:id', deletePost);
router.put('/update/:id', updatePost);

module.exports = router;