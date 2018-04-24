import React, { Component } from 'react';

class SessionInterface extends Component {
  constructor(props){
    super(props)
    this.state = {
      signingUp: false, signingIn: true
    }
  }

  render(){
    return(
      <button onClick={()=>{this.setState({signingUp: true, signingIn: false}); this.props.history.push("/signup")}}>Sign Up</button>
      <button onClick={()=>{this.setState({signingIn: true, signingUp: false}); this.props.history.push("/signin")}}>Sign In</button>
    )
  }
}
