import React, { Component } from 'react';
import {connect} from 'react-redux'
import axios from 'axios'
import {newSession} from '../reducers/sessions'

class SignUp extends Component {
  constructor(props){
    super(props)
    this.state = {email: 'peregringaret@gmail.com', password: 'password123', signingUp: false, signingIn: true}
  }

  render() {
    return (
      <div className="SignUp">
        <center>
          Sign Up:
          <br />
          Email: <input type="email" value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}} />
          <br />
          Password: <input type="password" value={this.state.password} onChange={(e)=>{this.setState({password: e.target.value})}} />
          <br />
          <button onClick={this.signUp}>Sign Up</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
