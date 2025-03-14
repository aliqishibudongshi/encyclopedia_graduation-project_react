// src/views/Dashboard/Profile/ProfileData.jsx
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiSteam } from "react-icons/si";
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import {
    Collapse,
    Card,
    Row,
    Col,
    message
} from 'antd';
import { bindPlatform, updateGames } from '../../../../redux/slices/authSlice';
import ProfileGameList from '../../../../components/Profile/ProfileGameList';
import PlatformsInfo from '../../../../components/Profile/PlatformsInfo';
import { API_BASE_URL } from '../../../../config';

// styled-components样式
const ProfileDataContainer = styled.div`
    padding: 10px;
`;


export default function ProfileData() {
    const [activeKey, setActiveKey] = useState();
    const token = useSelector(state => state.auth.token);
    const steam = useSelector(state => state.auth.platforms.steam || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Steam绑定处理
    const handleSteamBind = async () => {
        try {
            // 生产环境走OpenID流程
            if (process.env.NODE_ENV === 'production') {
                window.location.href = `${API_BASE_URL}/api/auth/steam/bind`;
            } else {
                const { data } = await axios.get(`${API_BASE_URL}/api/auth/steam/bind`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                dispatch(bindPlatform({
                    platform: 'steam',
                    data: data.steamId
                }));
            }
        } catch (error) {
            console.error("绑定失败:", error);
        }
    };

    // 获取 Steam 游戏
    const fetchSteamGames = useCallback(async (steamId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/steam/games/${steamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("输出res.data：", res.data);
            return res.data;
        } catch (error) {
            console.error('Steam API Error:', error);
            return [];
        }
    }, [token]);

    // 绑定后自动加载数据
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const { games, profile, totalPlaytime } = await fetchSteamGames(steam.steamId);
                dispatch(updateGames({ platform: 'steam', games, profile, totalPlaytime }));
            } catch (err) {
                setError('数据加载失败，请重试');
                message.error('游戏数据加载失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        if (steam.bound && steam.steamId && (!steam.games || steam.games.length === 0)) {
            loadData();
        }
    }, [steam.bound, steam.steamId, steam.games, steam.games?.length, dispatch, fetchSteamGames]);


    // 嵌套的折叠面板的items
    const collapseItemsNest = [
        {
            key: '1',
            label: <SiSteam />,
            children: (
                <Row gutter={16} >
                    <Col span={24}>
                        <Card
                            bordered={false}
                        >
                            <PlatformsInfo type="steam" />
                            <ProfileGameList
                                type="steam"
                                isBound={steam.bound}
                                dataSource={steam.games}
                                onBind={handleSteamBind}
                                loading={loading}
                                error={error}
                                onGameClick={(type, appid) => navigate(`/dashboard/illustrations?type=${type}&appid=${appid}`)}
                            />
                        </Card>
                    </Col>
                </Row >
            )
        }
    ];

    // 折叠面板的items
    const collapseItems = [
        {
            key: '1',
            label: '封闭生态圈（手动标记）',
            children: (
                <Row gutter={16} >
                    <Col span={24}>
                        <Card
                            title='默认游戏'
                            bordered={false}
                        >
                            <PlatformsInfo type="default" />
                            <ProfileGameList
                                type="default"
                                isBound={true}
                                onGameClick={(type, appid) => navigate(`/dashboard/illustrations?type=${type}&appid=${appid}`)}
                            />
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: '2',
            label: '非封闭生态圈',
            children: <Collapse items={collapseItemsNest} />
        }
    ];

    return (
        <ProfileDataContainer>
            <Collapse
                items={collapseItems}
                activeKey={activeKey}
                onChange={setActiveKey}
                accordion
            />
        </ProfileDataContainer>
    );
}