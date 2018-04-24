import {combineReducers} from 'redux'
import sessions from './sessions.js'
import users from './users.js'

export default combineReducers({
  sessions, users
})
