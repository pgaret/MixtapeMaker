import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import {newSession} from '../reducers/sessions'

class SignIn extends Component {
  constructor(props){
    super(props)
    this.state = {email: 'peregringaret@gmail.com', password: 'password123', signingUp: false, signingIn: true}
  }

  handleSignIn = () => {
    this.props.newSession({email: this.state.email, password: this.state.password})
  }

  render() {
    if(this.props.user){
      return <Redirect to="/home" />
    }
    return (
      <div className="SignIn">
        <center>
          Sign In:
          <br />
          Email: <input type="email" value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}} />
          <br />
          Password: <input type="password" value={this.state.password} onChange={(e)=>{this.setState({password: e.target.value})}} />
          <br />
          <button onClick={this.handleSignIn}>Sign In</button>
        </center>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    newSession: (data) => {
      dispatch(newSession(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
