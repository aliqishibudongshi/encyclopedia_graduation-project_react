import React from 'react'
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CustomNavLink } from '../../../components/FooterNav/index.styled';

const ProfileContainer = styled.div`
    .profile-nav-tabs {
        padding: 10px;
        text-align: center;
    }

    .profile-current-user {
        display: flex;
        background-color: #eee;
        padding: 10px;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        span {
            margin-left: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #666;
        }
    }
`;

export default function Profile() {
    const username = useSelector(state => state.auth.username);

    return (
        <ProfileContainer>
            <div className='profile-nav-tabs'>
                <CustomNavLink to='/dashboard/profile/profile-data'>数据</CustomNavLink>
                <CustomNavLink to='/dashboard/profile/profile-status'>动态</CustomNavLink>
            </div>

            <div className="profile-current-user">
                <img src='/images/defaultAvatar.jpg' alt={`${username}'s avatar`} />
                <span>{username}</span>
            </div>

            <Outlet />
        </ProfileContainer>
    )
}