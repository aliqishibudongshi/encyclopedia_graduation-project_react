import styled from "styled-components";
import Share from "../../../components/Community/Share";
import Posts from "../../../components/Community/Posts";

const CommunityContainer = styled.div`
    padding: 20px;
    box-sizing: border-box;
    background-color: #f9f9f9;

    .promptWord {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #757575;
    }
`;

export default function Community() {
    return (
        <CommunityContainer data-testid="community-container">
            <Share />
            <div className="promptWord">
                <span>若要查看最新动态，请手动刷新页面</span>
            </div>
            <Posts />
        </CommunityContainer>
    )
}