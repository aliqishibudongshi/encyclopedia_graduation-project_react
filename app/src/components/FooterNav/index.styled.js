import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Footer = styled.footer`
    background-color: #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    border-top: 1px solid #eee;
    box-shadow: 0px -1px 5px #ccc;
`;

export const CustomNavLink = styled(NavLink).attrs(({ isActive }) => ({
    className: isActive ? 'active' : ''
}))`
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    color: #999;
    &:hover {
        color: #666;
    }
    &.active {
        color: #4caf50;
        font-weight: bold;
        font-size: 20px;
    }
`;