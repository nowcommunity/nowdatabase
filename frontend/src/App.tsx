/* eslint-disable no-console */
import { useState } from 'react'
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const App = () => {
  const [text, setText] = useState('___')

  const onClick = () => {
    fetch('http://localhost:4000/ping')
      .then(response => response.json().then(result => setText(result.message)))
      .catch(e => console.log('Error', e))
  }

  return (
    <>
      <Box>
        <Typography component="h1">NOW Database</Typography>
        <p>Hello world</p>
        <button onClick={onClick}>Ping backend</button>
        <p>Result: {text === 'pong' ? 'Connection to backend works!' : 'Backend has not responded.'}</p>
      </Box>
    </>
  )
}

export default App
