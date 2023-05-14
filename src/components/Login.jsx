import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: ${props => props.loginOrSignUp ? 'flex-start' : 'flex-end'};
`;

function Login() {
  const [loginOrSignUp, setLoginOrSignUp] = useState(false);

  const onClickMe = () => {
    setLoginOrSignUp(!loginOrSignUp)
  }

  return (
    <Container>
      <Wrapper loginOrSignUp={loginOrSignUp}>

      </Wrapper>
      <button onClick={() => onClickMe()}>Click me</button>
    </Container>
  )
}

export default Login
