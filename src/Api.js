/*
  This is an abstraction of the API
*/

export default class API {
  constructor(url) {
    this.url = url;
  }
  /*
    Just to test the root page
  */
  root() {
    return fetch(this.url);
  }
  /**
  * Calls the auth register route and returns a promise
    Read more on Javascript promises here:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  */
  authRegister(email, firstName, lastName, password) {
    return fetch(`${this.url}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
    })
  }
  /**
  * Calls the auth register route and returns a promise
  */
  authLogin(email, password) {
    console.log('Auth called')
    return fetch(`${this.url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
  }
  /**
  * Calls the auth register route and returns a promise
  */
  authLogout(token) {
    return fetch(`${this.url}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token
      })
    })
  }
  /**
    For a valid user, returns information about their
    uid, email, firstName, lastName, and handle
  */
  userProfile(uid) {
    return fetch(`${this.url}/user/profile?uid=${uid}`)
  }
  /*
    Given email return uid
  */
  userSearch(email, token) {
    return fetch(`${this.url}/user/search?email=${email}&token=${token}`)
  }
  /**
    Get all the tasks of a given user and also the sessions.
  */
  taskList(token) {
    return fetch(`${this.url}/task/list?token=${token}`)
  }
  /**
    Creates a new task. This is different from a session.
    A task is a goal to accomplish. This route will be called
    by a specific user with their uid associated with their token.
  */
  taskCreate(token, name, dueDate) {
    return fetch(`${this.url}/task/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        name: name,
        dueDate: dueDate
      })
    })
  }
  /**
    Invites a user with the given uid to the task.
    The invited friend does not have the option to decline.
    This is for users who have shared common tasks they want to work on together.
  */
  taskInvite(token, uidAdd, taskID) {
    return fetch(`${this.url}/task/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        uidAdd: uidAdd,
        taskID: taskID
      })
    })
  }
  /**
    Used to update the details of the task, setting them
    to new values. Requires a token to check that is a valid user
  */
  taskUpdate(token, taskID, name, dueDate) {
    return fetch(`${this.url}/task/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        taskID: taskID,
        name: name,
        dueDate: dueDate
      })
    })
  }
  /**
    Deletes a task
  */
  taskDelete(token, taskID) {
    return fetch(`${this.url}/task/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        taskID: taskID
      })
    })
  }
  /**
    Used to create a new lobby room for participants to work on their task.
    Session does not start until a form of input is given by the users
    that all desired members are in the session.
  */
  taskSessionCreate(token, taskID, duration) {
    console.log(taskID);
    return fetch(`${this.url}/task/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        taskID: taskID,
        duration: duration,
        scheduledTime: 0
      })
    })
  }
  /**
    Start the timer on the task. Duration returned is set to negative
    if the task is not timed. Also returns timeStart which is the time
    on the server of when. The user will start the session once they have
    visually checked that other desired users are in the session.
  */
  taskSessionStart(token, sessionID) {
    return fetch(`${this.url}/task/session/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        sessionID: sessionID,
      })
    })
  }
  /**
    This allows a user that is part of the same overarching task,
    to join a specific session. Multiple sessions can be associated
    with a single task as it may take multiple sessions for the task to be completed.
  */
  taskSessionJoin(token, sessionID) {
    return fetch(`${this.url}/task/session/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        sessionID: sessionID
      })
    })
  }
  /*
    Removes the user from a session
  */
  taskSessionLeave(token, sessionID) {
    return fetch(`${this.url}/task/session/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        sessionID: sessionID
      })
    })
  }
  /**
    This route will be called in succession to synchronise timers across devices.
    Tells you the start time, end time, if the session is active and how
    long is left of an active session. 
    
    Can be used by other users to check if the task’s timer has already started.
    Needs to implement a way for the timer to not have started.
  */
  taskSessionInfo(token, sessionID) {
    return fetch(`${this.url}/task/session/info?token=${token}&sessionID=${sessionID}`)
  }
  /**
    Sets the task to have failed prematurely. A reason is also sent
    to also give a visual and/or textual prompt to the user interface
  */
  taskSessionEnd(token, sessionID) {
    return fetch(`${this.url}/task/session/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        sessionID: sessionID,
        reason: 'Left before timer ended'
      })
    })
  }
}