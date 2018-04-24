import axios from 'axios'
import {getUsers} from './users.js'

export default function sessions(state = {session: {}, session_error: {}}, action){
  switch(action.type){
    case 'NEW_SESSION':
      return Object.assign({}, state, {session: action.payload})
    case 'SIGNIN_ERROR':
      return Object.assign({}, state, {session_error: 'Login Failure'})
    case 'CLEAR_EVERYTHING':
      return {}
    default:
		  return state
	}
}

const enteredSession = (data) => {
  console.log(data)
  return {type: 'NEW_SESSION', payload: data}
}

const failedSession = (data) => {
  return {type: 'SIGNIN_ERROR', payload: data}
}

export const newSession = (data) => {
  return function(dispatch){
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/signin',
      data: {email: data.email, password: data.password}
    }).then(function(response){
      console.log(response)
      localStorage.setItem('access', "Bearer "+response.data.access_token)
      dispatch(enteredSession(response.data))
      dispatch(getUsers())
    }).catch(function(error){
      console.log(error)
      console.log(error.response)
      dispatch(failedSession(error.response.data))
    })
  }
}
