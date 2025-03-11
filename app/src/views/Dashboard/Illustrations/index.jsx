import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector } from "react-redux";
import { Tabs, Table, Spin, Switch, message } from 'antd';
import axios from 'axios';
import { SearchOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "../../../config";
import styled from 'styled-components';

const IllustrationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .searchBar {
        width: 100%;
        margin: 12px 0;
        padding: 12px 0;
        box-sizing: border-box;
        background-color: #eee;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .searchIcon {
        font-size: 24px;
        cursor: pointer;
        color: #757598;
    }

    .searchInput {
        width: 70%;
        border: none;
        background-color: #eee;
        cursor: pointer;
        font-size: 20px;

        &:focus {
            outline: none;
        }
    }
    
    .ant-tabs-nav-wrap {
    display: flex;
    width: 100%;
    }

    .ant-tabs-nav-list {
        display: flex;
        width: 100%;
    }

    .ant-tabs-tab {
        flex: 1;
        justify-content: center;
    }
`;

const Illustrations = React.memo(() => {
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingIllustrations, setLoadingIllustrations] = useState({});
    const [categories, setCategories] = useState([]);
    // 从 categoryId 到 illustrations 的映射
    const [listData, setListData] = useState({});
    // 存储原始数据
    const [originalListData, setOriginalListData] = useState({});
    const [activeKey, setActiveKey] = useState(null);
    const inputRef = useRef();
    const [messageApi, contextHolder] = message.useMessage();
    const username = useSelector(state => state.auth.username);

    // 缓存分类数据
    const cachedCategories = useRef(null);
    // 缓存图鉴数据
    const cachedIllustrations = useRef({});

    // 从 API 中获取类别
    const fetchCategories = useCallback(async () => {
        if (cachedCategories.current) {
            setCategories(cachedCategories.current);
            if (cachedCategories.current.length > 0) {
                setActiveKey(cachedCategories.current[0].key);
            }
            setLoadingCategories(false);
            return;
        }
        try {
            // 1. 先获取游戏ID
            const gameResponse = await axios.get(`${API_BASE_URL}/api/game`, {
                params: { name: '动物森友会' }
            });
            const gameId = gameResponse.data[1]?._id;

            // 2. 获取分类
            const response = await axios.get(`${API_BASE_URL}/api/category`, {
                params: { gameId }
            });

            // 3. 直接使用原始分类数据
            const newCategories = response.data.map(category => ({
                key: category._id,
                tab: category.name,
                originalCategory: category // 保留原始数据
            }));
            setCategories(newCategories);
            cachedCategories.current = newCategories;

            if (response.data.length > 0) {
                setActiveKey(response.data[0]._id);
            }
            setLoadingCategories(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            messageApi.open({ type: 'error', content: '获取分类失败' });
            setLoadingCategories(false);
        }
    }, [messageApi]);
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 当 activeKey 改变时获取图鉴
    const fetchIllustrations = useCallback(async () => {
        if (!activeKey) return;
        // 优先使用缓存数据
        if (cachedIllustrations.current[activeKey]) {
            setListData((prev) => ({ ...prev, [activeKey]: cachedIllustrations.current[activeKey] }));
            return;
        }

        // 设置特定类别的加载
        setLoadingIllustrations((prev) => ({ ...prev, [activeKey]: true }));
        try {
            const response = await axios.get(`${API_BASE_URL}/api/list`, {
                params: { categoryId: activeKey },
            });
            const illustrations = response.data.map((item) => ({
                key: item._id,
                name: item.name,
                image: item.image,
                description: item.description,
                // 根据collectedUsers判断是否收藏
                collected: item.collectedUsers.includes(username),
                collectedUsers: item.collectedUsers
            }));
            // 更新缓存和状态
            cachedIllustrations.current[activeKey] = illustrations;

            setListData((prev) => ({ ...prev, [activeKey]: illustrations }));
            setOriginalListData((prev) => ({ ...prev, [activeKey]: illustrations })); // 存储原始数据
        } catch (error) {
            console.error('Error fetching illustrations:', error);
            messageApi.open({
                type: 'error',
                content: '获取图鉴失败',
            });
        } finally {
            setLoadingIllustrations((prev) => ({ ...prev, [activeKey]: false }));
        }
    }, [activeKey, messageApi, username]);
    useEffect(() => {
        fetchIllustrations();
    }, [fetchIllustrations]);

    // 切换 onChange 处理程序
    const switchOnChange = useCallback(async (id, checked) => {
        try {
            await axios.put(`${API_BASE_URL}/api/list/${id}`, {
                collected: checked,
                username
            });
            // 更新本地状态
            setListData((prev) => ({
                ...prev,
                [activeKey]: (prev[activeKey] || []).map(item => {
                    if (item.key === id) {
                        const newUsers = checked
                            ? [...item.collectedUsers, username]
                            : item.collectedUsers.filter(u => u !== username);
                        return {
                            ...item,
                            collectedUsers: newUsers,
                            collected: checked
                        };
                    }
                    return item;
                })
            }));

            messageApi.open({
                type: 'success',
                content: '图鉴更新成功',
            });
        } catch (error) {
            console.error('Error updating illustration:', error);
            messageApi.open({
                type: 'error',
                content: '图鉴更新失败',
            });
        }
    }, [activeKey, username, messageApi]);

    // 表格列定义
    const columns = useMemo(() => [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '图片',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={`${API_BASE_URL}${text}`} alt={text} style={{ width: '50px' }} />,
        },
        {
            title: '详情',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '未收藏 / 已收藏',
            key: 'action',
            render: (text, record) => {
                const isCollected = record.collectedUsers?.includes(username);
                return (
                    <Switch
                        checked={isCollected}
                        onChange={(checked) => switchOnChange(record.key, checked)}
                    />
                )

            },
        },
    ], [username, switchOnChange]);

    // 根据获取的数据动态创建标签项
    const tabItems = useMemo(() => categories.map((category) => ({
        label: category.tab,
        key: category.key,
        children: (
            <Table
                columns={columns}
                dataSource={listData[category.key] || []}
                pagination={{ pageSize: 5 }}
                rowKey="key"
                loading={loadingIllustrations[category.key] || false}
            />
        ),
    })), [categories, columns, listData, loadingIllustrations]);

    // 标签页 onChange 处理程序
    const tabOnChange = (key) => {
        setActiveKey(key);
    };

    // 搜索输入 onchange 处理程序
    const handleSearch = () => {
        const searchValue = inputRef.current.value.trim().toLowerCase();

        if (!searchValue) {
            // 如果搜索输入为空，则重置为原始列表
            setListData((prev) => ({
                ...prev,
                [activeKey]: [...(originalListData[activeKey] || [])],
            }));
            return;
        }

        const filteredData = (originalListData[activeKey] || []).filter((item) =>
            item.name.toLowerCase().includes(searchValue)
        );
        if (filteredData.length > 0) {
            setListData((prev) => ({
                ...prev,
                [activeKey]: filteredData,
            }));
        } else {
            setListData((prev) => ({
                ...prev,
                [activeKey]: [],
            }));
        }
    };

    // 分类完成提示
    useEffect(() => {
        if (activeKey) {
            const total = originalListData[activeKey]?.length || 0;
            const collected = listData[activeKey]?.filter(i => i.collected).length || 0;

            if (total > 0 && collected === total) {
                messageApi.info({
                    content: '🎉 恭喜完成当前分类！去社区分享截图获得好评吧！',
                    duration: 3,
                });
            }
        }
    }, [listData, activeKey, messageApi, originalListData]);

    return (
        <IllustrationsContainer>
            <div className='searchBar'>
                {contextHolder}
                <SearchOutlined className='searchIcon' />
                <input
                    placeholder="输入名称可模糊搜索哦"
                    className="searchInput"
                    ref={inputRef}
                    onChange={handleSearch} // 根据用户输入动态更新列表
                />
            </div>
            {loadingCategories ? (
                <Spin size="large" data-testid="loading-spinner" />
            ) : (
                <Tabs
                    items={tabItems}
                    activeKey={activeKey}
                    onChange={tabOnChange}
                    type="card"
                />
            )}
        </IllustrationsContainer>
    );
});

export default Illustrations;