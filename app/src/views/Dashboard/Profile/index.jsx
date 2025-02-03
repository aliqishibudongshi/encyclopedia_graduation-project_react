// Profile/index.jsx
import { useEffect, useState } from "react";
import { Tabs, Progress, Spin } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import "./index.css";
import Posts from "../../../components/Community/Posts";
import { API_BASE_URL } from "../../../config";

export default function Profile() {
    const username = useSelector(state => state.auth.username);
    const [categories, setCategories] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [loading, setLoading] = useState(true);

    // 获取分类数据
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 1. 先获取游戏ID
                const gameResponse = await axios.get(`${API_BASE_URL}/api/game`, {
                    params: { name: '黑神话悟空' }
                });
                const gameId = gameResponse.data[0]?._id;

                // 2. 获取分类
                const response = await axios.get(`${API_BASE_URL}/api/category`, {
                    params: { gameId }
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // 获取进度数据
    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/progress`, {
                    params: { username }
                });
                setProgressData(response.data);
            } catch (error) {
                console.error('进度请求错误:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProgress();
    }, [username]);

    const progressContent = (
        <div className="progress">
            {loading ? (
                <Spin size="large" />
            ) : categories.length > 0 ? (
                categories.map(category => {
                    const progress = progressData[category._id] || { percentage: 0 };
                    return (
                        <div className="progressWrapper" key={category._id}>
                            <span className="progressName">{progress.categoryName || category.name}</span>
                            <Progress
                                className="progressItem"
                                percent={progress.percentage}
                                percentPosition={{ align: 'end', type: 'inner' }}
                                size={[100, 30]}
                                strokeColor="#4caf50"
                            />
                        </div>
                    )
                })
            ) : (
                <div className="empty-tip">暂无分类数据</div>
            )}
        </div>
    );

    const tabItems = [
        {
            key: '1',
            label: '进度',
            children: progressContent,
        },
        {
            key: '2',
            label: '发帖',
            children: (
                <div className="posts">
                    <Posts showOnlyUserPosts currentUser={username} />
                </div>
            ),
        },
    ];

    return (
        <div className='profile'>
            <div className="profileWrapper">
                <div className="profileTop">
                    <img className="profileImg" src="/images/defaultAvatar.jpg" alt="avatar" />
                    <span className="profileName">{username}</span>
                </div>

                <div className="profileBottom">
                    <Tabs
                        items={tabItems}
                        defaultActiveKey="1"
                        type="card"
                    />
                </div>
            </div>
        </div>
    )
}