import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styled from "styled-components";
import {
    MoreOutlined,
    LikeOutlined,
    CommentOutlined,
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

    .postDate{
        font-size: 14px;
        color: #999;
    }

    .postCenter{
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

    .postBottom{
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

const StyledDrawer = styled(Drawer)`
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
        background-color:#5CAE4C;
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

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [isOpenComment, setIsOpenComment] = useState(false);
    const [comment, setComment] = useState(null);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null); // Store the current post ID
    const [messageApi, contextHolder] = message.useMessage();
    // Access user from Redux store
    const username = useSelector((state) => state.auth.username);

    // 获取帖子数据
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/community`);
            let data = await response.json();
            // Sort posts by createdAt in descending order
            data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);

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
            const updatedPost = response.data; // Assuming API returns the updated post
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === postId ? updatedPost : post))
            );

            // Clear comment input field
            setComment("");
            closeDrawer(); // Close the drawer if desired

            // Optionally show a success message
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

    // 更新帖子
    const handleUpdate = (id) => {
        console.log('update' + id);
    };

    // 删除帖子
    const handleDelete = (id) => {
        console.log('delete' + id);
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

    // 当前用户才显示的操作集合，用来修改和删除自己的状态
    const operationItems = [
        {
            label: (
                <span onClick={() => handleUpdate(0)}>
                    修改
                </span>
            ),
            key: '0',
        },
        {
            label: (
                <span onClick={() => handleDelete(1)}>
                    删除
                </span>
            ),
            key: '1',
        }
    ];
    return (
        <CommunityPosts >
            {posts.map((post) => (
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
                            {contextHolder}
                            <CommentOutlined onClick={() => openDrawer(post._id)} />
                            <StyledDrawer title="评论" onClose={closeDrawer} open={isOpenComment} placement="bottom">
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
                            </StyledDrawer>
                            {post.likes ? <span className="postCommentCounter">{post.comments.length}</span> : <span className="postCommentCounter">0</span>}
                        </div>
                    </div>
                </div>
            ))}
        </CommunityPosts>
    )
}
