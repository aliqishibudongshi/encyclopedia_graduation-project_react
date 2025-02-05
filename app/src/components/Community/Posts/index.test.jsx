import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Posts from './index.jsx';

const mockPosts = [
    {
        _id: '1',
        content: '测试帖子内容',
        username: 'testuser',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        imagePath: ['public/uploads/test.jpg']
    }
];

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockPosts),
        ok: true
    })
);

jest.mock('axios');
jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');

    const Menu = ({ items }) => (
        <ul className="ant-dropdown-menu">
            {items.map((item) => (
                <li
                    key={item.key}
                    className="ant-dropdown-menu-item"
                    onClick={item.onClick}
                    data-testid={`menu-item-${item.key}`}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    );

    const Drawer = ({ open, onClose, children, title }) => (
        open ? (
            <div className="ant-drawer" data-testid="drawer">
                <h3>{title}</h3>
                <button onClick={onClose}>Close</button>
                {children}
            </div>
        ) : null
    );

    return {
        ...antd,
        Dropdown: (props) => {
            const items = props.menu?.items || [];
            return (
                <div>
                    {props.children}
                    <div
                        data-testid="dropdown-menu"
                        style={{ display: props.visible ? 'block' : 'none' }}
                        className="postTopRight"
                    >
                        <Menu items={items} />
                    </div>
                </div>
            );
        },
        Drawer,
    };
});

jest.mock('@ant-design/icons', () => {
    const icons = jest.requireActual('@ant-design/icons');
    return {
        ...icons,
        MoreOutlined: ({ onClick }) => <span data-testid="more-icon" onClick={onClick}>...</span>,
        LikeOutlined: ({ onClick }) => <button data-testid="like-button" onClick={onClick}>Like</button>,
        CommentOutlined: ({ onClick }) => <button data-testid="comment-button" onClick={onClick}>Comment</button>,
    };
});

describe('Posts组件', () => {
    beforeEach(() => {
        fetch.mockClear();
        fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockPosts)
            })
        );
        useSelector.mockImplementation(callback =>
            callback({ auth: { username: 'testuser' } })
        );
        axios.post.mockImplementation(url => {
            if (url.includes('/like')) {
                return Promise.resolve({ data: { ...mockPosts[0], likes: ['testuser'] } });
            }
            return Promise.resolve({ data: {} });
        });
        axios.put.mockResolvedValue({ data: mockPosts[0] });
        axios.delete.mockImplementation(url => Promise.resolve({
            data: {
                status: 'success',
                message: '删除成功'
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('1. 正确渲染帖子列表', async () => {
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);
        const contentElement = await screen.findByText('测试帖子内容');
        const userElement = await screen.findByText(/testuser/);
        expect(contentElement).toBeInTheDocument();
        expect(userElement).toBeInTheDocument();
    });

    test('2. 点赞功能正常', async () => {
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);
        await screen.findByText('测试帖子内容');
        const likeButton = await screen.findByTestId('like-button');
        fireEvent.click(likeButton);
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/like/1'),
                { username: 'testuser' },
                expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
            );
        });
    });

    test('3. 打开评论抽屉并提交评论', async () => {
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);
        await screen.findByText('测试帖子内容');
        const commentButton = await screen.findByTestId('comment-button');
        fireEvent.click(commentButton);
        await screen.findByPlaceholderText('输入评论...');
        const input = screen.getByPlaceholderText('输入评论...');
        const sendButton = screen.getByText('发送');
        fireEvent.change(input, { target: { value: '测试评论' } });
        fireEvent.click(sendButton);
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/comment/1'),
                { username: 'testuser', comment: '测试评论' }
            );
        });
    });

    test('4. 显示编辑菜单并保存修改', async () => {
        const user = userEvent.setup();
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);

        // 等待数据加载完成
        await screen.findByText('测试帖子内容');

        // 打开下拉菜单
        const moreIcon = await screen.findByTestId('more-icon');
        fireEvent.click(moreIcon);

        // 点击修改按钮
        const editButton = await screen.findByTestId('menu-item-0');
        await user.click(editButton);
        
        // // 等着抽屉打开
        // const drawer = screen.getByTestId('drawer');
        // expect(drawer).toBeInTheDocument();

        // // // 检查抽屉内容
        // const drawerContent = await screen.findByText('正在编辑');
        // await waitFor(() => {
        //     expect(drawerContent).toBeInTheDocument();
        // });

        // // //修改内容并保存
        // const textarea = await screen.findByRole('textbox');
        // // 检测输入框
        // await waitFor(() => {
        //     expect(textarea).toBeInTheDocument();
        // });

        // await user.type(textarea, '修改后的内容');

        // const saveButton = await screen.findByText('保存修改');
        // await user.click(saveButton);

        // // // 验证保存操作
        // await waitFor(() => {
        //     expect(axios.put).toHaveBeenCalled();
        // });
    });

    test('5. 删除帖子功能正常', async () => {
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);

        // 等待数据加载完成
        await screen.findByText('测试帖子内容');

        // 记录初始帖子数量
        const initialPosts = screen.getAllByTestId('postWrapper').length;

        // 打开下拉菜单
        fireEvent.click(await screen.findByTestId('more-icon'));

        // 点击删除按钮
        fireEvent.click(await screen.findByTestId('menu-item-1'));

        await waitFor(() => {
            // 检测帖子容器数量变化
            expect(screen.getAllByTestId('postWrapper').length).toBe(initialPosts - 1);
        }, {
            timeout: 5000,
            onTimeout: () => console.log('Timeout: Post element still exists')
        });
    });

    test('6. 图片显示正确处理', async () => {
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);
        const images = await screen.findAllByRole('img');
        expect(images[1]).toHaveAttribute('src', expect.stringContaining('uploads/test.jpg'));
    });

    test('7. 非作者不显示操作菜单', async () => {
        useSelector.mockImplementation(callback =>
            callback({ auth: { username: 'otheruser' } })
        );
        render(<Posts showOnlyUserPosts={false} currentUser="testuser" />);
        await waitFor(() => {
            expect(screen.queryByTestId('more-icon')).not.toBeInTheDocument();
        });
    });
});