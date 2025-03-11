import React from 'react'
import {Footer, CustomNavLink} from "./index.styled"

export default function FooterNav() {
  return (
    <Footer>
      <CustomNavLink to="/dashboard/illustrations" className={({ isActive }) => isActive ? 'list-group-item' : 'base'}>图鉴</CustomNavLink>
      <CustomNavLink to="/dashboard/community">社区</CustomNavLink>
      <CustomNavLink to="/dashboard/profile">个人</CustomNavLink>
    </Footer>
  )
}
