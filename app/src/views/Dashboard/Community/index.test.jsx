import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Community from './index.jsx';

// 模拟 Share 和 Posts 组件
jest.mock('../../../components/Community/Share', () => {
    return jest.fn(() => <div data-testid="share-component" />);
});

jest.mock('../../../components/Community/Posts', () => {
    return jest.fn(() => <div data-testid="posts-component" />);
});

describe('Community Component', () => {
    test('should render Community component correctly', () => {
        // 渲染 Community 组件
        render(<Community />);

        // 验证 CommunityContainer 是否存在
        const communityContainer = screen.getByTestId('community-container');
        expect(communityContainer).toBeInTheDocument();

        // 验证提示文字是否存在
        const promptWord = screen.getByText('若要查看最新动态，请手动刷新页面');
        expect(promptWord).toBeInTheDocument();

        // 验证 Share 组件是否存在
        const shareComponent = screen.getByTestId('share-component');
        expect(shareComponent).toBeInTheDocument();

        // 验证 Posts 组件是否存在
        const postsComponent = screen.getByTestId('posts-component');
        expect(postsComponent).toBeInTheDocument();
    });
});