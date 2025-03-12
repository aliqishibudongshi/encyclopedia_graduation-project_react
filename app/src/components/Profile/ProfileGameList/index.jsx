import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { List, Button, Progress, Typography } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import Loading from '../../Loading';

const { Text } = Typography;

const GameListContainer = styled.div`
    .game-item {
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 8px 0;
        box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
        background-color: #f9f9f9;
        border-radius: 15px;

        img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 16px;
        }

        .game-details {
            flex: 1;
        
            .ant-progress-bg {
                background-color: #4caf50;
            }
        }
    }

    .bind-button-container {
        text-align: center;
        padding: 20px 0;
    }

    .ant-list .ant-list-item {
        display: block;
    }
`;

export default function ProfileGameList({ dataSource, type, isBound, onBind, loading, error }) {
    const [progressData, setProgressData] = useState({});
    const username = useSelector(state => state.auth.username);

    // 获取进度数据
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/progress`, {
                    params: { username }
                });
                setProgressData(response.data);
            } catch (error) {
                console.error('进度请求错误:', error);
            }
        };

        if (username) fetchProgress();
    }, [username]);

    // 默认游戏数据模板
    const defaultGame = {
        name: '集合啦！动物森友会',
        progress: progressData,
        image: '/images/defaultGame.jpg'
    };

    // 进度计算逻辑
    const calculateProgress = (game) => {
        if (type === 'steam') return (game.achievement_ratio * 100).toFixed(1);
        if (type === 'default') return progressData.totalProgress?.percentage || 0;
        return 0;
    };

    // Progress 渲染逻辑
    const showProgress = (item) => {
        if (type === 'default') {
            return (
                <Progress
                    percent={calculateProgress(item)}
                    format={percent => `总完成度 ${percent}%`}
                />
            )
        }

        if (type === 'steam' && item.achievement_ratio !== undefined) {
            return (
                <Progress
                    percent={(item.achievement_ratio * 100).toFixed(1)}
                    format={percent => `成就完成度 ${percent}%`}
                    status="active"
                />
            )
        }

        return null;
    }

    // 绑定按钮
    if (!isBound) {
        return (
            <GameListContainer>
                <div className="bind-button-container">
                    <Button type="primary" onClick={onBind}>
                        绑定Steam
                    </Button>
                    <p style={{ marginTop: 8 }}>
                        绑定后将自动同步游戏库和成就数据
                    </p>
                </div>
            </GameListContainer>
        );
    }

    // 获取数据的loading状态
    if (isBound && (!dataSource || dataSource.length === 0)) {
        return (
            <GameListContainer>
                <div className="bind-button-container">
                    <Loading />
                </div>
            </GameListContainer>
        );
    }

    return (
        <GameListContainer>
            <List
                dataSource={type === 'default' ? [defaultGame] : dataSource}
                renderItem={(item) => (
                    <List.Item>
                        <div className="game-item">
                            <img
                                src={type === 'default' ? defaultGame.image : item.img_url}
                                alt={item.name}
                            />
                            <div className="game-details">
                                <Text strong>{item.name}</Text>
                                {showProgress(item)}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </GameListContainer>
    );
}