import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { message } from "antd";
import { FileImageOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const CommunityShare = styled.div`
    width: 100%;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    background-color: #fff;

    .shareWrapper {
        padding: 10px;
    }

    .shareTop {
        display: flex;
        align-items: center;
    }

    .shareProfileImg {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .shareInput {
        width: 100%;
        border: none;
        outline: none;
        font-size: 16px;
    }

    .shareInput:focus {
        outline: none;
    }

    .shareHr {
        margin: 20px;
    }

    .shareBottom {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .shareOptions{
        margin-top: 10px;
    }

    .shareOption{
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .shareIcon{
        font-size: 20px;
        margin-right: 5px;
        color: #757575;
    }

    .shareOptionText{
        font-size: 14px;
        font-weight: 500;
        color: #757575;
    }

    .shareButton{
        border: none;
        padding: 7px;
        border-radius: 5px;
        background-color: #5CAE4C;
        font-weight: 500;
        margin-top: 5px;
        cursor: pointer;
        color: white;
    }
    
    .uploadedImages {
        display: flex;
        margin-top: 10px;
        gap: 10px;
        flex-wrap: wrap;
    }

    .imageContainer {
        position: relative;
        display: inline-block;
    }

    .uploadedImage {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .deleteIcon {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: white;
        border-radius: 50%;
        cursor: pointer;
        color: red;
        font-size: 18px;
    }

    .error {
        color: red;
        margin-top: 5px;
    }
`;

export default function Share() {
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const username = useSelector((state) => state.auth.username);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check if adding these files exceeds the limit
        if (images.length + files.length > 6) {
            setError("只能上传六张图片");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }

        const newImages = files.map((file) => ({
            id: URL.createObjectURL(file), // Use unique URLs as IDs
            file,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleDeleteImage = (id) => {
        const updatedImages = images.filter((image) => image.id !== id);
        setImages(updatedImages);

        // Hide the error if there are now fewer than six images
        if (updatedImages.length < 6) {
            setError("");
        }
    };

    const handleSubmit = () => {
        if (!content && images.length === 0) {
            messageApi.open({
                type: 'warning',
                content: "请添加一些内容或上传图片"
            });
            return;
        }

        if (!username) {
            messageApi.open({
                type: 'error',
                content: "获取用户信息失败，请重新登录"
            });
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("content", content);
        if (images.length > 0) {
            images.forEach((image) => {
                formData.append('image', image.file);
            });
        }
        // Send data to backend
        axios.post(`${API_BASE_URL}/api/community/create-post`, formData)
            .then((response) => {
                messageApi.open({
                    type: 'success',
                    content: "分享成功"
                });
                setContent("");
                setImages([]);
            })
            .catch((error) => {
                messageApi.open({
                    type: 'error',
                    content: "分享失败"
                });
                console.error("Failed to create post", error);
            });
    };

    return (
        <CommunityShare>
            {contextHolder}
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src="/images/defaultAvatar.jpg" alt="avatar" />
                    <input
                        placeholder="分享你此刻的想法"
                        className="shareInput"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <hr className="shareHr" />
                <div className="shareBottom">
                    <div className="shareOptions">
                        <label className="shareOption">
                            <FileImageOutlined className="shareIcon" />
                            <span className="shareOptionText">图片</span>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleImageUpload}
                                name="image"
                            />
                        </label>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="uploadedImages">
                        {images.map(image => (
                            <div className="imageContainer" key={image.id}>
                                <img
                                    src={image.id}
                                    alt="Uploaded"
                                    className="uploadedImage"
                                />
                                <CloseCircleOutlined
                                    className="deleteIcon"
                                    onClick={() => handleDeleteImage(image.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="shareButton" onClick={handleSubmit}>分享</button>
                </div>
            </div>
        </CommunityShare>
    )
}
