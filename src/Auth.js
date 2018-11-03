import React, {Component} from 'react';
import config from './FirebaseConfig';

// importing firebase:
var firebase = require('firebase');

// Initializing Firebase:
firebase.initializeApp(config);

class Auth extends Component {

  constructor(props){
    super(props);

    this.state = {
      err: 'Welcome to login app!',
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(event) {
    event.preventDefault();



    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const fbAuth = firebase.auth();
    const promise = fbAuth.signInWithEmailAndPassword(email, password);

    promise
    .then(user => {
      var emailField = document.getElementById('email');
      var passField = document.getElementById('pass');
      var lout = document.getElementById('logout');
      var lin = document.getElementById('login');
      var sin = document.getElementById('signup');
      emailField.classList.add('hide');
      passField.classList.add('hide');
      lin.classList.add('hide');
      sin.classList.add('hide');
      lout.classList.remove('hide');

      var err = 'Welcome ' + user.user.email;
      this.setState({err: err});
    })
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    });
  }

  signup(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const fbAuth = firebase.auth();
    const promise = fbAuth.createUserWithEmailAndPassword(email, password);

    promise
    .then(user => {
      var err = 'Thanks for signing up ' + user.user.email;
      var sin = document.getElementById('signup');
      sin.classList.add('hide');
      // Sending email verification
      firebase.auth().currentUser.sendEmailVerification().then(() => {
        // Email verification sent
      }).catch(e => {
        // Email verification not sent
      });

      firebase.database().ref('/users' + user.user.uid).set({
        email: user.user.email,
      });
      console.log(user);
      this.setState({err: err });
    })
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err });
    });

  }

  logout(event) {
    event.preventDefault();
    firebase.auth().signOut();
    var emailField = document.getElementById('email');
    var passField = document.getElementById('pass');
    var lout = document.getElementById('logout');
    var lin = document.getElementById('login');
    var sin = document.getElementById('signup');
    emailField.classList.remove('hide');
    passField.classList.remove('hide');
    lin.classList.remove('hide');
    sin.classList.remove('hide');
    lout.classList.add('hide');
    var err = 'Thank you for visiting.';
    this.setState({err: err});
  }

  render(){
    return(
      <div>

        <h1>{this.state.err}</h1>
        <input id="email" ref="email" type="email" placeholder="Enter your email" /><br />
        <input id="pass" ref="password" type="password" placeholder="Enter your password" /><br />

        <button onClick={this.login} id="login">Log In</button>
        <button onClick={this.signup} id="signup">Sign Up</button>
        <button id="logout" className="hide" onClick={this.logout}>Log Out</button>

      </div>
    );
  }
}

export default Auth;
