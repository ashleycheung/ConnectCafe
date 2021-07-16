import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ApiContext } from './App';
import NavBar from './NavBar';
import ProfileImage from './assets/profile.jpg';
import { LoginPageTitle } from './LoginPage';
import { Button } from '@material-ui/core';
import Timer from './Timer';

const SessionRoomWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const UsersListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const UserWrapper = styled.div`
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const UserImage = styled.img`
  height: 7em;
  border-radius: 50%;
`

const UserName = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
`

export default function SessionRoom() {
  const sessionID = useParams().sessionID;
  const [lastPollTime, setLastPollTime] = useState(new Date());
  const [ activeUsers, setActiveUsers] = useState([]);
  const [ sessionState, setSessionState ] = useState('inactive');
  const [duration, setDuration] = useState(60);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [hasUpdateTime, setHasUpdateTime] = useState(false);
  const api = useContext(ApiContext);
  const token = window.localStorage.getItem('token');
  // Given the start time and is active
  // return whether the room is active
  const determineState = (startTime, isActive, reason) => {
    if (startTime === null || startTime === undefined) {
      return 'inactive';
    } else if (isActive) {
      return 'active';
    } else if (reason === null || reason === undefined) {
      return 'completed';
    }
    return 'ended';
  }
  // On initial load call session load
  useEffect(() => {
    api.taskSessionJoin(token, sessionID)
      .then(r => {
        if (r.status !== 200) {
          console.log(`Server replied with ${r.status}`);
        }
      })
  }, [api, sessionID, token])
  // Calls task/session/info and polls it
  // Polls every 1000 milliseconds (1 sec)
  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      // Prevents changing state when component is
      // unmounted
      if (isMounted) {
        // call api
        api.taskSessionInfo(token, sessionID)
          .then(r => {
            if (r.status === 200) {
              r.json()
                .then(r => {
                  setActiveUsers(r.users);
                  const state = determineState(r.startTime, r.isActive, r.reason)
                  setSessionState(state);
                  if (state === 'active') {
                    setDuration(r.duration);
                    setSecondsRemaining(r.secondsRemaining);
                    setHasUpdateTime(true);
                  }
                })
            }
          })
        setLastPollTime(new Date());
      }
    }, 1000)
    return () => { isMounted = false};
  }, [lastPollTime, api, token, sessionID]);
  const renderUsers = () => {
    return activeUsers.map((u, i) => (
      <UserWrapper key={i}>
        <UserImage src={ProfileImage}/>
        <UserName>{u.firstName} {u.lastName}</UserName>
      </UserWrapper>
    ))
  }
  const updateTimeLeft = () => {
    if (hasUpdateTime) {
      setHasUpdateTime(false)
      return secondsRemaining;
    }
  }
  const renderTimer = () => {
    if (sessionState === 'active') {
      return (
        <div style={{ width: '100%', height: '100%',
          display : 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Timer updateTimeLeft={updateTimeLeft} active={true} duration={duration}
            timeLeft={secondsRemaining} setTimeLeft={setSecondsRemaining}/>
        </div>
      )
    }
  }
  const renderButton = () => {
    if (sessionState === 'inactive') {
      return (<Button onClick={onStart} variant="contained"
          color="primary">Start</Button>)
    } else if (sessionState === 'active') {
      return (<Button onClick={onEnd} variant="contained"
          color="primary">End</Button>)
    } else if (sessionState === 'ended') {
      return (<LoginPageTitle>Task Failed</LoginPageTitle>)
    } else if (sessionState === 'completed') {
      return (<LoginPageTitle>Task Completed!</LoginPageTitle>)
    }
  }
  const onStart = () => {
    api.taskSessionStart(token, sessionID)
  }
  const onEnd = () => {
    api.taskSessionEnd(token, sessionID)
  }
  return (
    <SessionRoomWrapper>
      <NavBar/>
      <LoginPageTitle style={{
        textAlign: 'center'}}>Your comrades have arrived!</LoginPageTitle>
      <UsersListWrapper>
        { renderUsers() }
      </UsersListWrapper>
      { renderTimer() }
      <div style={{ width: '100%', height: '100%',
        display : 'flex', justifyContent: 'center', alignItems: 'center' }}>
        { renderButton() }
      </div>
    </SessionRoomWrapper>
  )
}