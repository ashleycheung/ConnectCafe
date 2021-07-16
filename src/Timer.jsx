import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

const TimerWrapper = styled.div`
  position: relative;
`

const TimerTextWrapper = styled.div`
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const TimerText = styled.div`
  font-size: 4em;
  font-weight: 500;
`

export default function Timer (props) {
  const [timeLeft, setTimeLeft] = useState(props.duration * 60);
  useEffect(() => {
    setTimeLeft(props.duration * 60);
  }, [props.duration])
  useEffect(() => {
    let isMounted = true;
    if (props.active) {
      setTimeout(() => {
        // Prevents changing state when component is
        // unmounted
        if (isMounted) {
          // Check if there is a new time update
          if (props.updateTimeLeft !== undefined) {
            const newTime = props.updateTimeLeft();
            if (newTime !== undefined) {
              setTimeLeft(newTime);
              return;
            }
          }
          setTimeLeft(timeLeft - 0.01);
        }
      }, 10)
    }
    return () => { isMounted = false};
  }, [timeLeft, props.active, props]);
  const circleStyle = {
    color: 'var(--primary-color)'
  }
  const getTimeText = (timeSeconds) => {
    const mins = Math.floor(timeLeft / 60);
    const secs = Math.floor(timeSeconds - mins * 60);
    if (secs < 10) {
      return `${mins}:0${secs}` 
    }
    return `${mins}:${secs}`
  }
  return (
    <TimerWrapper>
      <CircularProgress style={circleStyle} size="300px" variant='determinate'
        value={100 * timeLeft / (props.duration * 60)}/>
      <TimerTextWrapper>
        <TimerText>
          {getTimeText(timeLeft)}
        </TimerText>
      </TimerTextWrapper>
    </TimerWrapper>
  )
}

Timer.propTypes = {
  duration: PropTypes.number,
  active: PropTypes.bool,
  updateTimeLeft: PropTypes.func,
}