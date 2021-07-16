import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserImg from './assets/Sample2.png';
import TextField from '@material-ui/core/TextField';
import { ApiContext } from './App';
import { LoginPageWrapper,  LoginPageContent,
  LoginPageBox, LoginPageTitle, LoginPageButton,
  LoginPageImage, LoginImageWrapper, LoginPageContentWrapper } from './LoginPage';
import { SnackbarSetContext } from './App';

export default function RegisterPage () {
  const alert = useContext(SnackbarSetContext);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const api = useContext(ApiContext);
  const history = useHistory();
  const onRegisterBtnClick = () => {
    // Check that email and password arent empty
    // Check that email and password arent empty
    if (email.length === 0) {
      alert("email cannot be empty");
      return;
    } else if (firstName.length === 0) {
      alert("First Name cannot be empty");
      return;
    } else if (lastName.length === 0) {
      alert("Last Name cannot be empty");
      return;
    } else if (password.length === 0) {
      alert("Password cannot be empty");
      return;
    }
    // Make API call to back end
    api.authRegister(email, firstName, lastName, password)
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
          default:
            r.text()
              .then(r => alert(r))
        }
      })
  }
  return (
    <LoginPageWrapper>
      <LoginPageBox>
        <LoginPageContent>
          <LoginPageContentWrapper>
            <LoginPageTitle>Register</LoginPageTitle>
            <div>
              <TextField label="Email" style={{width: '100%'}}
                onChange={e => setEmail(e.target.value)} value={email}/>
            </div>
            <div>
              <TextField label="First Name" style={{width: '100%'}}
                onChange={e => setFirstName(e.target.value)} value={firstName}/>
            </div>
            <div>
              <TextField label="Last Name" style={{width: '100%'}}
                onChange={e => setLastName(e.target.value)} value={lastName}/>
            </div>
            <div>
              <TextField type="password" label="Password" style={{width: '100%'}}
                onChange={e => setPassword(e.target.value)} value={password}/>
            </div>
            <LoginPageButton onClick={onRegisterBtnClick} variant="contained">
              Register
            </LoginPageButton>
            <div>Already have an account?
              <Link style={{ textDecoration: 'none' }} to='/login'>Sign in</Link>
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
