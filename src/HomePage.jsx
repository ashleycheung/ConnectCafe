import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from './NavBar';
import { ApiContext } from './App';
import { useHistory } from 'react-router-dom';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PersonIcon from '@material-ui/icons/Person';
import { LoginPageTitle } from './LoginPage';
import Timer from './Timer';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import HomeImage from './assets/Saly-17.png';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { SnackbarSetContext } from './App';

const HomePageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(${HomeImage});
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center bottom;
`

const HomePageMainContent = styled.div`
  padding-top: 7em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`

const MainContentColumns = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const TaskListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%
`

const TaskWrapper = styled.div`
  padding: 1.5em;
  border-radius: 10px;
  margin-bottom: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 0 10px 10px #dddddd;
`

const TaskIconWrapper = styled.div`
  background-color: var(--primary-color);
  border-radius: 50%;
  padding: 1em;
  color: white;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const testFriends = [
  {
    name: 'Ashley Cheung'
  },
  {
    name: 'Abigail Limanuel'
  },
  {
    name: 'Kinzey Rahardja'
  },
  {
    name: 'Jessica Zheng'
  },
  {
    name: 'Jefferson Lieuw'
  },
]

function CreateTaskWidget (props) {
  const api = useContext(ApiContext);
  const [name, setName] = useState('');
  const currDateStr = (new Date()).toISOString().slice(0, -8);
  const [date, setDate] = useState(currDateStr);
  const token = window.localStorage.getItem('token');
  const alert = useContext(SnackbarSetContext);
  const history = useHistory();
  const onCreate = () => {
    if (name.length === 0) {
      alert('Name cannot be empty');
      return;
    } else if (token === undefined) {
      alert('No token saved');
      history.push('/login');
      return;
    }
    const unixTime = (new Date(date).getTime() / 1000);
    // Make api call
    api.taskCreate(token, name, unixTime)
      .then(r => {
        if (r.status === 200) {
          // Refresh tasks to update
          props.loadTasks();
          // Close tab
          props.setActive(false);
        } else {
          alert(`Server returned with status ${r.status}`)
        }
      })
  }
  return (
    <div>
      <div style={{width: '100%', marginBottom: '1.5em', marginTop: '1em' }}>
        <TextField style={{width: '100%', margin: '0px'}}
          onChange={e => setName(e.target.value)} value={name} label="Name"/>
      </div>
      <TextField style={{ marginBottom: '1.5em', width: '100%'}} color='primary'
        label='Due date' type='datetime-local'
        onChange={e => setDate(e.target.value)} value={date}
      />
      <Button variant="contained" color="primary"
        style={{ width: '100%'}} onClick={onCreate}>Create</Button>
    </div>
  )
}

CreateTaskWidget.propTypes = {
  loadTasks: PropTypes.func,
  setActive: PropTypes.func
}

export default function HomePage () {
  const [tasks, setTasks] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState('');
  const [duration, setDuration] = useState(1);
  const [newMember, setNewMember] = useState('')
  const [lastPollTime, setLastPollTime] = useState(new Date());
  const history = useHistory();
  const api = useContext(ApiContext);
  const token = window.localStorage.getItem('token');
  const loadTasks = () => {
    // Get token
    if (token === undefined) {
      alert('No token stored');
      history.push('/login');
      return;
    }
    // Get tasks
    api.taskList(token)
      .then(r => {
        // If successful store task
        if (r.status === 200) {
          r.json()
            .then(r => {console.log(r.tasks); setTasks(r.tasks)})
        } else {
          alert(`Server replied with status ${r.status}`)
        }
      })
  }
  // Call api every 1 seconds
  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      // Prevents changing state when component is
      // unmounted
      if (isMounted) {
        loadTasks();
        setLastPollTime(new Date());
      }
    }, 1000)
    return () => { isMounted = false};
  }, [lastPollTime])
  // Load tasks on run
  useEffect( loadTasks, [api, history, token])
  const renderTasks = () => {
    const renderSessionBtn = (t) => {
      const onClick = () => {
        history.push(`/room/${t.taskID}`)
      }
      if (t.sessionIDs.length !== 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
            <Button variant="contained" color="primary" onClick={onClick}>
              Join</Button>
          </div>
        )
      }
    }
    return (
      <TaskListWrapper>
        {tasks.map(t => (
          <TaskWrapper key={t.taskID}>
            <TaskIconWrapper>
              <ImportContactsIcon/>
            </TaskIconWrapper>
            <div style={{ marginLeft: '1.5em', fontSize: '1.2em', fontWeight: '600' }}>
              <div>{t.name}</div>
              <div style={{ color: 'grey'}}>{new Date(parseInt(t.dueDate) * 1000).toLocaleString()}</div>
              { renderSessionBtn(t) }
            </div>
            <IconButton
              onClick={() => {setShowInvite(true); setSelectedTaskID(t.taskID)}}
              style={{ marginLeft: '1em',
              backgroundColor: 'var(--primary-color)' }}
            >
              <AddIcon style={{ color: 'white' }}/>
            </IconButton>
          </TaskWrapper>
        ))} 
      </TaskListWrapper>
    )
  }
  const renderFriends = () => {
    return (
      <TaskListWrapper>
        {testFriends.map((t, i) => (
          <TaskWrapper key={i}>
            <TaskIconWrapper style={{ backgroundColor: 'grey'}}>
              <PersonIcon style={{ fontSize: '2em'}}/>
            </TaskIconWrapper>
            <div style={{ marginLeft: '1.5em', fontSize: '1.2em', fontWeight: '600' }}>
              <div>{t.name}</div>
            </div>
          </TaskWrapper>
        ))} 
      </TaskListWrapper>
    )
  }
  const renderButtonText = () => {
    if (timerActive) {
      return (<PauseIcon/>)
    }
    return (<PlayArrowIcon/>)
  }
  const parseIntText = (text) => {
    if (text.length === 0) {
      return 0;
    }
    return parseInt(text);
  }
  const onAdd = () => {
    api.userSearch(newMember, token)
      .then(r => {
        if (r.status === 200) {
          r.json()
            .then(r => api.taskInvite(token, r.uID, selectedTaskID))
            .then(r => setShowInvite(r.status !== 200))
          return;
        }
        r.text()
          .then(r => console.log(r))
      })
  }
  return (
    <HomePageWrapper>
      <Dialog open={showAddTask} onClose={() => setShowAddTask(false)}>
        <DialogTitle>Add a task</DialogTitle>
        <DialogContent>
          <CreateTaskWidget setActive={setShowAddTask} loadTasks={loadTasks}/>
        </DialogContent>
      </Dialog>
      <Dialog open={showInvite} onClose={() => setShowInvite(false)}>
        <DialogTitle>Invite a user</DialogTitle>
        <DialogContent>
          <div style={{width: '100%', marginBottom: '1.5em', marginTop: '1em',
            display: 'flex'}}>
            <TextField 
              value={newMember} onChange={e => setNewMember(e.target.value)}
              style={{width: '100%', margin: '0px'}}
              label="Add Members"/>
            <IconButton
              onClick={onAdd}
              style={{ marginLeft: '1em',
              backgroundColor: 'var(--primary-color)' }}
            >
              <AddIcon style={{ color: 'white' }}/>
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
      <NavBar selected='home'/>
      <HomePageMainContent>
        <MainContentColumns>
          <LoginPageTitle style={{ marginBottom: '1em' }}>
            Today's Progress</LoginPageTitle>
            { renderTasks() }
            <Button variant="outlined" color="primary"
              style={{ fontSize: '1.5em', width: '70%', marginTop: '1em' }}
              onClick={() => setShowAddTask(true)}
              >Add Task</Button>
        </MainContentColumns>
        <MainContentColumns>
          <Timer duration={parseIntText(duration)} active={timerActive}/>
          <TextField type="number" style={{ width: '50%' }} label="Duration (Minutes)"
            value={duration} onChange={e => {
              setDuration(e.target.value);
            }}
            ></TextField>
          <Button style={{ fontSize: '1.5em', width: '50%', marginTop: '1em' }}
            variant="contained" color="primary" onClick={() => setTimerActive(!timerActive)}>
            { renderButtonText() }
          </Button>
        </MainContentColumns>
        <MainContentColumns>
          <LoginPageTitle style={{ marginBottom: '1em' }}>
            Friend Activity</LoginPageTitle>
          { renderFriends() }
        </MainContentColumns>
      </HomePageMainContent>
    </HomePageWrapper>
  )
}