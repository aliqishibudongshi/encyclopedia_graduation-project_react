import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { message } from 'antd';
import axios from 'axios';
import Illustrations from './index.jsx';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';


// Mock axios实现
const mockAxios = axios.default;
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        put: jest.fn()
    }
}));

const mockStore = configureMockStore();
const store = mockStore({
    auth: { username: 'testUser' }
});

// Mock antd message
jest.mock('antd', () => {
    const actual = jest.requireActual('antd');
    const messageApi = {
        open: jest.fn(),
        success: jest.fn(),
        error: jest.fn(),
    };

    return {
        ...actual,
        message: {
            ...actual.message,
            useMessage: () => [messageApi, <div key="context" />],
        }
    };
});

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

// 在所有测试用例前定义messageApi引用
let messageApi;
describe('Illustrations Component', () => {
    const mockCategories = [
        { _id: '1', name: '怪物', gameId: 'game1' },
        { _id: '2', name: '武器', gameId: 'game1' }
    ];

    const mockIllustrations = [
        {
            _id: 'i1',
            name: '金蝉',
            image: '/images/cicada.jpg',
            description: '神秘金蝉',
            collectedUsers: ['testUser']
        }
    ];

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // 获取messageApi实例
        const { message } = require('antd');
        messageApi = message.useMessage()[0];

        // Mock game API response
        axios.get.mockImplementation((url) => {
            if (url.includes('/api/game')) return Promise.resolve({ data: [{ _id: 'game1' }] });
            if (url.includes('/api/category')) return Promise.resolve({ data: mockCategories });
            if (url.includes('/api/list')) return Promise.resolve({ data: mockIllustrations });
            return Promise.reject(new Error('not found'));
        });
    });

    test('1. 初始加载显示loading状态', async () => {
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        // 检查加载状态
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });
    });

    test('2. 正确渲染分类选项卡', async () => {
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/怪物/)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('武器')).toBeInTheDocument();
        });
    });

    test('3. 切换选项卡加载对应图鉴数据', async () => {
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        const weaponElement = await waitFor(() => screen.findByText('武器'));
        fireEvent.click(weaponElement);
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/api/list'),
                expect.objectContaining({ params: { categoryId: '2' } })
            );
        });
    });

    test('4. 搜索功能过滤数据', async () => {
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        const input = await waitFor(() => screen.findByPlaceholderText('输入名称可模糊搜索哦'));
        fireEvent.change(input, { target: { value: '金蝉' } });
        await waitFor(() => {
            expect(screen.getByText('金蝉')).toBeInTheDocument();
        });
    });

    test('5. 收藏开关操作', async () => {
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        const switchElement = await waitFor(() => screen.findByRole('switch'));
        fireEvent.click(switchElement);
        await waitFor(async () => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining('/api/list/i1'),
                expect.objectContaining({
                    collected: false,
                    username: 'testUser'
                })
            );
        });
    });

    test('6. 处理API错误场景', async () => {
        // 1. 模拟game接口正常返回
        axios.get.mockImplementation((url) => {
            if (url.includes('/api/game')) {
                return Promise.resolve({ data: [{ _id: 'game1' }] });
            }
            if (url.includes('/api/category')) {
                return Promise.reject(new Error('Force Error'));
            }
            return Promise.resolve({ data: [] });
        });

        // 2. 渲染组件
        render(
            <Provider store={store}>
                <Illustrations />
            </Provider>
        );

        // 3. 使用fake timer处理异步
        jest.useFakeTimers();
        await act(async () => {
            jest.advanceTimersByTime(1000); // 推进1秒
        });

        // 4. 正确验证消息调用方式
        expect(messageApi.open).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'error',
                content: '获取分类失败'
            })
        );
    });
}); 