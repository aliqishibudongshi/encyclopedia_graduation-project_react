import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
    MoreOutlined,
    LikeOutlined,
    CommentOutlined,
    FileImageOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { Dropdown, Image, Drawer, message } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const CommunityPosts = styled.div`
    .postWrapper {
        width: 100%;
        border-radius: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin: 30px 0;
        box-sizing: border-box;
        background-color: #f9f9f9;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .postTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .postTopLeft {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .postTopRight {
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
        &:hover {
            color: #333;
        }
    }

    .postProfileImg {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .postUsername {
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }

    .postDate {
        font-size: 14px;
        color: #999;
    }

    .postCenter {
        margin: 20px 0;
    }

    .postImgWrapper {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .ant-image {
        width: 30%;
        margin: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        transition: transform 0.3s ease;
        &:hover {
            transform: scale(1.05);
        }
    }

    .postBottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: #666;
    }

    .postLike,
    .postComments {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
        gap: 5px;
        transition: color 0.3s ease;
        &:hover {
            color: #333;
        }
    }

    .postLike {
        border-right: 1px solid #ccc;
    }

    .postLikeCounter,
    .postCommentCounter {
        color: #333;
    }
`;

const StyledUpdatedDrawer = styled(Drawer)`
    .editImageContainer {
        position: relative;
        display: inline-block;
    }

    .editUploadedImage {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .editDeleteIcon {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: white;
        border-radius: 50%;
        cursor: pointer;
        color: red;
        font-size: 18px;
    }

    .editError {
        color: red;
        margin-top: 5px;
    }

    .editUploadedImages {
        display: flex;
        margin-top: 10px;
        gap: 10px;
        flex-wrap: wrap;
    }

    .editablePostText {
        width: 100%;
        height: 200px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
        resize: none; /* 禁止拉伸边框 */
        max-height: 150px; /* 设置最大高度 */
        overflow-y: auto; /* 超出时显示滚动条 */
    }

    .editablePostImgOption {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-top: 10px;
    }

    .uploadImgIcon {
        font-size: 20px;
        margin-right: 5px;
        color: #757575;
    }

    .uploadImgIconText {
        font-size: 14px;
        font-weight: 500;
        color: #757575;
    }

    button {
        border: none;
        padding: 7px;
        border-radius: 5px;
        background-color: #5CAE4C;
        font-weight: 500;
        margin-top: 5px;
        cursor: pointer;
        color: white;
    }
`;

const StyledCommentDrawer = styled(Drawer)`
    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .postCommentWrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }

    .postCommentInput {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
    }

    .postCommentBtn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #5CAE4C;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: rgb(86, 160, 71);
        }
    }

    .postCommentList {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .postCommentItem {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .postCommentUsername {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    .postCommentDate {
        font-size: 14px;
        color: #999;
        margin-left: 10px;
    }

    .postCommentContent {
        font-size: 14px;
        color: #666;
    }
`;

export default function Posts({ showOnlyUserPosts, currentUser }) {
    const [posts, setPosts] = useState([]);
    const [isOpenComment, setIsOpenComment] = useState(false);
    const [comment, setComment] = useState(null);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    // Store the current post ID
    const [selectedPostId, setSelectedPostId] = useState(null);
    // Access user from Redux store
    const username = useSelector((state) => state.auth.username);
    // 控制修改当前post的Drawer
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [editablePost, setEditablePost] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [imageError, setImageError] = useState("");

    // 获取帖子数据
    const fetchPosts = async () => {
        try {
            const url = showOnlyUserPosts
                ? `${API_BASE_URL}/api/community?username=${currentUser}`
                : `${API_BASE_URL}/api/community`;

            const response = await fetch(url);
            let data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };
    // 更新useEffect依赖
    useEffect(() => {
        fetchPosts();
    }, [showOnlyUserPosts, currentUser]);

    // 点赞帖子
    const handleLike = async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/community/like/${id}`, {
                data: {
                    username
                }
            });
            const updatedLikes = response.data.likes;
            setPosts(posts.map(post => post._id === id ? { ...post, likes: updatedLikes } : post));
        } catch (error) {
            console.error('Failed to like post', error);
        }
    };

    // 打开评论抽屉
    const openDrawer = (id) => {
        setSelectedPostId(id); // Store the selected post ID
        setIsOpenComment(true);
    };

    // 关闭评论抽屉
    const closeDrawer = () => {
        setSelectedPostId(null); // Reset the post ID
        setIsOpenComment(false);
    };

    // Filter comments for the selected post
    const selectedPost = posts.find((post) => post._id === selectedPostId);

    // 发送评论
    const handleSendComment = async (postId) => {
        if (!comment || comment.trim() === "") {
            alert("评论不能为空！"); // Prevent empty comments
            return;
        }

        setIsCommentLoading(true); // Start loading
        try {
            // Make the API request
            const response = await axios.post(`${API_BASE_URL}/api/community/comment/${postId}`, {
                username,
                comment,
            });

            // Update local state with the new comment
            const updatedPost = response.data;
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === postId ? updatedPost : post))
            );

            // Clear comment input field
            setComment("");
            closeDrawer(); // Close the drawer if desired

            messageApi.open({
                type: "success",
                content: "评论发送成功！"
            });
        } catch (error) {
            messageApi.open({
                type: "error",
                content: error
            });

            // Provide user feedback for error
            alert("发送评论失败，请稍后再试！");
        } finally {
            setIsCommentLoading(false); // End loading
        }
    };

    // 更新帖子打开侧边抽屉
    const handleUpdate = (post) => {
        const newImages = post.imagePath.map(image => {
            const correctImgPath = image.split('public\\')[1].replace('\\', '/');
            return {
                id: `${API_BASE_URL}/${correctImgPath}`,
                file: null,
                originalPath: image
            }
        });
        setEditablePost({
            ...post,
            newImages
        });
        setIsEditDrawerOpen(true);
    };

    // 保存更新后的帖子
    const handleSavePost = async (post) => {
        const formData = new FormData();
        formData.append("content", post.content);
        if (post.newImages) {
            post.newImages.forEach((image) => {
                if (image.file) {
                    formData.append('image', image.file);
                } else if (image.originalPath) {
                    formData.append('originalImage', image.originalPath);
                }
            });
        }
        try {
            const response = await axios.put(`${API_BASE_URL}/api/community/update/${post._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedPost = response.data;
            setPosts((prevPosts) =>
                prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
            );
            message.success("状态更新成功！");
            setIsEditDrawerOpen(false);
        } catch (error) {
            console.error("Failed to update post", error);
            message.error("无法更新状态。请重试！");
        }
    };

    // 处理图片上传
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check if adding these files exceeds the limit
        if ((editablePost.newImages.length + files.length) > 6) {
            setImageError("只能上传六张图片");
            setTimeout(() => {
                setImageError("");
            }, 2000);
            return;
        }

        const newImages = files.map((file) => ({
            id: URL.createObjectURL(file),
            file,
        }));
        setEditablePost((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...newImages]
        }));
    };

    // 处理图片删除
    const handleDeleteImage = (id) => {
        const updatedImages = editablePost.newImages.filter((image) => image.id !== id);
        setEditablePost((prev) => ({
            ...prev,
            newImages: updatedImages
        }));

        // Hide the error if there are now fewer than six images
        if (updatedImages.length < 6) {
            setImageError("");
        }
    };

    // 删除帖子
    const handleDelete = async (id) => {
        try {
            console.log('delete' + id);
            const response = await axios.delete(`${API_BASE_URL}/api/community/delete/${id}`);
            const { status, message } = response.data;

            setPosts(prevPost => prevPost.filter(post => post._id !== id));

            messageApi.open({
                type: `${status}`,
                content: `${message}`
            });

        } catch (error) {
            console.error("Failed to delete post", error);
            message.error("无法删除状态。请重试！");
        }
    };

    // 计算时间差并格式化
    const formatTime = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffTime = Math.abs(now - postDate);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays}天前`;
        } else if (diffHours > 0) {
            return `${diffHours}小时前`;
        } else {
            return `${diffMinutes}分钟前`;
        }
    };

    return (
        <CommunityPosts>
            {contextHolder}
            {posts.map((post) => {
                // 当前用户才显示的操作集合，用来修改和删除自己的状态
                const operationItems = [
                    {
                        label: <span onClick={() => handleUpdate(post)}>修改帖子</span>,
                        key: '0',
                    },
                    {
                        label: <span onClick={() => handleDelete(post._id)}>删除帖子</span>,
                        key: '1',
                    },
                ];
                return (
                    <div className="postWrapper" key={post._id}>
                        <div className="postTop">
                            <div className="postTopLeft">
                                <img
                                    className="postProfileImg"
                                    src="/images/defaultAvatar.jpg"
                                    alt="avatar"
                                />
                                <span className="postUsername">
                                    {post.username}
                                </span>
                                <span className="postDate">{formatTime(post.createdAt)}</span>
                            </div>
                            <div className="postTopRight">
                                {post.username === username ?
                                    <Dropdown
                                        menu={{
                                            items: operationItems,
                                        }}
                                        trigger={['click']}
                                    >
                                        <MoreOutlined />
                                    </Dropdown>
                                    : null
                                }
                                <StyledUpdatedDrawer
                                    title="正在编辑"
                                    placement="right"
                                    onClose={() => setIsEditDrawerOpen(false)}
                                    open={isEditDrawerOpen}
                                >
                                    {editablePost && (
                                        <div className="editablePost">
                                            <textarea
                                                value={editablePost.content}
                                                onChange={(e) =>
                                                    setEditablePost({
                                                        ...editablePost,
                                                        content: e.target.value
                                                    })
                                                }
                                                style={{ width: '100%' }}
                                                className="editablePostText"
                                                maxLength={140}
                                            />
                                            <div className="editablePostImgOptions">
                                                <label className="editablePostImgOption">
                                                    <FileImageOutlined className="uploadImgIcon" />
                                                    <span className="uploadImgIconText">图片</span>
                                                    <input
                                                        type="file"
                                                        style={{ display: "none" }}
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        name="image"
                                                        multiple
                                                    />
                                                </label>
                                            </div>
                                            {imageError && <div className="editError">{imageError}</div>}
                                            <div className="editUploadedImages">
                                                {editablePost.newImages && editablePost.newImages.map((image, index) => (
                                                    <div className="editImageContainer" key={image.id}>
                                                        <img
                                                            src={image.id}
                                                            alt="Uploaded"
                                                            className="editUploadedImage"
                                                        />
                                                        <CloseCircleOutlined
                                                            className="editDeleteIcon"
                                                            onClick={() => handleDeleteImage(image.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    await handleSavePost(editablePost);
                                                    setIsEditDrawerOpen(false);
                                                }}
                                            >
                                                保存修改
                                            </button>
                                        </div>
                                    )}
                                </StyledUpdatedDrawer>
                            </div>
                        </div>
                        <div className="postCenter">
                            <span className="postText">{post.content}</span>
                            <div className="postImgWrapper">
                                {post.imagePath ? post.imagePath.map((image, index) => {
                                    const fixedPath = image.replace(/\\/g, '/');
                                    const correctPath = fixedPath.replace('public/', '');
                                    const imageName = correctPath.split('uploads/')[1];
                                    return <Image
                                        className="postImg"
                                        key={index}
                                        src={`${API_BASE_URL}/${correctPath}`}
                                        alt={imageName}
                                    />;
                                }) : <Image
                                    width={200}
                                    height={200}
                                    src="error"
                                    fallback="data:image/png;base64,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"
                                />}
                            </div>
                        </div>
                        <div className="postBottom">
                            <div className="postLike" onClick={() => handleLike(post._id)}>
                                <LikeOutlined />
                                {post.likes ? <span className="postLikeCounter">{post.likes.length}</span> : <span className="postLikeCounter">0</span>}
                            </div>
                            <div className="postComments">
                                <CommentOutlined onClick={() => openDrawer(post._id)} />
                                <StyledCommentDrawer title="评论" onClose={closeDrawer} open={isOpenComment} placement="bottom">
                                    <div className="postCommentWrapper">
                                        <input
                                            className="postCommentInput"
                                            placeholder="输入评论..."
                                            value={comment || ""}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button
                                            className="postCommentBtn"
                                            onClick={() => handleSendComment(selectedPostId)}
                                            disabled={isCommentLoading}
                                        >
                                            {isCommentLoading ? "发送中..." : "发送"}
                                        </button>
                                    </div>
                                    <div className="postCommentList">
                                        {selectedPost?.comments?.length > 0 ? selectedPost.comments.map((comment, index) => (
                                            <div className="postCommentItem" key={index}>
                                                <div className="postCommentItemTop">
                                                    <span className="postCommentUsername">{comment.username}</span>
                                                    <span className="postCommentDate">{formatTime(comment.createdAt)}</span>
                                                </div>
                                                <p className="postCommentContent">{comment.comment}</p>
                                            </div>
                                        )) : <div className="postCommentItem">暂无评论</div>}
                                    </div>
                                </StyledCommentDrawer>
                                {post.likes ? <span className="postCommentCounter">{post.comments.length}</span> : <span className="postCommentCounter">0</span>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </CommunityPosts>
    )
}
