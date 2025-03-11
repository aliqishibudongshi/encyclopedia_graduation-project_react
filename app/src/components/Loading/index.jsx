import styled from "styled-components";

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;

    .loading-spinner {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #4CAF50;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
const Loading = () => {
    return (
        <LoadingContainer>
            <div className="loading-spinner"></div>
            <span>请稍后</span>
        </LoadingContainer>
    );
};

export default Loading;