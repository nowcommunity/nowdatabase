/* eslint-disable no-console */
import { useState } from 'react'
import Box from '@mui/material/Box'

export const FrontPage = () => {
  const [text, setText] = useState('___')

  const onClick = () => {
    fetch('http://localhost:4000/ping')
      .then(response => response.json().then(result => setText(result.message)))
      .catch(e => console.log('Error', e))
  }

  return (
    <Box>
      <p>Hello world</p>
      <button onClick={onClick}>Ping backend</button>
      <p>Result: {text === 'pong' ? 'Connection to backend works!' : 'Backend has not responded.'}</p>
    </Box>
  )
}
