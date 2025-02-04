import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import Share from './index.jsx';

// 在文件顶部声明变量
let messageApi;
// Mock URL API
global.URL.createObjectURL = jest.fn(() => 'mock-url');

jest.mock('axios');
const mockPost = axios.post.mockResolvedValue({ data: {} });

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

const mockStore = configureStore({
    reducer: {
        auth: (state = { username: 'testuser' }) => state,
    },
});
const storeWithoutUser = configureStore({
    reducer: {
        auth: () => ({ username: null }),
    },
});

describe('Share Component', () => {
    const renderComponent = (store = mockStore) => {
        return render(
            <Provider store={store}>
                <Share />
            </Provider>
        );
    };

    beforeEach(() => {
        // 清除所有模拟函数的调用记录
        jest.clearAllMocks();
        // 重置 URL.createObjectURL 的模拟实现
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        // 获取messageApi实例
        const antd = require('antd');
        messageApi = antd.message.useMessage()[0];
    });

    test('1. 渲染初始组件', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('分享你此刻的想法')).toBeInTheDocument();
        expect(screen.getByText('图片')).toBeInTheDocument();
        expect(screen.getByText('分享')).toBeInTheDocument();
    });

    test('2. 更新内容输入', () => {
        renderComponent();
        const input = screen.getByPlaceholderText('分享你此刻的想法');
        fireEvent.change(input, { target: { value: 'test content' } });
        expect(input.value).toBe('test content');
    });

    test('3. 处理图片上传', async () => {
        const user = userEvent.setup();
        renderComponent();

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('image-upload-input');

        // 测试超过6个文件（关键修复）
        fireEvent.change(fileInput, {
            target: {
                files: Array(7).fill(file),
                getAttribute: () => 'image'
            }
        });

        // 添加状态验证
        await waitFor(() => {
            expect(screen.getByTestId('image-error')).toHaveTextContent('只能上传六张图片');
        });

        // 测试有效上传
        await user.upload(fileInput, [file]);

        // 验证图片显示（使用唯一标识）
        await waitFor(() => {
            expect(screen.getByAltText('Uploaded-0')).toBeInTheDocument();
        });

        // 验证 URL 创建
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });

    test('4. 删除已上传的图片', async () => {
        const user = userEvent.setup();
        renderComponent();

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('image-upload-input');

        // 上传图片
        await user.upload(fileInput, [file]);

        // 等待图片渲染
        await waitFor(() => {
            expect(screen.getByAltText('Uploaded-0')).toBeInTheDocument();
        });

        // 找到删除按钮并点击（假设删除按钮有唯一标识，这里使用 data-testid 示例）
        const deleteButton = screen.getByTestId('delete-image-0');
        await user.click(deleteButton);

        // 删除操作后验证图片不存在
        await waitFor(() => {
            expect(screen.queryByAltText('Uploaded-0')).not.toBeInTheDocument();
        });
    });

    test('5. 表单提交成功', async () => {
        mockPost.mockResolvedValueOnce({ data: {} });
        renderComponent();

        // Fill content
        const input = screen.getByPlaceholderText('分享你此刻的想法');
        fireEvent.change(input, { target: { value: 'test content' } });

        // Upload image
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByLabelText('图片').previousSibling;
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit
        fireEvent.click(screen.getByText('分享'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                expect.stringContaining('/api/community/create-post'),
                expect.any(FormData)
            );
        });
    });

    test('6. 提交空表单时显示错误', async () => {
        renderComponent();

        // 清空内容输入
        const input = screen.getByPlaceholderText('分享你此刻的想法');
        fireEvent.change(input, { target: { value: '' } });

        // 删除所有已上传的图片
        const deleteButtons = screen.queryAllByTestId('delete-image-button'); // 假设每个删除按钮有data-testid
        deleteButtons.forEach(button => {
            fireEvent.click(button);
        });

        // 确保没有上传图片
        const fileInput = screen.getByTestId('image-upload-input');
        fireEvent.change(fileInput, { target: { files: [] } });

        fireEvent.click(screen.getByText('分享'));

        await waitFor(() => {
            expect(mockPost).not.toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(messageApi.open).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    content: '请添加一些内容或上传图片'
                })
            );
        });
    });

    test('7. 处理提交错误', async () => {
        mockPost.mockRejectedValueOnce(new Error('API Error'));
        renderComponent();

        // Add some content
        const input = screen.getByPlaceholderText('分享你此刻的想法');
        fireEvent.change(input, { target: { value: 'test content' } });

        fireEvent.click(screen.getByText('分享'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
        });
    });

    test('8. 没有用户名时显示错误', async () => {
        // 在store配置中添加message mock
        jest.spyOn(console, 'error').mockImplementation(() => { });

        renderComponent(storeWithoutUser);

        // 点击分享按钮
        fireEvent.click(screen.getByText('分享'));

        await waitFor(() => {
            expect(mockPost).not.toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(messageApi.open).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    content: '获取用户信息失败，请重新登录'
                })
            );
        });
    });
});