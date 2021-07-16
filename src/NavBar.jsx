import React, { useContext } from 'react';
import styled from 'styled-components';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { ApiContext } from './App';
import LogoImage from './assets/logo.png';

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5em;
  padding-left: 2em;
  padding-right: 2em;
`

const NavLogo = styled.img`
  margin-top: -14px;
`

const NavContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%
`

const NavItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
  margin-left: 1em;
  font-size: 1.3em;
  :hover {
    transform: scale(1.1);
  }
`

function NavItem(props) {
  const selectedStyle = {
    color: 'var(--primary-color)'
  }
  if (props.isselected) {
    return (
      <NavItemWrapper style={selectedStyle} onClick={props.onClick}>
        {props.children}
      </NavItemWrapper>
    )
  }
  return (
    <NavItemWrapper onClick={props.onClick}>
      {props.children}
    </NavItemWrapper>
  )
}

NavItem.propTypes = {
  children : PropTypes.any,
  isselected: PropTypes.bool,
  onClick: PropTypes.func
}

export default function NavBar(props) {
  const history = useHistory();
  const api = useContext(ApiContext);
  const onLogoutClick = () => {
    // Remove token and uid from storage
    const token = window.localStorage.getItem('token');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('uid');
    if (token !== undefined) {
      api.authLogout(token);
    }
    history.push('/login');
  }
  return (
    <NavWrapper>
      <NavContent>
        <NavLogo src={LogoImage}></NavLogo>
        <NavItem isselected={props.selected === 'home'}
          onClick={ () => history.push('/home')}>
          Dashboard
        </NavItem>
        <NavItem isselected={props.selected === 'room'}
          onClick={ () => history.push('/room')}>
          Join Room
        </NavItem>
        <NavItem>
          Badges
        </NavItem>
      </NavContent>
      <IconButton size='medium' onClick={onLogoutClick}>
        <ExitToAppIcon fontSize='inherit'/>
      </IconButton>
    </NavWrapper>
  )
}

NavBar.propTypes = {
  // Stores the string of the page selected
  selected: PropTypes.string
}