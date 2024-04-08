import { useState } from 'react'
import { useTryLoginMutation } from '../redux/userReducer'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [mutation, result] = useTryLoginMutation()
  const login = async () => {
    await mutation(username)
    console.log(result)
  }

  return (
    <div>
      <input type="text" onChange={event => setUsername(event.currentTarget.value)} value={username}></input>
      <button onClick={login}>Login</button>
      {result.isSuccess && <div>{JSON.stringify(result, null, 2)}</div>}
    </div>
  )
}
