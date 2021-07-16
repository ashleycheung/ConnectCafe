import React, { useContext } from 'react';
import styled from 'styled-components';
import NavBar from './NavBar';
import ProfileImg from './assets/profile.jpg';
import { useParams } from 'react-router';
import { ApiContext } from './App';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const UserPageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const UserPageMainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-top: 10%;
`

const UserProfileImg = styled.img`
  border-radius: 50%;
  height: 20em;
  z-index: 1;
`

const UserProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2em;
  padding-top: 50px;
  margin-top: -100px;
  box-sizing: border-box;
  border-radius: 2em;
  border: 0.5px solid gray;
  flex: 1;
  margin-bottom: 10%;
  width: 90%;
`

const UserProfileData = styled.div`
  font-size: 2em;
`

// const testUserData = {
//   firstName: 'Ashley',
//   lastName: 'Cheung',
//   email: 'Ashley@gmail.com',
//   tasks: [
//     {
//       name: 'Study',
//       dueDate: '23_12_2000',
//       taskId: '0',
//       sessionIDs: [1,2,3]
//     },
//     {
//       name: 'League',
//       dueDate: '23_12_2000',
//       taskId: '1',
//       sessionIDs: [1,2,3]
//     }
//   ]
// }

export default function UserPage () {
  const uid = useParams().uid;
  const api = useContext(ApiContext);
  const [ userData, setUserData ] = useState({});
  const history = useHistory();
  console.log(uid);
  // Get user data on load
  useEffect(() => {
    // Get data about user
    api.userProfile()
      .then(r => {
        switch(r.status) {
          case 200:
            r.json()
              .then(r => {
                // Load user data
                setUserData(r)
              })
            break;
          case 400:
            alert('Invalid user id');
            history.push('/home');
            break;
          default:
            alert(`Server replied with ${r.status}`)
        }
      })
  }, [api, history])
  // Loads the profile data
  const generateProfileData = () => {
    if (Object.keys(userData).length === 0) {
      return;
    }
    return (
      <UserProfileContent>
        <UserProfileData>{userData.firstName} {userData.lastName}</UserProfileData>
        <UserProfileData>{userData.email}</UserProfileData>
      </UserProfileContent>
    )
  }
  return (
    <UserPageWrapper>
      <NavBar/>
      <UserPageMainContent>
        <UserProfileImg src={ProfileImg}/>
        { generateProfileData() }
      </UserPageMainContent>
    </UserPageWrapper>
  )
}