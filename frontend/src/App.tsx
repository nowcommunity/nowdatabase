/* eslint-disable no-console */
import { useState } from 'react'

const App = () => {
  const [text, setText] = useState('___')

  const onClick = () => {
    fetch('http://localhost:4000/ping')
      .then(response => response.json().then(result => setText(result.message)))
      .catch(e => console.log('Error', e))
  }

  return (
    <>
      <div>
        <h1>NOW Database</h1>
        <p>Hello world</p>
        <button onClick={onClick}>Ping backend</button>
        <p>Result: {text === 'pong' ? 'Connection to backend works!' : 'Backend has not responded.'}</p>
      </div>
    </>
  )
}

export default App
