// src/views/Dashboard/Profile/ProfileData.jsx
import { useState, useCallback } from 'react';
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
    const steam = useSelector(state => state.auth.platforms.steam);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 获取 Steam 游戏
    const fetchSteamGames = useCallback(async (steamId, page = 1) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/steam/games/${steamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { page, limit: 5 } // 添加分页参数
            });
            console.log("输出res.data：", res.data);
            return {
                ...res.data,
                hasMore: res.data.hasMore // 确保后端返回是否有更多数据
            };
        } catch (error) {
            console.error('Steam API Error:', error);
            return { games: [], hasMore: false };
        }
    }, [token]);

    // 加载更多逻辑
    const loadMoreGames = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const { games: newGames, hasMore: newHasMore, profile, totalPlaytime, total } = await fetchSteamGames(steam.steamId, page + 1);

            dispatch(updateGames({
                platform: 'steam',
                games: newGames,
                profile,
                totalPlaytime,
                total,
                merge: true // 新增 merge 参数表示追加数据
            }));

            setPage(p => p + 1);
            setHasMore(newHasMore);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, steam.steamId, dispatch, fetchSteamGames]);

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
                                loadMore={loadMoreGames}
                                hasMore={hasMore}
                                loading={loading}
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
                <Row gutter={16} onClick={() => navigate('/dashboard/illustrations')}>
                    <Col span={24}>
                        <Card
                            title='默认游戏'
                            bordered={false}
                        >
                            <PlatformsInfo type="default" />
                            <ProfileGameList type="default" isBound={true} />
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