import axios from 'axios'

export default function users(state = {users: [], user: false}, action){
  switch(action.type){
    case 'SIGN_UP':
      return Object.assign({}, state, {user: action.payload})
    case 'GOT_USERS':
      return Object.assign({}, state, {users: action.payload})
    case 'SIGNUP_ERROR':
      return Object.assign({}, state, {session_error: 'Login Failure'})
    case 'CLEAR_EVERYTHING':
      return {}
    default:
		  return state
	}
}

const signedUp = (data) => {
  return {type: 'SIGN_UP', payload: data}
}

const failedSignUp = (data) => {
  return {type: 'SIGNUP_ERROR', payload: data}
}

const gotUsers = (data) => {
  return {type: 'GOT_USERS', payload: data}
}

export const signUp = (data) => {
  return function(dispatch){
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/signup',
      data: {email: data.email, password: data.password}
    }).then(function(response){
      console.log(response)
      dispatch(signedUp(response.data))
    }).catch(function(error){
      console.log(error)
      console.log(error.response)
      dispatch(failedSignUp(error.response.data))
    })
  }
}

export const getUsers = () => {
  return function(dispatch){
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:5000/users',
      headers: {"Authorization": "Bearer "+localStorage.getItem("access")}
    }).then(function(response){
      console.log(response)
      dispatch(gotUsers(response.data))
    }).catch(function(error){
      console.log(error)
      console.log(error.response)
    })
  }
}
