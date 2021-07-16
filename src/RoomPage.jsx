import { Button, MenuItem, Select } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import NavBar from './NavBar';
import { LoginPageButton, LoginPageImage, LoginPageTitle } from './LoginPage';
import { PropTypes } from 'prop-types';
import PageImage from './assets/Saly-1.png'
import { useContext } from 'react';
import { ApiContext} from './App';
import { useHistory } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { SnackbarSetContext } from './App';

const CreateRoomPageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const CreateRoomMainContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`

const WidgetWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2em;
  box-shadow: 0 0 10px 10px #dddddd;
  height: 50%;
  width: 80%;
`

const WidgetButtonsWrapper = styled.div`
  padding: 0.3em;
  border-radius: 10px;
  background-color: var(--primary-color-light);
  display: flex;
  flex-direction: row;
`

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding-top: 2em;
`

const ImgWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(var(--primary-color) 5%, transparent 60%);
`

function JoinRoomWidget () {
  return (
    <TabWrapper>
      <LoginPageTitle>Join a room!</LoginPageTitle>
    </TabWrapper>
  )
}

function CreateRoomWidget (props) {
  const token = window.localStorage.getItem('token');
  const api = useContext(ApiContext);
  const [selectedTask, setSelectedTask] = useState('');
  const [duration, setDuration] = useState(25);
  const history = useHistory();
  console.log(props.tasks);
  const onCreate = () => {
    if (selectedTask.length === 0) {
      alert('Task cannot be empty!');
      return;
    } else if (token === undefined) {
      alert('No token saved');
      history.push('/login');
      return;
    }
    // Make api call
    api.taskSessionCreate(token, selectedTask, duration)
      .then(r => {
        if (r.status === 200) {
          r.json()
            .then(r => history.push(`/room/${r.sessionID}`))
        }
      })
  }
  const renderSelectOptions = () => props.tasks
    .map(t => (<MenuItem key={t.taskID} value={t.taskID}>{t.name}</MenuItem>))
  return (
    <TabWrapper>
      <LoginPageTitle style={{ marginBottom: '20px' }}>Create a Room!</LoginPageTitle>
      <InputLabel id="task-select-label">Task</InputLabel>
      <Select value={selectedTask}
        labelId='task-select-label'
        onChange={e => setSelectedTask(e.target.value)}
        style={{ width: '100%', marginBottom: '2em'}}
      >
        {renderSelectOptions()}
      </Select>
      <TextField 
        style ={{ width: '100%', marginBottom: '4em' }}
        type='number' label='Duration'
        onChange={e => setDuration(e.target.value)}
        value={duration}  
      ></TextField>
      <LoginPageButton onClick={onCreate}>Create</LoginPageButton>
    </TabWrapper>
  )
}

CreateRoomWidget.propTypes = {
  tasks: PropTypes.array,
}


function RoomWidget (props) {
  const [tabIndex, setTabIndex] = useState(0)
  const getButtonStyle = (btnIndex) => {
    // Seleted style
    if (btnIndex === tabIndex) {
      return {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-color-light)',
        width: '100%',
        borderRadius: '10px'
      }
    }
    // Unselected style
    return {
      backgroundColor: 'var(--primary-color-light)',
      color: 'var(--primary-color)',
      width: '100%',
      borderRadius: '10px'
    }
  }
  const displayTab = () => {
    if (tabIndex === 0) {
      return (<JoinRoomWidget/>)
    } else if (tabIndex === 1) {
      return (<CreateRoomWidget tasks={props.tasks}/>)
    }
  }
  return (
    <WidgetWrapper style={props.style}>
      <WidgetButtonsWrapper>
        <Button style={getButtonStyle(0)}
          onClick={() => setTabIndex(0)}>Join a room</Button>
        <Button style={getButtonStyle(1)}
          onClick={() => setTabIndex(1)}>Create a room</Button>
      </WidgetButtonsWrapper>
      { displayTab() }
    </WidgetWrapper>
  )
}

CreateRoomWidget.propTypes = {
  style: PropTypes.object,
  tasks: PropTypes.array
}

export default function RoomPage () {
  const [tasks, setTasks] = useState([]);
  /**
    TO DO
    API CALL FOR TASKS
  */
  const api = useContext(ApiContext);
  const alert = useContext(SnackbarSetContext);
  const history = useHistory();
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    // Get token
    if (token === undefined) {
      alert('No token stored');
      history.push('/login');
      return;
    }
    // Load tasks
    api.taskList(token)
      .then(r => r.json())
      .then(r => setTasks(r.tasks))
  }, [api, history])
  return (
    <CreateRoomPageWrapper>
      <NavBar selected='room'/>
      <CreateRoomMainContent>
        <ImgWrapper>
          <LoginPageImage src={PageImage}/>
        </ImgWrapper>
        <div style={{width: '100%', display: 'flex',
          justifyContent: 'center', alignItems: 'center'}}
        >
          <RoomWidget tasks={tasks}/>
        </div>
      </CreateRoomMainContent>
    </CreateRoomPageWrapper>
  )
}