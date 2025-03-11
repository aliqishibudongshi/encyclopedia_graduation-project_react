import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import Profile from './index.jsx';

// 模拟模块
jest.mock('axios');

jest.mock('../../../components/Community/Posts', () => ({
    __esModule: true,
    default: ({ currentUser }) => <div data-testid="posts-component">{currentUser}</div>
}));

const mockStore = configureMockStore();
const setup = (initialState = { auth: { username: 'testUser' } }) => {
    return render(
        <Provider store={mockStore(initialState)}>
            <Profile />
        </Provider>
    );
};

const mockData = {
    game: { data: [{ _id: 'game123', name: '黑神话悟空' }] },
    categories: {
        data: [
            { _id: 'cat1', name: '衣甲' },
            { _id: 'cat2', name: '武器' }
        ]
    },
    progress: {
        data: {
            cat1: { percentage: 65 },
            cat2: { percentage: 30 }
        }
    }
};

describe('Profile Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation(url => {
            if (url.includes('/game')) return Promise.resolve(mockData.game);
            if (url.includes('/category')) return Promise.resolve(mockData.categories);
            if (url.includes('/progress')) return Promise.resolve(mockData.progress);
            return Promise.reject(new Error('API not found'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('1. 正确渲染用户信息和进度条', async () => {
        await waitFor(() => {
            setup();
        });

        // 验证基础信息
        expect(screen.getByAltText('avatar')).toBeInTheDocument();
        expect(screen.getByText('testUser')).toBeInTheDocument();

        // 验证进度条数量
        await waitFor(() => {
            const progressBars = screen.getAllByRole('progressbar');
            expect(progressBars).toHaveLength(2);
        });
    });

    test('2. 正确切换Tab显示发帖模块', async () => {
        await act(async () => {
            setup();
        });

        // 默认显示进度Tab
        expect(screen.getAllByRole('progressbar')).toHaveLength(2);

        // 切换Tab
        const postsTab = screen.getByText('发帖');
        postsTab.click();

        // 验证Posts组件
        await waitFor(() => {
            expect(screen.getByTestId('posts-component')).toHaveTextContent('testUser');
        });
    });
});