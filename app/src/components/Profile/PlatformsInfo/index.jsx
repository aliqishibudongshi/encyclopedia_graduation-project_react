import React from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const PlatformsInfoContainer = styled.div`
    display: flex;
    flex-direction: column;

    .personal-info-top {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        img {
            margin-right: 10px;
            width: 50px;
            height: 50px;
            border-radius:50%;
        }

        span {
            font-weight: 500;
        }
    }

    .personal-info-bottom {
        display: flex;
        justify-content: space-between;
    }
`;

export default function PlatformsInfo({ type }) {
    const steam = useSelector(state => state.auth.platforms.steam);
    const username = useSelector(state => state.auth.username);

    // 添加空值保护
    const steamUsername = steam.profile?.username || '未获取用户名';
    const totalPlaytime = steam.totalPlaytime || 0;
    const gameCount = steam.games?.length || 0;

    return (
        <PlatformsInfoContainer>
            <div className='personal-info-top'>
                <img
                    className='avatar'
                    src={type === 'default'
                        ? '/images/defaultAvatar.jpg'
                        : (steam.profile?.avatar || '/images/steam-default.png')}
                    alt="user's avatar" />
                <span className='username'>昵称：{type === 'default' ? username : steamUsername}</span>
            </div>
            <div className='personal-info-bottom'>
                <span>总时长：{type === 'default' ? 0 : Math.round(totalPlaytime / 60)}小时</span>
                <span>游戏数：{type === 'default' ? 0 : gameCount}</span>
            </div>
        </PlatformsInfoContainer>
    )
}