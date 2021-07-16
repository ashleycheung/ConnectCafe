import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`

const StyledInput = styled.input`
  
`

export default function TaskCreate () {
  return (
    <Wrapper>
      <StyledInput placeholder/>
      <StyledInput/>
    </Wrapper>
  )
}