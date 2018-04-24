import React, { Component } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import SignIn from './containers/SignIn'
import SignUp from './containers/SignUp'
import {newSession} from './reducers/sessions'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount = () => {
    if (!this.props.user){
      this.props.history.push("/signin")
    }
  }

  signUp = () => {
    axios({
      method: "POST",
      url: 'http://127.0.0.1:5000/users',
      data: {email: this.state.email, password: this.state.password}
    }).then(function(response){
      console.log(response)
    }).catch(function(error){
      console.log(error)
      console.log(error.response)
    })
  }

  signIn = () => {

  }

  searchArtists = () => {
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:5000/setlists/artists?artistName='+this.state.artistName
    }).then(function(response){
      console.log(response)
    }).catch(function(error){
      console.log(error)
      console.log(error.response)
    })
  }

  render() {
    return (
      <div className="App">
        <center>MixtapeMaker</center>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.users.user}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
