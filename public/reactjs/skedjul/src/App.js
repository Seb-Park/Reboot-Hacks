import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";

import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
  IfFirebaseUnAuthed
} from "@react-firebase/auth"
import firebaseConfig from "./firebaseConf.js"


function App() {
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/signin" component={SignIn} />
        </Switch>
      </Router>
    </FirebaseAuthProvider>
  );
}

function SignIn() {
  return (
    <div>
      <SignInButton/>
    </div>
  );
}

function SignInButton() {
  const history = useHistory();

  return (
    <button onClick={() => {
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(googleAuthProvider).then((result) => {
        console.log(result);
        history.push('/home');
      }).catch((error) => { 
        console.log(error);
        history.push('/signin/failed');
      });
    }}>
      Sign in with Google
    </button>
  )
}

function ForceSignIn(Inner) {
  return (
    <div>
      <IfFirebaseAuthedAnd filter={({ providerId }) => providerId !== "anonymous"}>
        {() => {
          return(Inner)
        }}
      </IfFirebaseAuthedAnd>
      <IfFirebaseUnAuthed>
        <Redirect push to='/signin' />
      </IfFirebaseUnAuthed>
    </div>
  );
}

function Home() {
  return ForceSignIn(
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => {
          firebase.auth().signOut();
        }}>
          Sign Out
        </button>
      </header>
    </div>
  )
}

export default App;
