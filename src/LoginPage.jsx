import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ApiContext } from './App';
import styled from 'styled-components';
import UserImg from './assets/Sample2.png';
import TextField from '@material-ui/core/TextField';
import { SnackbarSetContext } from './App';

export const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const LoginPageBox = styled.div`
  display: flex;
  flex-direction: row;
  background-color: pink;
  width: 70%;
  height: 70%;
  border-radius: 20px;
  box-shadow: 0 0 10px 10px #dddddd;
`

export const LoginPageContent = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
`

export const LoginPageContentWrapper = styled.div`
  padding: 5em;
  & > * {
    margin-top: 2em;
  }
`

export const LoginPageTitle = styled.div`
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 3em;
  font-weight: 500;
`

export const LoginPageButton = styled.button`
  background-color: var(--primary-color);
  color: #ffffff;
  border: none;
  outline: none;
  padding: 1em;
  width: 100%;
  border-radius: 6px;
  transition: transform .2s;
  :hover {
    transform: scale(1.01);
  }
`

export const LoginImageWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: linear-gradient(to bottom right, #F395BA, #FED182);
  width: 100%;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`

export const LoginPageImage = styled.img`
  width: 100%;
  height: auto;
`

export default function LoginPage () {
  const [email, setEmail] = useState('');
  const alert = useContext(SnackbarSetContext);
  const [password, setPassword] = useState('');
  const api = useContext(ApiContext);
  const history = useHistory();
  const onLoginBtnClick = () => {
    // Check that email and password arent empty
    if (email.length === 0) {
      alert("email cannot be empty");
      return;
    } else if (password.length === 0) {
      alert("Password cannot be empty");
      return;
    }
    // Make API call to back end
    api.authLogin(email, password)
      .then(r => {
        // Check if it was successful
        switch(r.status) {
          case 200:
            // Successfully received response so get token
            r.json()
              .then(r => {
                // Save token in local storage
                window.localStorage.setItem('token', r.token);
                // Save user id to local storage
                window.localStorage.setItem('uid'
                  , r.uid);
                // Change to home page
                history.push('/home');
              })
            break;
          case 400:
            alert('Invalid email password combination');
            break;
          default:
            alert(`The server returned with the status ${r.status}`);
        }
      })
  }
  return (
    <LoginPageWrapper>
      <LoginPageBox>
        <LoginPageContent>
          <LoginPageContentWrapper>
            <LoginPageTitle>Welcome Back!</LoginPageTitle>
            <div>
              <TextField label="Email" style={{width: '100%'}}
                onChange={e => setEmail(e.target.value)} value={email}/>
            </div>
            <div>
              <TextField type="password" label="Password" style={{width: '100%'}}
                onChange={e => setPassword(e.target.value)} value={password}/>
            </div>
            <LoginPageButton onClick={onLoginBtnClick} variant="contained">
              Log in
            </LoginPageButton>
            <div style={{ width: '100%', textAlign: 'center' }}>Don't have an account?
              <Link style={{ textDecoration: 'none' }} to='/register'>Sign up</Link>
            </div>
          </LoginPageContentWrapper>
        </LoginPageContent>
        <LoginImageWrapper>
          <LoginPageImage src={UserImg}/>
        </LoginImageWrapper>
      </LoginPageBox>
    </LoginPageWrapper>
  )
}