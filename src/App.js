import React, { useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router';
import { BACKENDURL } from './Config.js';
import API from './Api';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import HomePage from './HomePage';
import UserPage from './UserPage';
import RoomPage from './RoomPage';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import SessionRoom from './SessionRoom';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';

export const ApiContext = React.createContext();

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: '#8C30F5',
    },
  },
  datePicker: {
    selectColor: '#8C30F5',
  },
});

function CustomSnackBar (props) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={props.show}
      autoHideDuration={6000}
      onClose={props.onClose}
      message={props.message}
    >
    </Snackbar>
  )
}

CustomSnackBar.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string
}

export const SnackbarSetContext = React.createContext();

function App() {
  const api = new API(BACKENDURL);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const SnackBarAlert = (alertMessage) => {
    setSnackBarMessage(alertMessage);
    setShowSnackBar(true);
  }
  return (
    <MuiThemeProvider theme={AppTheme}>
      <ApiContext.Provider value={api}>
        <SnackbarSetContext.Provider value={SnackBarAlert}>
          <CustomSnackBar show={showSnackBar}
            onClose={() => setShowSnackBar(false)} message={snackBarMessage}/>
          <BrowserRouter>
            <Switch>
              <Route path='/login'>
                <LoginPage/>
              </Route>
              <Route path='/register'>
                <RegisterPage/>
              </Route>
              <Route path='/home'>
                <HomePage/>
              </Route>
              <Route path='/user/:uid'>
                <UserPage/>
              </Route>
              <Route exact path='/room'>
                <RoomPage/>
              </Route>
              <Route path='/room/:sessionID'>
                <SessionRoom/>
              </Route>
              <Route path='/'>
                <Redirect to='/login'/>
              </Route>
            </Switch>
          </BrowserRouter>
        </SnackbarSetContext.Provider>
    </ApiContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
