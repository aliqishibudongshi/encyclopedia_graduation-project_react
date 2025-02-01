const Community = require('../models/Community');

// 获取帖子
exports.getAllPosts = async (req, res) => {
    try {
        const { username } = req.query;
        const query = username ? { username } : {};

        const posts = await Community.find(query)
            .sort({ createdAt: -1 })
            .populate('comments');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// 创建帖子
exports.createPost = async (req, res) => {
    try {
        const { username, content } = req.body;
        const imagePath = req.files ? req.files.map(file => file.path) : [];
        const newPost = new Community({
            username,
            content,
            imagePath
        });
        await newPost.save();
        res.json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// 点赞帖子
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const username = req.body.data.username;

        const post = await Community.findById(postId);

        const existingLike = post.likes.find(like => like.username.toString() === username.toString());

        if (existingLike) {
            // 用户已经点赞，取消点赞
            post.likes = post.likes.filter(like => like.username.toString() !== username.toString());
        } else {
            // 用户未点赞，添加点赞记录
            post.likes.push({ username });
        }
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        console.error('Error in likePost:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// 评论帖子
exports.commentPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { username, comment } = req.body;
        const post = await Community.findById(postId);
        post.comments.push({ username, comment });
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to comment on post' });
    }
};

// 删除帖子
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await Community.findByIdAndDelete(postId);
        res.json({ status: 'success', message: '状态删除成功！' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

// 更新修改帖子
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const newImageFiles = req.files || [];
        const post = await Community.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.content = content;

        // 处理新上传的图片路径
        const newImagePaths = newImageFiles.map(file => file.path);
        // 合并原有图片路径和新上传的图片路径
        post.imagePath = [...post.imagePath, ...newImagePaths];

        await post.save();
        res.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: 'Failed to update post' });
    }
};
