import React from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Posts from "../../../../components/Community/Posts";

const ProfileStatusContainer = styled.div`
    padding: 10px;
`;

export default function ProfileStatus() {
    const username = useSelector(state => state.auth.username);

    return (
        <ProfileStatusContainer>
            <Posts showOnlyUserPosts currentUser={username} />
        </ProfileStatusContainer>
    )
}
